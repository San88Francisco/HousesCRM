import { ValidationError } from '@nestjs/common'

export const flattenErrors = (
  errs: ValidationError[],
  parent = '',
  acc: Record<string, string> = {}
): Record<string, string> => {
  for (const e of errs) {
    const path = parent ? `${parent}.${e.property}` : e.property
    if (e.constraints) {
      acc[path] = Object.values(e.constraints)[0]
    }
    if (e.children?.length) {
      flattenErrors(e.children, path, acc)
    }
  }
  return acc
}
