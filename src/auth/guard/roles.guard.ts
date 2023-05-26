import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('role', context.getHandler());

    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { role } = request.user;

      return roles.includes(role);
    }

    return false;
  }
}
