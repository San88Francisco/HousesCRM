import { toast } from 'sonner';

export const houseFormToast = {
  loading: (isEdit: boolean) =>
    toast.loading(isEdit ? 'Оновлення квартири...' : 'Створення квартири...'),

  success: (isEdit: boolean, id: string | number) =>
    toast.success(isEdit ? 'Квартиру успішно оновлено!' : 'Квартиру успішно додано!', { id }),

  error: (isEdit: boolean, id: string | number, message?: string) =>
    toast.error(
      message ?? (isEdit ? 'Не вдалося оновити квартиру' : 'Не вдалося створити квартиру'),
      { id },
    ),
};
