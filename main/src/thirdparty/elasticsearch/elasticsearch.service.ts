import { Inject, Injectable } from '@nestjs/common';
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';

@Injectable()
export class ElasticSearchService {
  constructor(
    @Inject('ELASTICSEARCH_CLIENT')
    private readonly esClient: ElasticsearchClient,
  ) {}

  async searchIndex(index: string, query: any) {
    const result: any = await this.esClient.search({
      index,
      body: query,
    });

    return result.body.hits.hits;
  }
}
