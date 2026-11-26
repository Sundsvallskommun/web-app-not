/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ErrandFilterQuery {
  /**
   * Free text, matched against errand and stakeholder fields
   * @maxLength 100
   */
  query?: string;
  /**
   * Username: errands assigned to the user, or unassigned errands reported by the user
   * @pattern ^[A-Za-z0-9_.-]+$
   */
  assignee?: string;
  /** Only errands with a customer (a PRIMARY stakeholder) */
  hasCustomer?: boolean;
  /** Comma-separated list */
  priority?: ErrandFilterQueryPriorityEnum[];
  /** Comma-separated list */
  status?: string[];
  /** Comma-separated list */
  channel?: string[];
  /** @pattern ^[A-Za-z0-9_.-]+$ */
  resolution?: string;
  /** Comma-separated classification categories */
  category?: string[];
  /** Comma-separated classification types */
  type?: string[];
  /** Comma-separated label resource paths, first level */
  labelCategory?: string[];
  /** Comma-separated label resource paths, second level */
  labelType?: string[];
  /** Comma-separated label resource paths, third level */
  labelSubType?: string[];
  /**
   * Created after, ISO 8601 with offset, e.g. 2026-11-01T00:00:00.000+01:00
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$
   */
  createdFrom?: string;
  /**
   * Created before, ISO 8601 with offset
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$
   */
  createdTo?: string;
}

export interface ErrandListQuery {
  /** @min 0 */
  page?: number;
  /**
   * @min 1
   * @max 100
   */
  size?: number;
  /**
   * Property and direction, e.g. modified,desc
   * @pattern ^[A-Za-z.]+,(asc|desc)$
   */
  sort?: string;
  /**
   * Free text, matched against errand and stakeholder fields
   * @maxLength 100
   */
  query?: string;
  /**
   * Username: errands assigned to the user, or unassigned errands reported by the user
   * @pattern ^[A-Za-z0-9_.-]+$
   */
  assignee?: string;
  /** Only errands with a customer (a PRIMARY stakeholder) */
  hasCustomer?: boolean;
  /** Comma-separated list */
  priority?: ErrandListQueryPriorityEnum[];
  /** Comma-separated list */
  status?: string[];
  /** Comma-separated list */
  channel?: string[];
  /** @pattern ^[A-Za-z0-9_.-]+$ */
  resolution?: string;
  /** Comma-separated classification categories */
  category?: string[];
  /** Comma-separated classification types */
  type?: string[];
  /** Comma-separated label resource paths, first level */
  labelCategory?: string[];
  /** Comma-separated label resource paths, second level */
  labelType?: string[];
  /** Comma-separated label resource paths, third level */
  labelSubType?: string[];
  /**
   * Created after, ISO 8601 with offset, e.g. 2026-11-01T00:00:00.000+01:00
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$
   */
  createdFrom?: string;
  /**
   * Created before, ISO 8601 with offset
   * @pattern ^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$
   */
  createdTo?: string;
}

export interface SupportJsonParameterInput {
  /** @pattern ^[A-Za-z0-9_-]+$ */
  key: string;
  /** Any JSON value, valid according to the JSON schema referenced by schemaId */
  value: any;
  schemaId: string;
}

export interface SupportLabelInput {
  /** @format uuid */
  id: string;
}

export interface SupportContactChannel {
  type?: string;
  value?: string;
}

export interface SupportParameterInput {
  /** @maxLength 255 */
  key: string;
  /** @maxLength 255 */
  displayName?: string;
  /** @maxLength 255 */
  group?: string;
  values?: string[];
}

export interface SupportStakeholderInput {
  externalId?: string;
  externalIdType?: string;
  role?: string;
  city?: string;
  organizationName?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  careOf?: string;
  zipCode?: string;
  country?: string;
  contactChannels?: SupportContactChannel[];
  parameters?: SupportParameterInput[];
}

export interface NewSupportErrandDto {
  labels?: SupportLabelInput[];
  stakeholders?: SupportStakeholderInput[];
  jsonParameters?: SupportJsonParameterInput[];
}

export interface SupportClassification {
  category?: string;
  type?: string;
}

export interface SupportExternalTag {
  key?: string;
  value?: string;
}

export interface SupportSuspension {
  suspendedFrom?: string;
  suspendedTo?: string;
}

export interface UpdateSupportErrandDto {
  /** @maxLength 255 */
  title?: string;
  priority?: UpdateSupportErrandDtoPriorityEnum;
  status?: string;
  resolution?: string;
  description?: string;
  /** @maxLength 255 */
  channel?: string;
  reporterUserId?: string;
  assignedUserId?: string;
  assignedGroupId?: string;
  escalationEmail?: string;
  contactReason?: string;
  contactReasonDescription?: string;
  businessRelated?: boolean;
  classification?: SupportClassification;
  suspension?: SupportSuspension;
  externalTags?: SupportExternalTag[];
  labels?: SupportLabelInput[];
  stakeholders?: SupportStakeholderInput[];
  parameters?: SupportParameterInput[];
  jsonParameters?: SupportJsonParameterInput[];
}

export interface SupportErrandAction {
  id?: string;
  actionName?: string;
  executeAfter?: string;
  actionConfigId?: string;
  displayValue?: string;
}

export interface SupportJsonParameter {
  key: string;
  /** Any JSON value, valid according to the JSON schema referenced by schemaId */
  value: any;
  schemaId: string;
  version?: number;
}

