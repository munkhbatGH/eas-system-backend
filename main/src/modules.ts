import { AuthModule } from "./auth/auth.module";
import { DynamicModelModule } from "./core/dynamic-model/dynamic-model.module";
import { SchemaModule } from "./core/schema/schema.module";
import { LogActivityModule } from "./log-activity/log-request.module";
import { HrModule } from "./modules/hr/hr.module";
import { SettingsModule } from "./settings/settings.module";
import { ElasticSearchModule } from "./thirdparty/elasticsearch/elasticsearch.module";
import { RedisModule } from "./thirdparty/redis/redis.module";
import { UsersModule } from "./users/users.module";

export const modules = [
    AuthModule, UsersModule, RedisModule, ElasticSearchModule,
    SchemaModule, DynamicModelModule, SettingsModule, LogActivityModule,
    HrModule,
];