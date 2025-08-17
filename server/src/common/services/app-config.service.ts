import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Config } from '../types/config.interface'

@Injectable()
export class AppConfigService extends ConfigService<Config> {}
