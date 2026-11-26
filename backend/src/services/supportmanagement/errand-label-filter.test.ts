import { describe, expect, it } from 'vitest';

import { mostSpecificLabelPaths } from './errand-label-filter';

describe('mostSpecificLabelPaths', () => {
  it('returns nothing when nothing is selected', () => {
    expect(mostSpecificLabelPaths([undefined, [], undefined])).toEqual([]);
  });

  it('narrows a category to its selected types', () => {
    expect(mostSpecificLabelPaths([['AOT', 'KSK'], ['AOT/UNCATEGORIZED'], undefined])).toEqual(['KSK', 'AOT/UNCATEGORIZED']);
  });

  it('ignores a type whose category is not selected', () => {
    expect(mostSpecificLabelPaths([['KSK'], ['AOT/UNCATEGORIZED'], undefined])).toEqual(['KSK']);
  });

  it('narrows through all three levels', () => {
    expect(mostSpecificLabelPaths([['A'], ['A/B', 'A/C'], ['A/B/D']])).toEqual(['A/C', 'A/B/D']);
  });

  it('filters on types alone when no category is selected', () => {
    expect(mostSpecificLabelPaths([undefined, ['A/B', 'A/C'], undefined])).toEqual(['A/B', 'A/C']);
  });

  it('does not treat a path as the ancestor of a longer sibling name', () => {
    expect(mostSpecificLabelPaths([['A', 'AB'], undefined, undefined])).toEqual(['A', 'AB']);
  });
});
