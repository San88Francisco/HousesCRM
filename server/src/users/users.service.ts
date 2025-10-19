import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { User } from './entities/user.entity'
import { CreateUserRequestDto } from './dto/req/create-user-req.dto'
import { UserWithPasswordDto } from './dto/user-with-password.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(dto: CreateUserRequestDto): Promise<User> {
    const { email, password, username } = dto
    const entity = this.usersRepository.create({
      email,
      username,
      password: await argon2.hash(password),
    })
    return this.usersRepository.save(entity)
  }

  async findOne(email: string): Promise<UserWithPasswordDto | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }
}
