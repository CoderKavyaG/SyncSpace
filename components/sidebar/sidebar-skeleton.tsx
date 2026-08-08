"use client";

import React from "react";

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-2 animate-pulse">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="w-4 h-4 rounded bg-muted/60" />
        <div className="h-3 w-3/4 rounded bg-muted/60" />
      </div>
      <div className="pl-6 space-y-2">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-4 h-4 rounded bg-muted/40" />
          <div className="h-3 w-2/3 rounded bg-muted/40" />
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-4 h-4 rounded bg-muted/40" />
          <div className="h-3 w-1/2 rounded bg-muted/40" />
        </div>
      </div>
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="w-4 h-4 rounded bg-muted/60" />
        <div className="h-3 w-4/5 rounded bg-muted/60" />
      </div>
    </div>
  );
}
