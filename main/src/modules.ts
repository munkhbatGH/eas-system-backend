import { DatabaseModule } from './database/database.module';
import { AuthModule } from "./modules/auth/auth.module";
import { DynamicModelModule } from "./core/dynamic-model/dynamic-model.module";
import { SchemaModule } from "./core/schema/schema.module";
import { LogActivityModule } from "./modules/log-activity/log-request.module";
import { HrModule } from "./modules/hr/hr.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { UsersModule } from "./modules/users/users.module";

import { ElasticSearchModule } from "./thirdparty/elasticsearch/elasticsearch.module";
import { RedisModule } from "./thirdparty/redis/redis.module";
import { KafkaModule } from './thirdparty/kafka/kafka.module';
import { QraphqlClient } from './thirdparty/graphql/graphql.provider';

export const modules = [
    DatabaseModule,
    KafkaModule, RedisModule, ElasticSearchModule, QraphqlClient,
    AuthModule, UsersModule,
    SchemaModule, DynamicModelModule, SettingsModule, LogActivityModule,
    HrModule,
];