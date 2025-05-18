import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, UserCircle, Plus, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is admin or moderator
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  const isAdmin = userRoles?.some((role) => role.role === "admin");
  const isModerator = userRoles?.some((role) => role.role === "moderator");
  const hasAdminAccess = isAdmin || isModerator;

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your content and account
              </p>
            </div>
            {hasAdminAccess && (
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Content
              </Button>
            )}
          </header>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              {hasAdminAccess && (
                <TabsTrigger value="admin">Admin Panel</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <section className="bg-card rounded-xl p-6 border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <UserCircle size={48} className="text-primary" />
                  <div>
                    <h2 className="font-semibold text-xl">User Profile</h2>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
                  <pre className="text-xs font-mono max-h-48 overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>

                {hasAdminAccess && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-medium text-blue-600 dark:text-blue-400">
                        {isAdmin ? "Admin Access" : "Moderator Access"}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You have {isAdmin ? "administrator" : "moderator"}{" "}
                      privileges. You can manage content and users from the
                      Admin Panel tab.
                    </p>
                  </div>
                )}
              </section>

              {!hasAdminAccess && <SetupAdmin userId={user.id} />}
            </TabsContent>

            {hasAdminAccess && (
              <TabsContent value="admin" className="mt-6">
                <AdminDashboard isAdmin={isAdmin} userId={user.id} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </>
  );
}
