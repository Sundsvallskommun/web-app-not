import { HealthController } from './controllers/health.controller';
import { IndexController } from './controllers/index.controller';
import { SupportErrandController } from './controllers/supportmanagement/support-errand.controller';
import { UserController } from './controllers/user.controller';

export const CONTROLLERS = [IndexController, UserController, HealthController, SupportErrandController];
