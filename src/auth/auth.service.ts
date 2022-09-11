import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UsersReporitory } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersReporitory)
    private usersRepository: UsersReporitory,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDTO);
  }
}
