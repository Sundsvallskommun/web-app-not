import axios, { AxiosRequestConfig } from 'axios';

import { HttpException } from '@/exceptions/HttpException';
import { ApiResponse } from '@/interfaces/api-service.interface';
import { User } from '@/interfaces/users.interface';
import { logger } from '@/utils/logger';
import { apiURL } from '@/utils/util';

import ApiTokenService from './api-token.service';

interface ApiRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  /** The user the request is made on behalf of, sent as `X-Sent-By` so upstream audit trails know who acted. */
  sentBy?: Pick<User, 'username'>;
}

/**
 * Upstream statuses passed on to our client as-is: the client sent something wrong (400), the
 * resource does not exist (404) or was changed by someone else (409/412). Anything else - including
 * an upstream 401/403, which means *our* credentials are wrong - is our problem and becomes a 500.
 */
const PASSED_THROUGH_STATUSES = new Set([400, 404, 409, 412]);

const FALLBACK_MESSAGE = 'Request failed';

/** Titles that only repeat the status and say nothing about what was wrong. */
const UNINFORMATIVE_TITLES = new Set(['Bad Request', 'Constraint Violation', 'Not Found', 'Conflict', 'Precondition Failed']);

interface UpstreamProblem {
  title?: string;
  detail?: string;
  violations?: { field?: string; message?: string }[];
}

const isUpstreamProblem = (data: unknown): data is UpstreamProblem => typeof data === 'object' && data !== null;

/** The most useful human-readable message in a dept44 problem response. */
const upstreamProblemMessage = (data: unknown): string => {
  if (!isUpstreamProblem(data)) {
    return FALLBACK_MESSAGE;
  }
  const violationMessages = (data.violations ?? [])
    .map(violation => (violation.field ? `${violation.field}: ${violation.message ?? ''}` : (violation.message ?? '')).trim())
    .filter(message => message !== '');
  if (violationMessages.length > 0) {
    return violationMessages.join('; ');
  }
  const informativeTitle = data.title && !UNINFORMATIVE_TITLES.has(data.title) ? data.title : undefined;
  return data.detail ?? informativeTitle ?? FALLBACK_MESSAGE;
};

class ApiService {
  private apiTokenService = new ApiTokenService();

  private async request<T>({ sentBy, ...config }: ApiRequestConfig): Promise<ApiResponse<T>> {
    const token = await this.apiTokenService.getToken();

    const defaultHeaders: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(sentBy ? { 'X-Sent-By': `type=adAccount; ${sentBy.username}` } : {}),
    };
    const preparedConfig: AxiosRequestConfig = {
      ...config,
      headers: { ...defaultHeaders, ...(config.headers as Record<string, string> | undefined) },
      url: apiURL(config.url ?? ''),
    };

    try {
      const res = await axios<T>(preparedConfig);
      const location = typeof res.headers.location === 'string' ? res.headers.location : undefined;
      return { data: res.data, message: 'success', ...(location ? { location } : {}) };
    } catch (error) {
      if (!axios.isAxiosError(error) || !error.response) {
        logger.error(`${preparedConfig.method ?? ''} ${config.url ?? ''} failed without a response`, error);
        // NOTE: did you subscribe to the API called?
        throw new HttpException(500, 'Internal server error from gateway');
      }

      const { status } = error.response;
      const message = status === 404 ? 'Not found' : upstreamProblemMessage(error.response.data as unknown);
      // config.url never carries the query string (that is in params), so search input is not logged.
      logger.error(`${preparedConfig.method ?? ''} ${config.url ?? ''} failed with ${String(status)}: ${message}`);

      if (PASSED_THROUGH_STATUSES.has(status)) {
        throw new HttpException(status, message);
      }
      throw new HttpException(500, 'Internal server error from gateway');
    }
  }

  public async get<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  public async post<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  public async patch<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH' });
  }

  public async put<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT' });
  }

  public async delete<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }
}

export default ApiService;
