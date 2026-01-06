type Props = {
  isLoading: boolean;
  housesCount: number;
};

export const MapStats = ({ isLoading, housesCount }: Props) => {
  return (
    <div className="mt-4 flex items-center gap-4 text-sm flex-wrap">
      {isLoading && (
        <p className="text-muted-text flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Завантаження даних...
        </p>
      )}

      {!isLoading && housesCount === 0 && (
        <p className="text-muted-text">Координати будинків ще не додані до API</p>
      )}

      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-info rounded-full" />
        <span className="text-muted-text">
          {housesCount} {housesCount === 1 ? "об'єкт" : "об'єкти"}
        </span>
      </div>
    </div>
  );
};
