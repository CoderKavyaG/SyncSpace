"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import { getUserPresenceColor } from "@/lib/presence-colors";
import { UserAvatar } from "@/components/ui/user-avatar";

export interface UserPresenceInfo {
  clientId: number;
  userId: string;
  name: string;
  avatarUrl?: string | null;
  role?: string;
  isReadOnly?: boolean;
}

interface PresenceAvatarStackProps {
  collaborators: UserPresenceInfo[];
  maxDisplay?: number;
}

export function PresenceAvatarStack({
  collaborators,
  maxDisplay = 4,
}: PresenceAvatarStackProps) {
  if (!collaborators || collaborators.length === 0) return null;

  const visibleCollaborators = collaborators.slice(0, maxDisplay);
  const overflowCount = collaborators.length - maxDisplay;

  return (
    <div className="flex items-center -space-x-2 overflow-hidden py-1 font-body select-none">
      <AnimatePresence mode="popLayout">
        {visibleCollaborators.map((user) => {
          const color = getUserPresenceColor(user.userId);
          const initialLetter = user.name ? user.name[0].toUpperCase() : "U";

          return (
            <motion.div
              key={`${user.clientId}-${user.userId}`}
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative group cursor-pointer"
            >
              {/* Avatar Circle with ring in user's assigned presence color */}
              <div
                className="relative flex h-7 w-7 items-center justify-center rounded-full bg-card border-2 shadow-xs transition-transform group-hover:z-10 group-hover:scale-110"
                style={{ borderColor: color }}
              >
                <UserAvatar name={user.name} image={user.avatarUrl} size="sm" className="w-full h-full border-0" />
              </div>

              {/* Viewer Badge (eye icon) if read-only */}
              {user.isReadOnly && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background border border-border text-muted-foreground shadow-2xs">
                  <Eye className="w-2 h-2 text-muted-foreground" />
                </span>
              )}

              {/* Hover Tooltip */}
              <div className="absolute right-0 top-full z-50 mt-1.5 hidden group-hover:flex flex-col rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-elevated-sm text-xs whitespace-nowrap pointer-events-none">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold text-foreground font-display">
                    {user.name}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  {user.role || "Collaborator"} {user.isReadOnly ? "(View Only)" : ""}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Overflow Avatar Badge */}
      {overflowCount > 0 && (
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-border bg-muted text-[10px] font-bold text-muted-foreground font-mono shadow-xs">
          +{overflowCount}
        </div>
      )}
    </div>
  );
}
