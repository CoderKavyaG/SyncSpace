"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { SyncState } from "@/lib/yjs-provider";

interface SyncStatusBadgeProps {
  state: SyncState;
  pendingUpdatesCount?: number;
}

export function SyncStatusBadge({ state, pendingUpdatesCount = 0 }: SyncStatusBadgeProps) {
  const hasShownOfflineToast = useRef(false);
  const prevState = useRef<SyncState>(state);

  // Trigger non-repeating offline toast notification
  useEffect(() => {
    if (state === "offline" && !hasShownOfflineToast.current) {
      toast("You're offline — changes will sync when reconnected", {
        icon: <WifiOff className="w-4 h-4 text-muted-foreground" />,
        duration: 4000,
      });
      hasShownOfflineToast.current = true;
    }

    if (state === "synced" && prevState.current === "syncing") {
      // Optional subtle transition callback
    }

    prevState.current = state;
  }, [state]);

  return (
    <div className="inline-flex items-center font-body text-xs select-none">
      <AnimatePresence mode="wait">
        {state === "offline" && (
          <motion.div
            key="offline"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 text-muted-foreground"
            title="No connection to relay server. Document saved locally in IndexedDB."
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-muted-foreground/40 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground/60" />
            </span>
            <span className="text-[11px] font-medium font-mono">Offline</span>
          </motion.div>
        )}

        {state === "syncing" && (
          <motion.div
            key="syncing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-primary"
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-[11px] font-semibold font-display">
              {pendingUpdatesCount > 0 ? `Syncing (${pendingUpdatesCount})...` : "Syncing..."}
            </span>
          </motion.div>
        )}

        {state === "synced" && (
          <motion.div
            key="synced"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.12 }}
            >
              <Check className="w-3 h-3 text-secondary" />
            </motion.span>
            <span className="text-[11px] font-medium font-mono">Synced</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
