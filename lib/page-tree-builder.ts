export interface FlatPageRecord {
  id: string;
  title: string;
  icon: string | null;
  coverUrl: string | null;
  workspaceId: string;
  parentPageId: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageTreeNode extends FlatPageRecord {
  children: PageTreeNode[];
}

/**
 * Pure function that constructs a nested tree hierarchy from a flat list of page records.
 *
 * @param pages - Array of page objects containing parentPageId reference
 * @returns Array of root-level PageTreeNode objects with recursively populated children
 */
export function buildPageTree(pages: FlatPageRecord[]): PageTreeNode[] {
  const pageMap = new Map<string, PageTreeNode>();
  const rootPages: PageTreeNode[] = [];

  // Step 1: Initialize all page nodes with an empty children array
  for (const page of pages) {
    pageMap.set(page.id, {
      ...page,
      children: [],
    });
  }

  // Step 2: Build tree structure by linking children to their parents
  for (const page of pages) {
    const node = pageMap.get(page.id)!;
    if (page.parentPageId && pageMap.has(page.parentPageId)) {
      const parentNode = pageMap.get(page.parentPageId)!;
      parentNode.children.push(node);
    } else {
      // Root level page or parent page not found in set
      rootPages.push(node);
    }
  }

  return rootPages;
}
