'use client';

import { CurrencyRevaluationChart } from '@/widgets/all-apartments/currency-revaluation-chart/CurrencyRevaluationChart';
import { ChartPieDonutText } from '@/widgets/all-apartments/pie-chart-revenue-distribution';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { ApartmentFormModal } from '@/components/modals/aparment-form';

// const id = 'f021f05c-4cd3-4ac6-a349-faf420d4290b';

const Page = () => {
  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    // console.log('handleOpenModal');

    dispatch(openModal({ trigger: ModalTriggers.ADD_APARTMENT }));
  };

  // const handleEdit = (apartment: ApartmentToEdit) => {
  //   console.log(apartment);

  //   dispatch(
  //     openModal({
  //       trigger: ModalTriggers.EDIT_APARTMENT,
  //       payload: { apartment },
  //     }),
  //   );
  // };

  // const { data, error, isLoading } = useGetHouseByIdQuery(id);

  // useEffect(() => {
  //   console.log('data:', data?.houseDetail);
  // }, [data, error, isLoading]);

  return (
    <div className="p-8">
      <Button onClick={handleOpenModal}>Додати квартиру</Button>
      {/* <Button onClick={() => handleEdit(data?.houseDetail)}>Відредагувати квартиру</Button> */}

      <ApartmentFormModal />
      {/* Модалка рендериться тут, але показується тільки коли isOpen === true */}

      <CurrencyRevaluationChart />
      <ChartPieDonutText />
    </div>
  );
};

export default Page;
