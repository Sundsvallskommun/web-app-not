import { isUUID } from 'class-validator';
import { Body, Controller, Get, HttpCode, Param, Patch, Post, QueryParams, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { supportErrandsPath } from '@/config/supportmanagement';
import { CountResponse, PageErrand } from '@/data-contracts/supportmanagement/data-contracts';
import { ErrandFilterQuery } from '@/dtos/supportmanagement/errand-filter.query';
import { ErrandListQuery } from '@/dtos/supportmanagement/errand-list.query';
import { NewSupportErrandDto } from '@/dtos/supportmanagement/new-support-errand.dto';
import { UpdateSupportErrandDto } from '@/dtos/supportmanagement/update-support-errand.dto';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { hasPermissions } from '@/middlewares/permissions.middleware';
import { SupportErrand, SupportErrandApiResponse } from '@/responses/supportmanagement/support-errand.response';
import { SupportErrandCountApiResponse } from '@/responses/supportmanagement/support-errand-count.response';
import { SupportErrandPageApiResponse } from '@/responses/supportmanagement/support-errand-page.response';
import ApiService from '@/services/api.service';
import { buildErrandFilter } from '@/services/supportmanagement/errand-filter.service';
import { createSupportErrand } from '@/services/supportmanagement/new-errand.service';

/** Reject anything that is not plainly allowed, so a typo surfaces as a 400 instead of being silently ignored. */
const STRICT_VALIDATION = { validate: { whitelist: true, forbidNonWhitelisted: true } };

/** E.g. NOT-26115412. */
const ERRAND_NUMBER = /^[A-Z]+-\d+$/;

const DEFAULT_PAGE_SIZE = 10;

const assertErrandId = (errandId: string): void => {
  if (!isUUID(errandId)) {
    throw new HttpException(400, 'errandId must be a UUID');
  }
};

@Controller('/supportmanagement/errands')
@UseBefore(authMiddleware, hasPermissions(['canEditSupportManagement']))
export class SupportErrandController {
  private apiService = new ApiService();

  @Get('/')
  @OpenAPI({ summary: 'Search errands, a page at a time' })
  @ResponseSchema(SupportErrandPageApiResponse)
  async getErrands(
    @Req() req: RequestWithUser,
    @QueryParams(STRICT_VALIDATION) { page, size, sort, ...filter }: ErrandListQuery,
  ): Promise<SupportErrandPageApiResponse> {
    const params = { filter: buildErrandFilter(filter), page: page ?? 0, size: size ?? DEFAULT_PAGE_SIZE, sort };
    const res = await this.apiService.get<PageErrand>({ url: supportErrandsPath(), params, sentBy: req.user });
    return { data: res.data, message: 'success' };
  }

  @Get('/count')
  @OpenAPI({ summary: 'Count the errands matching the filters' })
  @ResponseSchema(SupportErrandCountApiResponse)
  async countErrands(@Req() req: RequestWithUser, @QueryParams(STRICT_VALIDATION) filter: ErrandFilterQuery): Promise<SupportErrandCountApiResponse> {
    const params = { filter: buildErrandFilter(filter) };
    const res = await this.apiService.get<CountResponse>({ url: supportErrandsPath('count'), params, sentBy: req.user });
    return { data: res.data, message: 'success' };
  }

  @Get('/errandnumber/:errandNumber')
  @OpenAPI({ summary: 'Return an errand by its errand number, e.g. NOT-26115412' })
  @ResponseSchema(SupportErrandApiResponse)
  async getErrandByNumber(@Req() req: RequestWithUser, @Param('errandNumber') errandNumber: string): Promise<SupportErrandApiResponse> {
    if (!ERRAND_NUMBER.test(errandNumber)) {
      throw new HttpException(400, 'errandNumber must look like ABC-123');
    }
    const params = { filter: `errandNumber:'${errandNumber}'`, size: 1 };
    const res = await this.apiService.get<PageErrand>({ url: supportErrandsPath(), params, sentBy: req.user });
    const errand = res.data.content?.[0];
    if (!errand) {
      throw new HttpException(404, 'Not found');
    }
    return { data: errand, message: 'success' };
  }

  @Get('/:errandId')
  @OpenAPI({ summary: 'Return an errand by id' })
  @ResponseSchema(SupportErrandApiResponse)
  async getErrand(@Req() req: RequestWithUser, @Param('errandId') errandId: string): Promise<SupportErrandApiResponse> {
    assertErrandId(errandId);
    const res = await this.apiService.get<SupportErrand>({ url: supportErrandsPath(errandId), sentBy: req.user });
    return { data: res.data, message: 'success' };
  }

  @Post('/')
  @HttpCode(201)
  @OpenAPI({ summary: 'Create an errand with defaults, assigned to the current user, optionally with labels, stakeholders and JSON parameters' })
  @ResponseSchema(SupportErrandApiResponse, { statusCode: 201 })
  async createErrand(
    @Req() req: RequestWithUser,
    @Body({ required: false, ...STRICT_VALIDATION }) prefill: NewSupportErrandDto,
  ): Promise<SupportErrandApiResponse> {
    const errand = await createSupportErrand(this.apiService, prefill, req.user);
    return { data: errand, message: 'success' };
  }

  @Patch('/:errandId')
  @OpenAPI({ summary: 'Update an errand; send only the fields that change' })
  @ResponseSchema(SupportErrandApiResponse)
  async updateErrand(
    @Req() req: RequestWithUser,
    @Param('errandId') errandId: string,
    @Body(STRICT_VALIDATION) changes: UpdateSupportErrandDto,
  ): Promise<SupportErrandApiResponse> {
    assertErrandId(errandId);
    const res = await this.apiService.patch<SupportErrand>({ url: supportErrandsPath(errandId), data: changes, sentBy: req.user });
    return { data: res.data, message: 'success' };
  }
}
