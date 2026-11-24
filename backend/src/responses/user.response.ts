import { Type } from 'class-transformer';
import { IsBoolean, IsString, ValidateNested } from 'class-validator';

import { ApiResponse } from '@/interfaces/api-service.interface';
import { Permissions as IPermissions } from '@/interfaces/auth.interface';
import { ClientUser } from '@/interfaces/users.interface';

export class Permissions implements IPermissions {
  @IsBoolean()
  canEditSupportManagement!: boolean;
}

export class User implements ClientUser {
  @IsString()
  name!: string;
  @IsString()
  firstName!: string;
  @IsString()
  lastName!: string;
  @IsString()
  username!: string;
  @IsString()
  email!: string;
  @ValidateNested()
  @Type(() => Permissions)
  permissions!: Permissions;
}

export class UserApiResponse implements ApiResponse<User> {
  @ValidateNested()
  @Type(() => User)
  data!: User;
  @IsString()
  message!: string;
}
