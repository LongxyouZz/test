"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../supabase/client";

export default function SetupAdmin({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const setupAdminRole = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      // Check if the role already exists
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select()
        .eq("user_id", userId)
        .eq("role", "admin")
        .single();

      if (existingRole) {
        setMessage("You already have admin privileges.");
        return;
      }

      // Add admin role to the current user
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: "admin",
      });

      if (error) {
        throw error;
      }

      setMessage(
        "Admin role successfully assigned! Refresh the page to see admin panel.",
      );
    } catch (error) {
      console.error("Error setting up admin:", error);
      setMessage("Failed to set up admin role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm mt-6">
      <h2 className="font-semibold text-xl mb-4">Admin Dashboard Setup</h2>
      <p className="mb-4 text-muted-foreground">
        You don't have admin privileges yet. Click the button below to set
        yourself as an admin.
      </p>
      <Button onClick={setupAdminRole} disabled={isLoading}>
        {isLoading ? "Setting up..." : "Make me an admin"}
      </Button>
      {message && (
        <p className="mt-4 text-sm font-medium text-primary">{message}</p>
      )}
    </div>
  );
}
