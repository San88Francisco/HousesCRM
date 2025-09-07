import type { Request } from 'express'

export interface IUser {
  id: string
  email: string
}

export interface AuthenticatedRequest extends Request {
  user: IUser
}
