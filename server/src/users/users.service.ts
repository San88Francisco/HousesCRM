import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as argon2 from 'argon2'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create(dto: CreateUserDto): Promise<User> {
    const { email, password, username } = dto
    const entity = this.usersRepository.create({
      email,
      username,
      password: await argon2.hash(password),
    })
    return this.usersRepository.save(entity)
  }
}
