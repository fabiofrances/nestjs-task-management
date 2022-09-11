import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersReporitory extends Repository<User> {
  async createUser(authCredentiasDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentiasDto;
    const newUser = this.create({
      username,
      password,
    });
    await this.save(newUser);
  }
}
