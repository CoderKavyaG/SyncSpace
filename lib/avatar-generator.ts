// Notion-style aesthetic avatar generation utility

export const NOTION_AVATARS = [
  {
    id: "avatar_1",
    bg: "#E8F4FD",
    border: "#3B82F6",
    name: "Aria",
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" fill="#E8F4FD" />
      <path d="M10 24C10 16 13 10 18 10C23 10 26 16 26 24" fill="#14171A" />
      <circle cx="18" cy="20" r="7" fill="#FDE2D2" />
      <path d="M12 18C12 14 15 11 18 11C21 11 24 14 24 18C22 18 20 16 18 16C16 16 14 18 12 18Z" fill="#14171A" />
      <circle cx="16" cy="19.5" r="0.8" fill="#14171A" />
      <circle cx="20" cy="19.5" r="0.8" fill="#14171A" />
      <path d="M17.5 22.5C18 23 18 23 18.5 22.5" stroke="#14171A" stroke-width="0.8" stroke-linecap="round" />
    </svg>`,
  },
  {
    id: "avatar_2",
    bg: "#FEF3EB",
    border: "#F97316",
    name: "Theo",
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" fill="#FEF3EB" />
      <path d="M10 18C10 12 14 8 18 8C22 8 26 12 26 18" fill="#14171A" />
      <circle cx="18" cy="20" r="7" fill="#F4EDE2" />
      <path d="M11 16C12 14 15 12 18 12C21 12 24 14 25 16C23 15 20 14 18 14C15 14 13 15 11 16Z" fill="#14171A" />
      <rect x="23" y="14" width="7" height="2.5" rx="0.5" transform="rotate(-25 23 14)" fill="#8A8F98" stroke="#14171A" stroke-width="0.8" />
      <circle cx="16" cy="19.5" r="0.8" fill="#14171A" />
      <circle cx="20" cy="19.5" r="0.8" fill="#14171A" />
      <path d="M17.5 22.5C18 23 18 23 18.5 22.5" stroke="#14171A" stroke-width="0.8" stroke-linecap="round" />
    </svg>`,
  },
  {
    id: "avatar_3",
    bg: "#FDF2F8",
    border: "#EC4899",
    name: "Elena",
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" fill="#FDF2F8" />
      <path d="M11 16C11 11 14 8 18 8C22 8 25 11 25 16" fill="#D1D5DB" />
      <circle cx="18" cy="20" r="7" fill="#F4EDE2" />
      <rect x="13" y="17" width="4.5" height="4" rx="1" stroke="#14171A" stroke-width="1" fill="#FFFFFF" />
      <rect x="18.5" y="17" width="4.5" height="4" rx="1" stroke="#14171A" stroke-width="1" fill="#FFFFFF" />
      <path d="M17.5 19H18.5" stroke="#14171A" stroke-width="1" />
      <circle cx="15.2" cy="19" r="0.7" fill="#14171A" />
      <circle cx="20.7" cy="19" r="0.7" fill="#14171A" />
    </svg>`,
  },
  {
    id: "avatar_4",
    bg: "#ECFDF5",
    border: "#10B981",
    name: "Liam",
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" fill="#ECFDF5" />
      <path d="M13 13C15 11 17 12 19 13" stroke="#14171A" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="15.5" cy="16" r="1.2" fill="#14171A" />
      <path d="M18 14L13 23H18" stroke="#14171A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
  },
  {
    id: "avatar_5",
    bg: "#F5F3FF",
    border: "#8B5CF6",
    name: "Maya",
    svg: `<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" fill="#F5F3FF" />
      <path d="M14 13C16 11 18 12 20 13" stroke="#14171A" stroke-width="1.5" stroke-linecap="round" />
      <path d="M14 16C16 18 17 18 19 16" stroke="#14171A" stroke-width="1.5" stroke-linecap="round" />
      <path d="M19 15L15 23H19" stroke="#14171A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`,
  },
];

/**
 * Deterministically picks a Notion-style avatar based on a seed string (name or email).
 */
export function getAvatarForSeed(seed: string = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % NOTION_AVATARS.length;
  return NOTION_AVATARS[index];
}

/**
 * Generates an SVG Data URI for the user's avatar to save in database or use in <img> tags.
 */
export function getAvatarDataUri(seed: string = ""): string {
  const avatar = getAvatarForSeed(seed);
  return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.svg)}`;
}
