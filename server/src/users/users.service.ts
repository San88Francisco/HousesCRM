import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/createUser.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as argon2 from 'argon2'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create(createUserDto: CreateUserDto): Promise<{ mes: string }> {
    const { email, password, username } = createUserDto

    const existingUser = await this.usersRepository.findOneBy({ email })
    if (existingUser) {
      throw new BadRequestException('User with this email already exists')
    }

    const entity = this.usersRepository.create({
      email,
      username,
      password: await argon2.hash(password),
    })

    await this.usersRepository.save(entity)

    return { mes: 'User created successfully' }
  }
}
