import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentiasDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentiasDto;

    //genereted salt and encrypt password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.create({ username, password: hashedPassword });

    try {
      await this.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        //duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
