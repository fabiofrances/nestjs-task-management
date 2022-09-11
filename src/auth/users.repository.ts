import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersReporitory extends Repository<User> {
  async createUser(authCredentiasDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentiasDTO;
    const newUser = this.create({
      username,
      password,
    });
    await this.save(newUser);
    // return newUser;
  }
}
