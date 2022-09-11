import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersReporitory } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersReporitory)
    private usersRepository: UsersReporitory,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }
}
