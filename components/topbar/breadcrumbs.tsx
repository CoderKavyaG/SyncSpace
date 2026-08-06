"use client";

import React from "react";
import { ChevronRight, Home, FileText } from "lucide-react";

export interface BreadcrumbItem {
  id: string;
  title: string;
  icon?: string | null;
}

interface BreadcrumbsProps {
  workspaceName?: string;
  breadcrumbs: BreadcrumbItem[];
  onSelectBreadcrumb: (id: string) => void;
}

export function Breadcrumbs({
  workspaceName = "Workspace",
  breadcrumbs,
  onSelectBreadcrumb,
}: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-body overflow-x-auto custom-scrollbar py-1">
      <div className="flex items-center gap-1.5 text-foreground font-semibold font-display">
        <Home className="w-3.5 h-3.5 text-primary" />
        <span className="truncate max-w-[120px]">{workspaceName}</span>
      </div>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <React.Fragment key={item.id}>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/50" />
            <button
              type="button"
              onClick={() => onSelectBreadcrumb(item.id)}
              className={`flex items-center gap-1 max-w-[160px] truncate rounded px-1.5 py-0.5 transition-colors ${
                isLast
                  ? "text-foreground font-semibold cursor-default"
                  : "hover:text-foreground hover:bg-accent/40"
              }`}
            >
              {item.icon && <span>{item.icon}</span>}
              <span className="truncate">{item.title || "Untitled"}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
