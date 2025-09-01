import { UnprocessableEntityException, ValidationError, ValidationPipeOptions } from '@nestjs/common'
import { flattenErrors } from 'src/utils/flatten-errors.util'

export const validationConfig: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  stopAtFirstError: false,
  validationError: { target: false, value: false },
  exceptionFactory: (errors: ValidationError[]) =>
    new UnprocessableEntityException({
      error: 'Validation Error',
      message: flattenErrors(errors),
    }),
}
