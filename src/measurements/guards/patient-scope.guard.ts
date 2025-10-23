import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PatientScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const allowed: string[] = req.user?.patientIds ?? [];
    const patientId = req.query?.patientId as string | undefined;
    if (!patientId) {
      throw new BadRequestException('patientId is required');
    }
    if (!allowed.includes(patientId)) {
      throw new ForbiddenException('Forbidden');
    }
    return true;
  }
}
