import { ContractStatus } from '@/types/core/status/status';
import { OccupancyBase } from '@/types/services/houses';

export const breakBetweenContracts = <T extends OccupancyBase>(data: T[]): T[] =>
  [...data]
    .sort((a, b) => new Date(b.occupied).getTime() - new Date(a.occupied).getTime())
    .reduce<T[]>((acc, current, index, arr) => {
      const next = arr[index + 1];

      const vacancy =
        next && new Date(next.vacated).getTime() < new Date(current.occupied).getTime()
          ? ({
              id: `vacancy-${next.vacated}-${current.occupied}`,
              firstName: 'Відсутній',
              lastName: 'Орендар',
              occupied: next.vacated,
              vacated: current.occupied,
              totalIncome: 0,
              status: ContractStatus.INACTIVE,
            } as T)
          : null;

      return vacancy ? [...acc, current, vacancy] : [...acc, current];
    }, []);
