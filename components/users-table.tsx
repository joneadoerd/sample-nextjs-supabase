"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { EditUserDialog } from "@/components/edit-user-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { toast } from "sonner";
import { createUser, updateUser, deleteUser } from "@/actions/user-actions";
import { ProfileOptionalDefaults } from "@/prisma/types";

export function UsersTable({ users }: { users: ProfileOptionalDefaults[] }) {
  const [selectedUser, setSelectedUser] =
    useState<ProfileOptionalDefaults | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 🟠 Handle Create New User
  const handleCreate = () => {
    setSelectedUser(null);
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  // 🟡 Handle Edit User
  const handleEdit = (user: ProfileOptionalDefaults) => {
    setSelectedUser(user);
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  // 🔴 Handle Delete Confirmation
  const handleDeleteConfirm = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  // 🔴 Handle Delete User
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete);
      toast("User deleted successfully", {
        description: "User has been removed.",
      });
    } catch (error: any) {
      toast("Failed to delete user", { description: error.message });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // 🟣 Handle User Update (Create/Edit)
  const handleUpdateUser = async (updatedUser: ProfileOptionalDefaults) => {
    try {
      if (isCreating) {
        await createUser(updatedUser);
        toast("User created successfully", {
          description: "New user has been added.",
        });
      } else {
        await updateUser(updatedUser);

        toast("User updated successfully", {
          description: "User details have been updated.",
        });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast("Error updating user", { description: error.message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Users List</h2>
        <Button onClick={handleCreate} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%] sm:w-auto">Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    <div className="block sm:hidden text-xs text-muted-foreground mt-1">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.role}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteConfirm(user.id)}
                        aria-label={`Delete ${user.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit/Create User Dialog */}
      <EditUserDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUpdate={handleUpdateUser}
        isCreating={isCreating}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        userName={users.find((user) => user.id === userToDelete)?.name || ""}
      />
    </div>
  );
}
