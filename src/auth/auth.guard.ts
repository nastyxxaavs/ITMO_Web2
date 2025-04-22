import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Проверка наличия авторизации в request (например, токен в заголовке)
    // Реализуйте вашу логику аутентификации на основе токенов или сессий SuperTokens
    if (request.user) {
      return true;
    }

    return false; // Неавторизованный доступ
  }
}
