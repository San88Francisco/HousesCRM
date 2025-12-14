import { Home, Hash, Square, Building, MapPin, Coins } from 'lucide-react';
import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFSelect } from '@/components/RHF/RHFSelect';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { APARTMENT_TYPE_OPTIONS } from '@/shared/constants/apartment-form';

interface Props {
  isLoading: boolean;
}

export const ApartmentFormFields = ({ isLoading }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RHFInput
        name="apartmentName"
        label="Назва квартири"
        placeholder="ЖК Щасливе - Квартира 1"
        icon={<Home className="w-4 h-4" />}
        required
        disabled={isLoading}
      />

      <RHFDatePicker
        name="purchaseDate"
        label="Дата покупки"
        placeholder="Оберіть дату покупки"
        disabled={isLoading}
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
        disabled={isLoading}
      />

      <RHFInput
        name="price"
        label="Ціна (грн)"
        type="number"
        placeholder="1000000"
        icon={<Coins className="w-4 h-4" />}
        required
        min={0}
        disabled={isLoading}
      />

      <RHFInput
        name="floor"
        label="Поверх"
        type="number"
        placeholder="5"
        icon={<Building className="w-4 h-4" />}
        required
        disabled={isLoading}
      />

      <RHFInput
        name="roomsCount"
        label="Кількість кімнат"
        type="number"
        placeholder="1"
        icon={<Hash className="w-4 h-4" />}
        required
        min={1}
        disabled={isLoading}
      />

      <RHFInput
        name="street"
        label="Вулиця"
        placeholder="вул. Хрещатик"
        icon={<MapPin className="w-4 h-4" />}
        required
        disabled={isLoading}
      />

      <RHFSelect
        name="apartmentType"
        label="Тип квартири"
        options={[...APARTMENT_TYPE_OPTIONS]}
        placeholder="Виберіть тип"
        disabled={isLoading}
      />
    </div>
  );
};
