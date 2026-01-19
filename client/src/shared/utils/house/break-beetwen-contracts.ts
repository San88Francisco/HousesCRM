import { ContractStatus } from '@/types/core/status/status';
import { OccupancyBase } from '@/types/services/houses';

export const addVacancyGaps = <T extends OccupancyBase>(data: T[]): T[] =>
  [...data]
    .sort((a, b) => new Date(b.occupied).getTime() - new Date(a.occupied).getTime())
    .reduce<T[]>((acc, current, index, arr) => {
      const next = arr[index + 1];

      const vacancy =
        next && new Date(current.vacated).getTime() < new Date(next.occupied).getTime()
          ? ({
              id: `vacancy-${current.vacated}-${next.occupied}`,
              firstName: 'Відсутній',
              lastName: 'Орендар',
              occupied: current.vacated,
              vacated: next.occupied,
              totalIncome: 0,
              status: ContractStatus.INACTIVE,
            } as T)
          : null;

      return vacancy ? [...acc, current, vacancy] : [...acc, current];
    }, []);
