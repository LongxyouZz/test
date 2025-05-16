"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from "../../../supabase/client";
import { Database } from "@/types/supabase";

type Content = Database["public"]["Tables"]["content"]["Row"];

interface MediaUploadProps {
  contentId: string;
  onUploadComplete?: () => void;
}

export default function MediaUpload({
  contentId,
  onUploadComplete,
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !contentId) return;

    setIsUploading(true);
    setProgress(0);

    try {
      // Determine media type
      const mediaType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "other";

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${contentId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(filePath);

      // Create media record in database
      const { error: dbError } = await supabase.from("media").insert({
        content_id: contentId,
        url: publicUrl,
        media_type: mediaType,
        title: title || file.name,
        alt_text: altText,
        // For images, we could get dimensions
        // For videos, we could get duration
      });

      if (dbError) throw dbError;

      // Reset form
      setFile(null);
      setTitle("");
      setAltText("");

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="media">Upload Media</Label>
        <Input
          id="media"
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Media title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="altText">Alt Text</Label>
        <Input
          id="altText"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the media for accessibility"
        />
      </div>

      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-sm text-gray-500 mt-1">{progress}% uploaded</p>
        </div>
      )}

      <Button type="submit" disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload Media"}
      </Button>
    </form>
  );
}
