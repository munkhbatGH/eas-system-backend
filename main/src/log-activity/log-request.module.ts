import { Global, Module } from '@nestjs/common';
import { LogActivityService } from './log-activity.service';
import { LogActivityInterceptor } from './log-activity.interceptor';

@Global()
@Module({
  providers: [LogActivityService, LogActivityInterceptor],
  exports: [LogActivityInterceptor],
})
export class LogActivityModule {}
