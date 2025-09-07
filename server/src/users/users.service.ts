import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'
import { User } from './entities/user.entity'
import { CreateUserRequestDto } from './dto/req/create-user-req.dto'

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

  public async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  public async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } })
  }

  public async setRefreshHash(userId: string, hash: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { refreshTokenHash: hash })
  }

  public async clearRefresh(userId: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { refreshTokenHash: null })
  }

  public async isRefreshValid(userId: string, token: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: { id: true, refreshTokenHash: true },
    })
    if (!user?.refreshTokenHash) {
      return false
    }
    return argon2.verify(user.refreshTokenHash, token)
  }
}
