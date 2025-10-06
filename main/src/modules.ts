import { AuthModule } from "./auth/auth.module";
import { DynamicModelModule } from "./dynamic-model/dynamic-model.module";
import { ElasticSearchModule } from "./elasticsearch/elasticsearch.module";
import { LogsModule } from "./log-request/log-request.module";
import { RedisModule } from "./redis/redis.module";
import { SchemaModule } from "./schema/schema.module";
import { SettingsModule } from "./settings/settings.module";
import { UsersModule } from "./users/users.module";

export const modules = [
    AuthModule, UsersModule, RedisModule, ElasticSearchModule,
    SchemaModule, DynamicModelModule, SettingsModule, LogsModule,
];