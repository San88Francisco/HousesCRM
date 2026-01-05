import { toast } from 'sonner';

export const renterFormToast = {
  loading: (isEdit: boolean) =>
    toast.loading(isEdit ? 'Оновлення орендаря...' : 'Створення орендаря...'),

  success: (isEdit: boolean, id: string | number) =>
    toast.success(isEdit ? 'Орендаря успішно оновлено!' : 'Орендаря успішно додано!', { id }),

  error: (isEdit: boolean, id: string | number, message?: string) =>
    toast.error(
      message ?? (isEdit ? 'Не вдалося оновити орендаря' : 'Не вдалося створити орендаря'),
      { id },
    ),

  info: (id: string | number) => toast.info('Не виявлено змін', { id }),
};
