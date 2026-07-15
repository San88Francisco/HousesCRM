import { UtilityTariff } from '@/types/services/meters';

export const getCurrentTariff = (tariffs: UtilityTariff[]): UtilityTariff | null => {
  const today = new Date().toISOString().slice(0, 10);
  return tariffs.find(tariff => tariff.validFrom <= today) ?? null;
};
