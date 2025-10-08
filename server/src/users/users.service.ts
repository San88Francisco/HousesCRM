import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { User } from './entities/user.entity'
import { CreateUserRequestDto } from './dto/req/create-user-req.dto'
import { UserWithPasswordDto } from './dto/user-with-password.dto'
import { plainToInstance } from 'class-transformer'
import { UserWithGoogleDto } from './dto/req/user-with-google.req.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  public async create(dto: CreateUserRequestDto): Promise<User> {
    const { email, password, username } = dto
    const entity = this.usersRepository.create({
      email,
      username,
      password: await argon2.hash(password),
    })
    return this.usersRepository.save(entity)
  }

  public async findOne(email: string): Promise<UserWithPasswordDto | null> {
    const user = await this.usersRepository.findOne({ where: { email } })

    return plainToInstance(UserWithPasswordDto, user, {
      excludeExtraneousValues: true,
    })
  }

  public async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }

  public async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ googleId })
  }

  public async findOrCreateWithGoogle(dto: UserWithGoogleDto): Promise<User> {
    const { email, username, googleId } = dto

    const userWithEmail = await this.findOne(email)

    const entity = this.usersRepository.create({
      ...userWithEmail,
      email: userWithEmail?.email || email,
      username,
      googleId,
    })

    return await this.usersRepository.save(entity)
  }
}
