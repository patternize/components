import { TreeNode } from './Tree';

// Helper function to apply diffs to a tree
export const applyDiffs = (
  baseTree: TreeNode,
  diffs: Array<{ path: string[]; value: string; remove?: boolean }>
) => {
  // Create a fresh copy of the base tree
  const newTree = JSON.parse(JSON.stringify(baseTree));

  // First pass: handle all non-remove operations
  diffs.forEach((diff) => {
    if (!diff.remove) {
      let current = newTree;
      for (let i = 0; i < diff.path.length - 1; i++) {
        current = current[diff.path[i]];
      }
      current[diff.path[diff.path.length - 1]] = diff.value;
    }
  });

  // Second pass: handle all remove operations
  diffs.forEach((diff) => {
    if (diff.remove) {
      let current = newTree;
      for (let i = 0; i < diff.path.length - 1; i++) {
        current = current[diff.path[i]];
      }
      delete current[diff.path[diff.path.length - 1]];
    }
  });

  return newTree;
};
