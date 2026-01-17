import { toast } from 'sonner';

export const contractFormToast = {
  loading: (isEdit: boolean) =>
    toast.loading(isEdit ? 'Оновлення контракту...' : 'Створення контракту...'),

  success: (isEdit: boolean, id: string | number) =>
    toast.success(isEdit ? 'Контракт успішно оновлено!' : 'Контракт успішно додано!', { id }),

  error: (isEdit: boolean, id: string | number, message?: string) =>
    toast.error(
      message ?? (isEdit ? 'Не вдалося оновити контракт' : 'Не вдалося створити контракт'),
      { id },
    ),

  info: (id: string | number) => toast.info('Не виявлено змін', { id }),
};
