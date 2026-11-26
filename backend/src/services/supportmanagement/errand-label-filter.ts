const isAncestorOf = (ancestor: string, path: string): boolean => path.startsWith(`${ancestor}/`);

/**
 * Reduces label selections, given per level (category, type, subtype) as resource paths, to the most
 * specific ones worth filtering on:
 * - a deeper selection counts only below a selected ancestor (a type left selected after its category
 *   was deselected is ignored), and
 * - a selection with a selected descendant is narrowed to that descendant.
 * Levels without selections are skipped, so selecting only types filters on those types.
 */
export const mostSpecificLabelPaths = (levels: (string[] | undefined)[]): string[] => {
  const [topLevel = [], ...deeperLevels] = levels.filter((level): level is string[] => level !== undefined && level.length > 0);

  const reachable = deeperLevels.reduce<string[]>(
    (selected, level) => [...selected, ...level.filter(path => selected.some(ancestor => isAncestorOf(ancestor, path)))],
    topLevel,
  );

  const unique = [...new Set(reachable)];
  return unique.filter(path => !unique.some(other => isAncestorOf(path, other)));
};
