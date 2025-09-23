import { AppService } from "./app.service";
import { HelloResolver } from "./graphql/hello.resolver";
import { RedisService } from "./redis/redis.service";
import { UsersService } from "./users/users.service";

export const services = [
    AppService, UsersService, RedisService, HelloResolver,
]