"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { updateUserRoleAction, removeUserRoleAction } from "@/app/actions";
import { createClient } from "../../../supabase/client";
import { Database } from "@/types/supabase";

type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export default function UserRoleManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("moderator");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*");

        if (usersError) throw usersError;

        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("*");

        if (rolesError) throw rolesError;

        setUsers(usersData || []);
        setUserRoles(rolesData || []);
      } catch (error) {
        console.error("Error fetching users and roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedRole) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("userId", selectedUser);
    formData.append("role", selectedRole);

    try {
      await updateUserRoleAction(formData);

      // Refresh user roles
      const { data, error } = await supabase.from("user_roles").select("*");

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error("Error adding role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("roleId", roleId);

    try {
      await removeUserRoleAction(formData);

      // Update local state
      setUserRoles(userRoles.filter((role) => role.id !== roleId));
    } catch (error) {
      console.error("Error removing role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.full_name || user?.name || user?.email || "Unknown User";
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleAddRole} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user">Select User</Label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || user.name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="content_creator">Content Creator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={!selectedUser || !selectedRole || isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Role"}
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current User Roles</h3>

        {userRoles.length === 0 ? (
          <p className="text-muted-foreground">No user roles assigned yet.</p>
        ) : (
          <div className="border rounded-md divide-y">
            {userRoles.map((role) => (
              <div
                key={role.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{getUserName(role.user_id)}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {role.role}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveRole(role.id)}
                  disabled={isSubmitting}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