export interface SupportLabelAttribute {
  key: string;
  value: string;
}

export interface SupportErrandLabel {
  id?: string;
  version?: number;
  classification?: string;
  classificationDisplayName?: string;
  displayName?: string;
  resourcePath?: string;
  resourceName?: string;
  attributes?: SupportLabelAttribute[];
}

export interface SupportAttachmentPurpose {
  id?: string;
  name?: string;
  displayName?: string;
}

export interface SupportErrandAttachment {
  id?: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  channel?: SupportErrandAttachmentChannelEnum;
  sequenceNumber?: number;
  received?: string;
  created?: string;
  modified?: string;
  hash?: string;
  purpose?: SupportAttachmentPurpose;
}

export interface SupportMeasure {
  id?: string;
  responsibleUser?: string;
  type?: string;
  plannedStart?: string;
  plannedComplete?: string;
  executed?: string;
  addedByUser?: string;
  addedByRole?: string;
  goal?: string;
  description?: string;
  accept?: string | null;
  acceptMotivation?: string;
  created?: string;
  modified?: string;
  status?: string;
  title?: string;
  dueAt?: string;
  completedAt?: string;
  result?: string | null;
  resultText?: string;
  decisionId?: string | null;
  statementId?: string | null;
  attachments?: SupportErrandAttachment[];
  createdBy?: string;
  modifiedBy?: string;
  version?: number;
}

export interface SupportNotification {
  id?: string;
  created?: string;
  modified?: string;
  ownerFullName?: string;
  ownerId?: string;
  createdBy?: string;
  createdByFullName?: string;
  type?: string;
  subtype?: string;
  description?: string;
  content?: string;
  expires?: string;
  globalAcknowledged?: boolean;
  acknowledged?: boolean;
  errandId?: string;
  errandNumber?: string;
}

export interface SupportParameter {
  key: string;
  displayName?: string;
  group?: string;
  values?: string[];
  version?: number;
}

export interface SupportErrandPhase {
  phaseId?: string;
  name?: string;
  displayName?: string;
  started?: string;
  ended?: string;
}

export interface SupportProcessError {
  code?: string;
  message?: string;
}

export interface SupportProcessSignal {
  name: string;
  label?: string;
}

export interface SupportErrandProcess {
  id?: string;
  processService?: string;
  processKey?: string;
  processInstanceId?: string;
  processStatus?: string;
  currentActivityId?: string;
  currentActivityName?: string;
  started?: string;
  ended?: string;
  error?: SupportProcessError;
  awaitingSignals?: SupportProcessSignal[];
  created?: string;
  modified?: string;
}

export interface SupportStakeholder {
  externalId?: string;
  externalIdType?: string;
  role?: string;
  city?: string;
  organizationName?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  careOf?: string;
  zipCode?: string;
  country?: string;
  contactChannels?: SupportContactChannel[];
  parameters?: SupportParameter[];
}

export interface SupportErrand {
  id?: string;
  errandNumber?: string;
  title?: string;
  priority?: SupportErrandPriorityEnum;
  stakeholders?: SupportStakeholder[];
  externalTags?: SupportExternalTag[];
  parameters?: SupportParameter[];
  jsonParameters?: SupportJsonParameter[];
  classification?: SupportClassification;
  status?: string;
  lifecycle?: SupportErrandLifecycleEnum;
  resolution?: string;
  description?: string;
  channel?: string;
  reporterUserId?: string;
  assignedUserId?: string;
  assignedGroupId?: string;
  escalationEmail?: string;
  contactReason?: string;
  contactReasonDescription?: string;
  suspension?: SupportSuspension;
  businessRelated?: boolean;
  labels?: SupportErrandLabel[];
  phases?: SupportErrandPhase[];
  activePhaseId?: string;
  activeNotifications?: SupportNotification[];
  actions?: SupportErrandAction[];
  process?: SupportErrandProcess;
  measures?: SupportMeasure[];
  created?: string;
  modified?: string;
  touched?: string;
  deleted?: string;
  deletedBy?: string;
  version?: number;
}

export interface SupportErrandApiResponse {
  data: SupportErrand;
  message: string;
}

export interface SupportErrandCount {
  count?: number;
}

export interface SupportErrandCountApiResponse {
  data: SupportErrandCount;
  message: string;
}

export interface SupportSort {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export interface SupportPageable {
  offset?: number;
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sort?: SupportSort;
  unpaged?: boolean;
}

export interface SupportErrandPage {
  totalPages?: number;
  totalElements?: number;
  size?: number;
  content?: SupportErrand[];
  number?: number;
  sort?: SupportSort;
  pageable?: SupportPageable;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface SupportErrandPageApiResponse {
  data: SupportErrandPage;
  message: string;
}

export interface Permissions {
  canEditSupportManagement: boolean;
}

export interface User {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  permissions: Permissions;
}

export interface UserApiResponse {
  data: User;
  message: string;
}

export enum ErrandFilterQueryPriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum ErrandListQueryPriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum UpdateSupportErrandDtoPriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum SupportErrandAttachmentChannelEnum {
  EMAIL = "EMAIL",
  ESERVICE = "ESERVICE",
  WEB_UI = "WEB_UI",
  MY_PAGES = "MY_PAGES",
}

export enum SupportErrandPriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum SupportErrandLifecycleEnum {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
}

export enum SupportErrandControllerGetErrandsParamsPriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum SupportErrandControllerCountErrandsParamsPriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}
