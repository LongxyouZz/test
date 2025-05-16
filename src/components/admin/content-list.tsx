"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { Database } from "@/types/supabase";
import { deleteContentAction } from "@/app/actions";
import { Pencil, Trash2, Eye, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface ContentListProps {
  onEdit: (content: Content) => void;
  onView: (content: Content) => void;
  onAnalytics: (content: Content) => void;
}

export default function ContentList({
  onEdit,
  onView,
  onAnalytics,
}: ContentListProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [language, setLanguage] = useState<string>("all");
  const supabase = createClient();

  const fetchContents = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("content").select("*");

      // Apply status filter
      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      // Apply language filter
      if (language !== "all") {
        query = query.eq("language", language);
      }

      // Order by created_at
      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error("Error fetching contents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [filter, language]);

  const handleDelete = async (contentId: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    const formData = new FormData();
    formData.append("contentId", contentId);

    try {
      await deleteContentAction(formData);
      setContents(contents.filter((content) => content.id !== contentId));
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading content...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold">Content Management</h2>

        <div className="flex gap-2">
          <Tabs
            defaultValue="all"
            value={filter}
            onValueChange={setFilter}
            className="w-[200px]"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            defaultValue="all"
            value={language}
            onValueChange={setLanguage}
            className="w-[150px]"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="en">EN</TabsTrigger>
              <TabsTrigger value="km">KM</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {contents.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No content found. Create some content to get started.
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contents.map((content) => (
                  <tr key={content.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">{content.title}</div>
                      {content.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize">
                      {content.content_type}
                    </td>
                    <td className="px-4 py-3 text-sm uppercase">
                      {content.language}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          content.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : content.status === "draft"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {content.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(content.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(content)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(content)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onAnalytics(content)}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(content.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
