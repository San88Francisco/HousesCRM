'use client';

import { CurrencyRevaluationChart } from '@/widgets/all-apartments/currency-revaluation-chart/CurrencyRevaluationChart';
import { ChartPieDonutText } from '@/widgets/all-apartments/pie-chart-revenue-distribution';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';

const Page = () => {
  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    dispatch(openModal({ trigger: ModalTriggers.ADD_APARTMENT }));
  };

  return (
    <div className="p-8">
      <Button onClick={handleOpenModal}>Додати квартиру</Button>

      <CurrencyRevaluationChart />
      <ChartPieDonutText />
    </div>
  );
};

export default Page;
