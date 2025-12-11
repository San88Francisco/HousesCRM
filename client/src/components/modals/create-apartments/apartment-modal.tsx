'use client';

import { useForm } from 'react-hook-form';
import { Home, Hash, Square, DollarSign, Building, MapPin } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';

import { ModalTriggers } from '@/types/model/modals';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';
import { closeModal } from '@/store/modal-slice';
import { Button } from '@/shared/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  ApartmentFormData,
  apartmentSchema,
} from '@/shared/validation/add-apartments/apartment-schema';
import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFSelect } from '@/components/RHF/RHFSelect';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFForm } from '@/components/RHF/RHForm';
/* eslint-disable */
export const AddApartmentModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger } = useAppSelector(s => s.modal);

  const isThisModalOpen = isOpen && trigger === ModalTriggers.ADD_APARTMENT;

  const methods = useForm<ApartmentFormData>({
    resolver: yupResolver(apartmentSchema),
    defaultValues: {
      apartmentName: '',
      roomsCount: 1,
      totalArea: 1,
      // purchaseDate: new Date().toISOString().split('T')[0],
      purchaseDate: new Date(),
      price: 1,
      floor: 1,
      street: '',
      apartmentType: 'new_build',
      contractIds: [],
    },
  });

  const { reset } = methods;

  const onSubmit = async (data: CreateHouseRequest) => {
    try {
      const result = await createHouse(data).unwrap();
      console.log('Квартира створена:', result);
      // Закрити діалог, показати success toast тощо
    } catch (error) {
      console.error('Помилка:', error);
      // Показати error toast
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
    reset();
  };

  const apartmentTypeOptions = [
    { value: 'new_build', label: 'Новобудова' },
    { value: 'old_build', label: 'Вторинне житло' },
  ];

  return (
    <Dialog open={isThisModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Додати нову квартиру</DialogTitle>
          <DialogDescription>Заповніть форму для додавання нової квартири</DialogDescription>
        </DialogHeader>

        <RHFForm form={methods} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              name="apartmentName"
              label="Назва квартири"
              placeholder="Введіть назву"
              icon={<Home className="w-4 h-4" />}
              required
            />

            <RHFDatePicker
              name="purchaseDate"
              label="Дата покупки"
              placeholder="Оберіть дату покупки"
            />

            <RHFInput
              name="totalArea"
              label="Загальна площа (м²)"
              type="number"
              placeholder="50.5"
              icon={<Square className="w-4 h-4" />}
              required
              min={0}
              step="0.01"
            />

            <RHFInput
              name="price"
              label="Ціна"
              type="number"
              placeholder="1000000"
              icon={<DollarSign className="w-4 h-4" />}
              required
              min={0}
            />

            <RHFInput
              name="floor"
              label="Поверх"
              type="number"
              placeholder="5"
              icon={<Building className="w-4 h-4" />}
              required
            />

            <RHFInput
              name="roomsCount"
              label="Кількість кімнат"
              type="number"
              placeholder="1"
              icon={<Hash className="w-4 h-4" />}
              required
              min={1}
            />

            <RHFInput
              name="street"
              label="Вулиця"
              placeholder="вул. Хрещатик"
              icon={<MapPin className="w-4 h-4" />}
              required
            />

            <RHFSelect
              name="apartmentType"
              label="Тип квартири"
              options={apartmentTypeOptions}
              placeholder="Виберіть тип"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Скасувати
            </Button>
            <Button type="submit">Додати квартиру</Button>
          </DialogFooter>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};
