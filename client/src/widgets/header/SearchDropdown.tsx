'use client';
/* eslint-disable */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { formatDate } from '@/shared/utils/format/format-date';
import { navigateToItem } from '@/shared/utils/search/navigate-to-item';
import { SearchResponse } from '@/types/services/search';
import { useRouter } from 'next/navigation';
import { ComponentProps } from 'react';

type ExtendedDropdownContentProps = ComponentProps<typeof DropdownMenuContent> & {
  onOpenAutoFocus?: (e: Event) => void;
  onCloseAutoFocus?: (e: Event) => void;
};

const Content = (props: ExtendedDropdownContentProps) => {
  return <DropdownMenuContent {...props} />;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: SearchResponse;
  isFetching: boolean;
  isError: boolean;
};

export const SearchDropdown = ({ open, onOpenChange, data, isFetching, isError }: Props) => {
  const router = useRouter();

  const showSeparator =
    !!data && [data.houses, data.renters, data.contracts].filter(arr => arr?.length).length > 1;

  const hasResults =
    !!data &&
    ((data.houses?.length ?? 0) > 0 ||
      (data.renters?.length ?? 0) > 0 ||
      (data.contracts?.length ?? 0) > 0);

  return (
    <DropdownMenu open={open} onOpenChange={v => !v && onOpenChange(false)}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 opacity-0 pointer-events-none"
        />
      </DropdownMenuTrigger>

      <Content
        className="w-full mt-2 max-h-[600px] overflow-y-auto"
        align="start"
        side="bottom"
        sideOffset={4}
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
        onCloseAutoFocus={(e: Event) => e.preventDefault()}
      >
        {isFetching && <DropdownMenuLabel>Завантаження...</DropdownMenuLabel>}

        {isError && (
          <DropdownMenuLabel className="text-red-500">Помилка під час пошуку</DropdownMenuLabel>
        )}

        {!isFetching && !isError && !hasResults && (
          <DropdownMenuLabel>Нічого не знайдено</DropdownMenuLabel>
        )}

        {!isFetching && !isError && data && hasResults && (
          <>
            {data.houses?.length ? (
              <>
                <DropdownMenuLabel>Квартири</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {data.houses.map(house => (
                    <DropdownMenuItem
                      key={house.id}
                      onClick={() => {
                        navigateToItem(router, 'APARTMENT', house.id);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{house.apartmentName}</span>
                        <span className="text-xs text-muted-text">
                          {house.street} · {house.roomsCount} кімнати · {house.totalArea} м²
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                {showSeparator && <DropdownMenuSeparator className="my-1 h-[0.5px]" />}
              </>
            ) : null}

            {data.renters?.length ? (
              <>
                <DropdownMenuLabel>Орендарі</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {data.renters.map(renter => (
                    <DropdownMenuItem
                      key={renter.id}
                      onClick={() => {
                        navigateToItem(router, 'RENTER', renter.id);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {renter.firstName} {renter.lastName}
                        </span>
                        <span className="text-xs text-muted-text">
                          Дохід: {renter.totalIncome} грн
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                {showSeparator && <DropdownMenuSeparator className="my-1 h-[1px]" />}
              </>
            ) : null}

            {data.contracts?.length ? (
              <>
                <DropdownMenuLabel>Контракти</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {data.contracts.map(contract => (
                    <DropdownMenuItem
                      key={contract.id}
                      onClick={() => {
                        navigateToItem(router, 'CONTRACT', contract.id);
                        onOpenChange(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{contract.monthlyPayment} грн / місяць</span>
                        <span className="text-xs text-muted-text">
                          {formatDate(contract.commencement)} – {formatDate(contract.termination)} ·
                          {contract.status}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            ) : null}
          </>
        )}
      </Content>
    </DropdownMenu>
  );
};
