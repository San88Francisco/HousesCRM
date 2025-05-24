// Утилітарна функція для обробки помилок
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error
  }

  if (error && typeof error === "object") {
    // Обробка API помилок з структурою { data: { message: string } }
    if ("data" in error && error.data && typeof error.data === "object" && "message" in error.data) {
      return String(error.data.message)
    }

    // Обробка помилок з прямою структурою { message: string }
    if ("message" in error && typeof error.message === "string") {
      return error.message
    }

    // Обробка стандартних Error об'єктів
    if ("message" in error) {
      return String(error.message)
    }

    // Обробка RTK Query помилок
    if ("error" in error && typeof error.error === "string") {
      return error.error
    }

    // Обробка помилок з status та data
    if ("status" in error && "data" in error && error.data && typeof error.data === "object") {
      if ("message" in error.data) {
        return String(error.data.message)
      }
    }
  }

  if (error === null || error === undefined) {
    return "Сталася невідома помилка"
  }

  // Fallback для невідомих типів помилок
  return String(error)
}
