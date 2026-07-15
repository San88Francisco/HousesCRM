import { cn } from '@/shared/utils/cn';

type Props = {
  numericValue: number;
  previousValue: number;
  consumption: number;
  cost: number | null;
  tariffPrice: number | null;
  unit: string;
  pillBgClass: string;
};

export const CalculationPreview = ({
  numericValue,
  previousValue,
  consumption,
  cost,
  tariffPrice,
  unit,
  pillBgClass,
}: Props) => (
  <div className="rounded-md border border-border p-3 text-sm">
    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text opacity-60">
      Розрахунок
    </div>
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-text">
      <span className="opacity-75">
        {numericValue} − {previousValue} =
      </span>
      <span className={cn('rounded-full px-2.5 py-0.5 font-semibold text-text', pillBgClass)}>
        {consumption} {unit}
      </span>
      {cost !== null && tariffPrice !== null ? (
        <>
          <span className="opacity-75">× {tariffPrice} грн =</span>
          <span className="rounded-full bg-green/30 px-2.5 py-0.5 font-semibold text-text">
            {cost.toFixed(2)} грн
          </span>
        </>
      ) : (
        <span className="text-text opacity-60">
          (тариф не встановлено — вартість не розраховується)
        </span>
      )}
    </div>
  </div>
);
