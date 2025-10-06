import { CallHandler, ExecutionContext, Injectable, NestInterceptor, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogRequestService } from './log-request.service';
  
@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogRequestService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const { method, url, body, user } = request;

    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      const bb = { method, url, fromUrl: request.headers['current-page'], body: JSON.stringify(body) }
      this.logService.saveLog(user, bb);
    }

    return next.handle().pipe(tap());
  }
}
  