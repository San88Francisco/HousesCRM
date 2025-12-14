'use client';

import { CurrencyRevaluationChart } from '@/widgets/all-apartments/currency-revaluation-chart/CurrencyRevaluationChart';
import { ChartPieDonutText } from '@/widgets/all-apartments/pie-chart-revenue-distribution';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';

import { ApartmentRentalChart } from '@/widgets/chart-houses-overview';
const Page = () => {
  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    dispatch(openModal({ trigger: ModalTriggers.ADD_APARTMENT }));
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <Button onClick={handleOpenModal}>Додати квартиру</Button>
      <ApartmentRentalChart />
      <CurrencyRevaluationChart />
      <ChartPieDonutText />
    </div>
  );
};

export default Page;
