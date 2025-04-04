"use client";

import {
  User,
  LogOut,
  Server,
  LogIn,
  SquareDashedBottomCodeIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Profile } from "@/prisma/types";
import { getServiceByUserId } from "@/lib/service-actions";
import { useRouter } from "@/i18n/navigation";

interface UserMenuItemsProps {
  user: Profile | null;
  onLogout: () => Promise<void>;
  onClose?: () => void;
}

export function UserMenuItems({ user, onLogout, onClose }: UserMenuItemsProps) {
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose?.();
  };

  const handleServiceNavigation = async () => {
    const { service } = await getServiceByUserId(user?.id || "");
    const path = service
      ? `/services/${user?.id}/edit`
      : `/services/${user?.id}/add`;
    handleNavigation(path);
  };

  return (
    <div className="space-y-1">
      {user && (
        <>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleNavigation("/profile/edit")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleServiceNavigation}
          >
            <Server className="mr-2 h-4 w-4" />
            <span>My Service</span>
          </Button>
        </>
      )}

      {isAdmin && (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleNavigation("/admin")}
        >
          <SquareDashedBottomCodeIcon className="mr-2 h-4 w-4" />
          <span>Admin Settings</span>
        </Button>
      )}

      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={onLogout}
      >
        {user ? (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            <span>Sign in</span>
          </>
        )}
      </Button>
    </div>
  );
}
