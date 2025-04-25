import { Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PUBLIC_ACCESS_KEY } from './public-access.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(PUBLIC_ACCESS_KEY, context.getHandler());

    if (isPublic) {
      return true; // Если маршрут публичный, разрешаем доступ
    }

    const isAuthenticated = request.session?.isAuthenticated;

    return !!isAuthenticated;
  }
}