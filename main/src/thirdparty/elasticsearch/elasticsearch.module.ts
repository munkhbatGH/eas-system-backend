import { Module } from "@nestjs/common";
import { ElasticsearchProvider } from "./elasticsearch.provider";
import { ElasticSearchService } from "./elasticsearch.service";

@Module({
    imports: [],
    providers: [ElasticsearchProvider, ElasticSearchService],
    exports: [ElasticsearchProvider],
  })
  export class ElasticSearchModule {}