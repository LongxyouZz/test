"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ContentList from "./content-list";
import ContentForm from "./content-form";
import UserRoleManager from "./user-role-manager";
import MediaUpload from "./media-upload";
import ContentAnalyticsComponent from "./content-analytics";
import { Database } from "@/types/supabase";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface AdminDashboardProps {
  isAdmin: boolean;
  userId: string;
}

export default function AdminDashboard({
  isAdmin,
  userId,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("content");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const handleCreateContent = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditContent = (content: Content) => {
    setSelectedContent(content);
    setIsEditDialogOpen(true);
  };

  const handleViewContent = (content: Content) => {
    setSelectedContent(content);
    setIsMediaDialogOpen(true);
  };

  const handleAnalyticsContent = (content: Content) => {
    setSelectedContent(content);
    setIsAnalyticsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Button onClick={handleCreateContent}>
          <Plus className="mr-2 h-4 w-4" /> Create New Content
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[600px] grid-cols-2">
          <TabsTrigger value="content">Content Management</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <ContentList
            onEdit={handleEditContent}
            onView={handleViewContent}
            onAnalytics={handleAnalyticsContent}
          />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="mt-6">
            <UserRoleManager />
          </TabsContent>
        )}
      </Tabs>

      {/* Create Content Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
          </DialogHeader>
          <ContentForm mode="create" />
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <ContentForm content={selectedContent} mode="edit" />
          )}
        </DialogContent>
      </Dialog>

      {/* Media Upload Dialog */}
      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Media Management</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {selectedContent.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedContent.description}
                </p>
              </div>
              <MediaUpload contentId={selectedContent.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog
        open={isAnalyticsDialogOpen}
        onOpenChange={setIsAnalyticsDialogOpen}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Content Analytics</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <ContentAnalyticsComponent contentId={selectedContent.id} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
