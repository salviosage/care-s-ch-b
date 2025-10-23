import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AllowedIds = createParamDecorator(
  (_data, ctx: ExecutionContext): string[] => {
    const req = ctx.switchToHttp().getRequest();
    return (req.user?.patientIds as string[]) ?? [];
  },
);
