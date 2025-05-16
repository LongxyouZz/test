"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: user.id,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        console.error("Error updating user profile:", updateError);
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// Content Management Actions
export const createContentAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "You must be logged in to create content",
    );
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const contentType = formData.get("contentType") as string;
  const language = formData.get("language") as string;
  const status = formData.get("status") as string;
  const featured = formData.get("featured") === "true";
  const publishDate = formData.get("publishDate") as string;

  if (!title || !contentType || !language) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Title, content type, and language are required",
    );
  }

  const { data: content, error } = await supabase
    .from("content")
    .insert({
      title,
      description,
      content_type: contentType,
      language,
      status,
      featured,
      publish_date: publishDate || null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating content:", error);
    return encodedRedirect("error", "/dashboard", error.message);
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Content created successfully",
  );
};

export const updateContentAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "You must be logged in to update content",
    );
  }

  const contentId = formData.get("contentId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const contentType = formData.get("contentType") as string;
  const language = formData.get("language") as string;
  const status = formData.get("status") as string;
  const featured = formData.get("featured") === "true";
  const publishDate = formData.get("publishDate") as string;

  if (!contentId || !title || !contentType || !language) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Content ID, title, content type, and language are required",
    );
  }

  const { error } = await supabase
    .from("content")
    .update({
      title,
      description,
      content_type: contentType,
      language,
      status,
      featured,
      publish_date: publishDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contentId);

  if (error) {
    console.error("Error updating content:", error);
    return encodedRedirect("error", "/dashboard", error.message);
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Content updated successfully",
  );
};

export const deleteContentAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "You must be logged in to delete content",
    );
  }

  const contentId = formData.get("contentId") as string;

  if (!contentId) {
    return encodedRedirect("error", "/dashboard", "Content ID is required");
  }

  const { error } = await supabase.from("content").delete().eq("id", contentId);

  if (error) {
    console.error("Error deleting content:", error);
    return encodedRedirect("error", "/dashboard", error.message);
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Content deleted successfully",
  );
};

// User Management Actions
export const updateUserRoleAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "You must be logged in to update user roles",
    );
  }

  // Check if current user is admin
  const { data: adminCheck } = await supabase
    .from("user_roles")
    .select()
    .eq("user_id", user.id)
    .eq("role", "admin")
    .single();

  if (!adminCheck) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "You must be an admin to update user roles",
    );
  }

  const targetUserId = formData.get("userId") as string;
  const role = formData.get("role") as string;

  if (!targetUserId || !role) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "User ID and role are required",
    );
  }

  // Check if role already exists for user
  const { data: existingRole } = await supabase
    .from("user_roles")
    .select()
    .eq("user_id", targetUserId)
    .eq("role", role)
    .single();

  if (existingRole) {
    return encodedRedirect("info", "/dashboard", "User already has this role");
  }

  const { error } = await supabase.from("user_roles").insert({
    user_id: targetUserId,
    role,
  });

  if (error) {
    console.error("Error updating user role:", error);
    return encodedRedirect("error", "/dashboard", error.message);
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "User role updated successfully",
  );
};

export const removeUserRoleAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "You must be logged in to remove user roles",
    );
  }

  // Check if current user is admin
  const { data: adminCheck } = await supabase
    .from("user_roles")
    .select()
    .eq("user_id", user.id)
    .eq("role", "admin")
    .single();

  if (!adminCheck) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "You must be an admin to remove user roles",
    );
  }

  const roleId = formData.get("roleId") as string;

  if (!roleId) {
    return encodedRedirect("error", "/dashboard", "Role ID is required");
  }

  const { error } = await supabase.from("user_roles").delete().eq("id", roleId);

  if (error) {
    console.error("Error removing user role:", error);
    return encodedRedirect("error", "/dashboard", error.message);
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "User role removed successfully",
  );
};
