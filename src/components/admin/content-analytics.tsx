"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { Database } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, ThumbsUp, Share2, MessageSquare } from "lucide-react";

type Content = Database["public"]["Tables"]["content"]["Row"];
type ContentAnalytics =
  Database["public"]["Tables"]["content_analytics"]["Row"];

interface ContentAnalyticsProps {
  contentId: string;
}

export default function ContentAnalyticsComponent({
  contentId,
}: ContentAnalyticsProps) {
  const [analytics, setAnalytics] = useState<ContentAnalytics | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch content details
        const { data: contentData, error: contentError } = await supabase
          .from("content")
          .select("*")
          .eq("id", contentId)
          .single();

        if (contentError) throw contentError;
        setContent(contentData);

        // Fetch analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from("content_analytics")
          .select("*")
          .eq("content_id", contentId)
          .single();

        if (analyticsError && analyticsError.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error, which is fine
          throw analyticsError;
        }

        // If no analytics exist yet, create a default entry
        if (!analyticsData) {
          const { data: newAnalytics, error: createError } = await supabase
            .from("content_analytics")
            .insert({
              content_id: contentId,
              views: 0,
              likes: 0,
              shares: 0,
              comments: 0,
            })
            .select()
            .single();

          if (createError) throw createError;
          setAnalytics(newAnalytics);
        } else {
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (contentId) {
      fetchData();
    }
  }, [contentId]);

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (!content) {
    return <div className="text-center py-8">Content not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
        <p className="text-muted-foreground">{content.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {analytics?.views || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Likes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {analytics?.likes || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Shares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Share2 className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {analytics?.shares || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {analytics?.comments || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
          <CardDescription>
            Analytics data will be displayed here in the future
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">
              Chart visualization coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
