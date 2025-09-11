import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const User = createParamDecorator(
  (data: any, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
        return request.user[data];
    }
    return request.user;
  }
);