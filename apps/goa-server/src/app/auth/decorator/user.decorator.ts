import { createParamDecorator, ExecutionContext } from "@nestjs/common";

interface RequestWithUser extends Request {
  user?: any;
}

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    if (data) return request.user[data];
    return request.user;
  }
);
