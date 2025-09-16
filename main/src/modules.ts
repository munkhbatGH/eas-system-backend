import { AuthModule } from "./auth/auth.module";
import { ElasticSearchModule } from "./elasticsearch/elasticsearch.module";
import { RedisModule } from "./redis/redis.module";
import { UsersModule } from "./users/users.module";

export const modules = [
    AuthModule, UsersModule, RedisModule, ElasticSearchModule,
];