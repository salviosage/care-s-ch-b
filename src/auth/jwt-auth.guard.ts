import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getAllowedPatientIds } from './allowed-patients';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { patientIds: getAllowedPatientIds() }; // mock
    return true;
  }
}
