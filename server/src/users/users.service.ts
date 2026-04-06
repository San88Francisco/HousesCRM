import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { User } from './entities/user.entity'
import { CreateUserRequestDto } from './dto/req/create-user-req.dto'
import { UserWithPasswordDto } from './dto/user-with-password.dto'
import { plainToInstance } from 'class-transformer'
import { UserWithGoogleDto } from './dto/req/user-with-google.req.dto'
import { UpdateUserProfileDto } from './dto/req/update-user-profile.dto'

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
    const user = await this.usersRepository.findOne({ where: { email } })

    return plainToInstance(UserWithPasswordDto, user, {
      excludeExtraneousValues: true,
    })
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ googleId })
  }

  async findOrCreateWithGoogle(dto: UserWithGoogleDto): Promise<User> {
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

  async updateProfile(userId: string, dto: UpdateUserProfileDto): Promise<User> {
    if (dto.email === undefined && dto.username === undefined) {
      throw new BadRequestException('Немає даних для оновлення')
    }

    const user = await this.findById(userId)
    if (!user) {
      throw new NotFoundException('Користувача не знайдено')
    }

    if (dto.email !== undefined) {
      const existing = await this.usersRepository.findOne({ where: { email: dto.email } })
      if (existing && existing.id !== userId) {
        throw new ConflictException('Ця електронна пошта вже використовується')
      }
      user.email = dto.email
    }

    if (dto.username !== undefined) {
      user.username = dto.username
    }

    return this.usersRepository.save(user)
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('Користувача не знайдено')
    }
    if (!user.password) {
      throw new BadRequestException('Зміна пароля недоступна для акаунту через Google')
    }

    const valid = await argon2.verify(user.password, currentPassword)
    if (!valid) {
      throw new UnauthorizedException('Невірний поточний пароль')
    }

    user.password = await argon2.hash(newPassword)
    await this.usersRepository.save(user)
  }
}
