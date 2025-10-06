import { Global, Module } from '@nestjs/common';
import { LogRequestInterceptor } from './log-request.interceptor';
import { LogRequestService } from './log-request.service';

@Global()
@Module({
  providers: [LogRequestService, LogRequestInterceptor],
  exports: [LogRequestInterceptor],
})
export class LogsModule {}
