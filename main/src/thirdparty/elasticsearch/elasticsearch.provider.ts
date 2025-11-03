import { Provider } from '@nestjs/common';
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';

export const ElasticsearchProvider: Provider = {
  provide: 'ELASTICSEARCH_CLIENT',
  useFactory: () => {
    return new ElasticsearchClient({
      node: process.env.ELASTIC_SEARCH || 'http://localhost:9200',
    });
  },
};