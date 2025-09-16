import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { UsersModule } from "./users/users.module";

export const modules = [
    AuthModule, UsersModule, RedisModule,
];