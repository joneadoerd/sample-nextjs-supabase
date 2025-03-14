import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("Couldn't find db url");
}
const sql = postgres(dbUrl);

async function main() {
  // ✅ Function to handle user creation (Insert into profile)
  await sql`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profile (id, email)
      VALUES (NEW.id, NEW.email);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // ✅ Trigger to run when a new user is created
  await sql`
    CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  `;

  // ✅ Function to handle user deletion (Remove from auth.users)
  await sql`
    CREATE OR REPLACE FUNCTION public.handle_user_delete()
    RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM auth.users WHERE id = OLD.id;
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // ✅ Trigger to run when a profile is deleted (Deletes auth user)
  await sql`
    CREATE OR REPLACE TRIGGER on_profile_user_deleted
    AFTER DELETE ON public.profile
    FOR EACH ROW EXECUTE PROCEDURE public.handle_user_delete();
  `;

  // ✅ Function to update profile.email when auth.users.email changes
  await sql`
    CREATE OR REPLACE FUNCTION public.handle_user_email_update()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Prevent infinite loop by checking if the email has actually changed
    IF OLD.email IS DISTINCT FROM NEW.email THEN
      UPDATE public.profile
      SET email = NEW.email
      WHERE id = NEW.id;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // ✅ Trigger to update profile email when auth.users email changes
  await sql`
  CREATE OR REPLACE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_email_update();
  `;

  // ✅ Function to update auth.users.email when profile.email changes
  await sql`
    CREATE OR REPLACE FUNCTION public.handle_profile_email_update()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Prevent infinite loop by checking if the email has actually changed
      IF OLD.email IS DISTINCT FROM NEW.email THEN
        UPDATE auth.users
        SET email = NEW.email
        WHERE id = NEW.id;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // ✅ Trigger to update auth.users email when profile.email changes
  await sql`
  CREATE OR REPLACE TRIGGER on_profile_email_updated
  AFTER UPDATE OF email ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_email_update();
  `;

  console.log("Triggers and functions have been successfully added.");
  process.exit();
}

main();
