import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { AuthStatus } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  // Пример метода для логина
  login(user: User, password: string): boolean {
    if (user.login(password)) {
      // Сохранение изменений в базе данных (например, с помощью userRepository.save(user))
      return true;
    }
    return false;
  }

  // Пример метода для логаута
  logout(user: User): void {
    user.logout();
    // Сохранение изменений в базе данных (например, с помощью userRepository.save(user))
  }

  // Хэширование пароля перед сохранением
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // Проверка пароля при логине
  async validatePassword(storedPassword: string, enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPassword);
  }
}
