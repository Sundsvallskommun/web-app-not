import { ErrandFilterQuery } from '@/dtos/supportmanagement/errand-filter.query';

import { mostSpecificLabelPaths } from './errand-label-filter';

/**
 * Characters kept in a free-text query. Everything else - quotes in particular - is dropped, so the
 * query cannot break out of the quoted filter literals it is placed in.
 */
const UNSAFE_QUERY_CHARACTERS = /[^\p{L}\p{N}\s.\-_,:@]/gu;

const sanitizeQuery = (query: string): string => query.normalize('NFKC').replace(UNSAFE_QUERY_CHARACTERS, '').replace(/\s+/g, ' ').trim();

/** `(field:'A' or field:'B')` */
const anyOf = (field: string, values: string[]): string => `(${values.map(value => `${field}:'${value}'`).join(' or ')})`;

const freeTextFilter = (query: string): string => {
  const contains = `'*${query}*'`;
  const clauses = [
    `description~${contains}`,
    `title~${contains}`,
    `errandNumber~${contains}`,
    `exists(stakeholders.firstName~${contains})`,
    `exists(stakeholders.lastName~${contains})`,
    `exists(stakeholders.organizationName~${contains})`,
    `exists(stakeholders.address~${contains})`,
    `exists(stakeholders.zipCode~${contains})`,
    `exists(stakeholders.externalId~${contains})`,
    `exists(stakeholders.contactChannels.value~${contains} and stakeholders.contactChannels.type~'EMAIL')`,
    `exists(stakeholders.contactChannels.value~${contains} and stakeholders.contactChannels.type~'PHONE')`,
    `exists(parameters.values~${contains})`,
  ];
  return `(${clauses.join(' or ')})`;
};

/**
 * Builds the SupportManagement `filter` expression for the given filters, or undefined when there are
 * none. All values except the free-text query are already restricted to safe characters by the
 * ErrandFilterQuery validation; the free-text query is sanitized here.
 */
export const buildErrandFilter = (filter: ErrandFilterQuery): string | undefined => {
  const clauses: string[] = [];

  const query = filter.query ? sanitizeQuery(filter.query) : '';
  if (query) clauses.push(freeTextFilter(query));
  if (filter.assignee) {
    clauses.push(`(assignedUserId:'${filter.assignee}' or (assignedUserId is null and reporterUserId:'${filter.assignee}'))`);
  }
  if (filter.hasCustomer) clauses.push(`exists(stakeholders.role:'PRIMARY')`);
  if (filter.priority?.length) clauses.push(anyOf('priority', filter.priority));
  if (filter.status?.length) clauses.push(anyOf('status', filter.status));
  if (filter.channel?.length) clauses.push(anyOf('channel', filter.channel));
  if (filter.resolution) clauses.push(`resolution:'${filter.resolution}'`);
  if (filter.category?.length) clauses.push(anyOf('category', filter.category));
  if (filter.type?.length) clauses.push(anyOf('type', filter.type));

  const labelPaths = mostSpecificLabelPaths([filter.labelCategory, filter.labelType, filter.labelSubType]);
  if (labelPaths.length) {
    clauses.push(`(${labelPaths.map(path => `exists(labels.metadataLabel.resourcePath:'${path}')`).join(' or ')})`);
  }

  if (filter.createdFrom) clauses.push(`created>'${filter.createdFrom}'`);
  if (filter.createdTo) clauses.push(`created<'${filter.createdTo}'`);

  return clauses.length > 0 ? clauses.join(' and ') : undefined;
};
