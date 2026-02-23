import { ContractStatus } from '@/types/core/status';
import { OccupancyBase } from '@/types/services/houses';

export type OccupancyWithVacancy<T extends OccupancyBase> =
  | (T & { isVacancy?: false })
  | (OccupancyBase & { isVacancy: true });

export const breakBetweenContracts = <T extends OccupancyBase>(
  data: T[],
): OccupancyWithVacancy<T>[] =>
  [...data]
    .sort((a, b) => {
      const aTime = a.occupied ? new Date(a.occupied).getTime() : 0;
      const bTime = b.occupied ? new Date(b.occupied).getTime() : 0;
      return bTime - aTime;
    })
    .reduce<OccupancyWithVacancy<T>[]>((acc, current, index, arr) => {
      const next = arr[index + 1];

      const vacancy: OccupancyWithVacancy<T> | null =
        next &&
        next.vacated &&
        current.occupied &&
        new Date(next.vacated).getTime() < new Date(current.occupied).getTime()
          ? {
              id: `vacancy-${next.vacated}-${current.occupied}`,
              firstName: 'Відсутній',
              lastName: 'Орендар',
              occupied: next.vacated,
              vacated: current.occupied,
              totalIncome: 0,
              status: ContractStatus.INACTIVE,
              isVacancy: true,
            }
          : null;

      acc.push(current);
      if (vacancy) acc.push(vacancy);
      return acc;
    }, []);
