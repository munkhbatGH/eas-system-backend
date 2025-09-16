import { AppService } from "./app.service";
import { RedisService } from "./redis/redis.service";
import { UsersService } from "./users/users.service";

export const services = [
    AppService, UsersService, RedisService,
]