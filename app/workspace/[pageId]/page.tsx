"use client";

import React, { useState, useEffect, use } from "react";
import { SyncSpaceEditor } from "@/components/editor/syncspace-editor";
import { useCurrentUser } from "@/hooks/use-current-user";

interface PageProps {
  params: Promise<{ pageId: string }>;
}

export default function WorkspacePageDetail({ params }: PageProps) {
  const { pageId } = use(params);
  const { user } = useCurrentUser();
  const [page, setPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/pages/${pageId}`);
        if (res.ok) {
          const data = await res.json();
          setPage(data);
        }
      } catch (err) {
        console.error("Fetch page error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPage();
  }, [pageId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-8 animate-pulse font-body">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted/60" />
          <div className="h-8 w-1/2 rounded-lg bg-muted/60" />
        </div>
        <div className="space-y-3 pt-6">
          <div className="h-4 w-full rounded bg-muted/40" />
          <div className="h-4 w-5/6 rounded bg-muted/40" />
          <div className="h-4 w-3/4 rounded bg-muted/40" />
        </div>
      </div>
    );
  }

  return (
    <SyncSpaceEditor
      pageId={pageId}
      userId={user?.id || "anonymous-user"}
      userName={user?.name || "Collaborator"}
      initialTitle={page?.title || "Untitled"}
      initialBlocks={page?.blocks}
      onTitleChange={async (newTitle) => {
        try {
          await fetch(`/api/pages/${pageId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
          });
        } catch (err) {
          console.error("Update page title error:", err);
        }
      }}
    />
  );
}
