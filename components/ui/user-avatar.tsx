"use client";

import React from "react";
import { getAvatarForSeed } from "@/lib/avatar-generator";

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({
  name,
  image,
  size = "sm",
  className = "",
}: UserAvatarProps) {
  const seed = name || "User";
  const avatar = getAvatarForSeed(seed);

  const sizeClasses = {
    xs: "w-5 h-5",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  // If user has a custom external image URL, render it
  if (image && (image.startsWith("http") || image.startsWith("/"))) {
    return (
      <img
        src={image}
        alt={name || "User Avatar"}
        className={`rounded-full object-cover border border-border/80 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  // Render Notion-style deterministic illustrated avatar
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center border ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: avatar.bg,
        borderColor: avatar.border,
      }}
      dangerouslySetInnerHTML={{ __html: avatar.svg }}
    />
  );
}
