import { AppService } from "./app.service";
import { DynamicModelService } from "./core/dynamic-model/dynamic-model.service";
import { SettingsService } from "./modules/settings/settings.service";
import { HelloResolver } from "./thirdparty/graphql/hello.resolver";
import { RedisService } from "./thirdparty/redis/redis.service";
import { UsersService } from "./modules/users/users.service";

export const services = [
    AppService, UsersService, RedisService, HelloResolver, DynamicModelService, SettingsService,
]