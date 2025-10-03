import { AppService } from "./app.service";
import { DynamicModelService } from "./dynamic-model/dynamic-model.service";
import { HelloResolver } from "./graphql/hello.resolver";
import { RedisService } from "./redis/redis.service";
import { SettingsService } from "./settings/settings.service";
import { UsersService } from "./users/users.service";

export const services = [
    AppService, UsersService, RedisService, HelloResolver, DynamicModelService, SettingsService,
]