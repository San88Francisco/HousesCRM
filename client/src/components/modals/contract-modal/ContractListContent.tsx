import { MAX_MODAL_HEIGHT } from '@/constants/renter';
import { cn } from '@/shared/utils/cn';
import { ContractResponse } from '@/types/services/renters';
import { RefObject } from 'react';
import { ContractItem } from './ContractItem';

type Props = {
  contracts: ContractResponse[];
  isFetching: boolean;
  hasMore: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
};

export const ContractListContent = ({ contracts, isFetching, hasMore, loadMoreRef }: Props) => {
  const showEmptyState = !isFetching && contracts.length === 0;
  const showAllLoaded = !hasMore && contracts.length > 0;

  return (
    <div className="mt-4 overflow-y-auto px-2" style={{ maxHeight: MAX_MODAL_HEIGHT }}>
      {contracts.length > 0 && (
        <ul className="space-y-2">
          {contracts.map(contract => (
            <ContractItem key={contract.id} contract={contract} />
          ))}
        </ul>
      )}

      {isFetching && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className={cn('h-8 w-8 animate-spin rounded-full border-b-2 border-current')} />
          <p className="text-muted">Завантаження...</p>
        </div>
      )}

      {showAllLoaded && (
        <div className="py-4 text-center text-sm text-muted">Всі договори завантажені</div>
      )}

      {showEmptyState && (
        <div className="py-4 text-center text-sm text-muted">Договори відсутні</div>
      )}

      <div ref={loadMoreRef} className="h-px" aria-hidden="true" />
    </div>
  );
};
