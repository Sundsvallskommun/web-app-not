import { Transform } from 'class-transformer';

/**
 * Splits a comma-separated query parameter (`?status=NEW,ONGOING`) into a list. Lists are sent
 * comma-separated rather than as repeated parameters, since hpp keeps only the last of those.
 * routing-controllers may already have wrapped the raw string in an array, so items are split too.
 */
export const CsvQueryParam = () =>
  Transform(({ value }: { value: unknown }) => {
    const rawItems: unknown[] = Array.isArray(value) ? value : [value];
    if (!rawItems.every(item => typeof item === 'string')) {
      return value;
    }
    return rawItems
      .flatMap(item => item.split(','))
      .map(item => item.trim())
      .filter(item => item !== '');
  });
