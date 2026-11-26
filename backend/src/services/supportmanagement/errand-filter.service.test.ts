import { describe, expect, it } from 'vitest';

import { Priority } from '@/data-contracts/supportmanagement/data-contracts';
import { mockAdUsername, mockEmail } from '@/tests/helpers/mock-data';

import { buildErrandFilter } from './errand-filter.service';

describe('buildErrandFilter', () => {
  it('returns undefined without filters', () => {
    expect(buildErrandFilter({})).toBeUndefined();
  });

  it('and-s the given filters and or-s the values within one', () => {
    expect(buildErrandFilter({ priority: [Priority.HIGH, Priority.LOW], channel: ['EMAIL'], resolution: 'SOLVED' })).toBe(
      "(priority:'HIGH' or priority:'LOW') and (channel:'EMAIL') and resolution:'SOLVED'",
    );
  });

  it('matches the assignee, or the reporter of an unassigned errand', () => {
    expect(buildErrandFilter({ assignee: mockAdUsername })).toBe(
      `(assignedUserId:'${mockAdUsername}' or (assignedUserId is null and reporterUserId:'${mockAdUsername}'))`,
    );
  });

  it('filters on the most specific label paths', () => {
    expect(buildErrandFilter({ labelCategory: ['AOT'], labelType: ['AOT/UNCATEGORIZED'] })).toBe(
      "(exists(labels.metadataLabel.resourcePath:'AOT/UNCATEGORIZED'))",
    );
  });

  it('limits the creation time', () => {
    expect(buildErrandFilter({ createdFrom: '2026-11-01T00:00:00.000+01:00', createdTo: '2026-11-30T23:59:59.999+01:00' })).toBe(
      "created>'2026-11-01T00:00:00.000+01:00' and created<'2026-11-30T23:59:59.999+01:00'",
    );
  });

  it('searches free text in errand and stakeholder fields', () => {
    const filter = buildErrandFilter({ query: 'Sundsvall' });

    expect(filter).toMatch(/^\(description~'\*Sundsvall\*' or title~'\*Sundsvall\*' or errandNumber~'\*Sundsvall\*' or /);
    expect(filter).toContain("exists(stakeholders.organizationName~'*Sundsvall*')");
    expect(filter).toContain("exists(parameters.values~'*Sundsvall*')");
  });

  it('drops characters from free text that could break out of the quoted literals', () => {
    const filter = buildErrandFilter({ query: "x' or id:'1" });

    expect(filter).toContain("title~'*x or id:1*'");
    const quoteCount = (text?: string) => text?.match(/'/g)?.length;
    expect(quoteCount(filter)).toBe(quoteCount(buildErrandFilter({ query: 'x' })));
  });

  it('keeps @ so e-mail addresses can be searched', () => {
    expect(buildErrandFilter({ query: mockEmail })).toContain(`'*${mockEmail}*'`);
  });

  it('ignores a query that is empty after sanitizing', () => {
    expect(buildErrandFilter({ query: "''" })).toBeUndefined();
  });
});
