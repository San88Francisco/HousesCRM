'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFForm } from '@/components/RHF/RHForm';
import { Button } from '@/shared/ui/button';
import {
  AddressSearchRequest,
  addressSearchSchema,
} from '@/shared/validation/geo-map-3d/address-search';

type Props = {
  searchAddress: string;
  setSearchAddress: (value: string) => void;
  isSearching: boolean;
  searchError: string | null;
  searchResult: { street: string } | null;
  setSearchError: (error: string | null) => void;
  setSearchResult: (result: null) => void;
  handleSearch: () => void;
  clearSearch: () => void;
};

export const SearchBar = ({
  searchAddress,
  setSearchAddress,
  isSearching,
  searchError,
  searchResult,
  setSearchError,
  setSearchResult,
  handleSearch,
  clearSearch,
}: Props) => {
  const form = useForm<AddressSearchRequest>({
    resolver: yupResolver(addressSearchSchema),
    defaultValues: { address: searchAddress },
  });

  const handleFormChange = (value: string) => {
    form.setValue('address', value);
    setSearchAddress(value);
    setSearchError(null);
    if (searchResult) {
      setSearchResult(null);
    }
  };

  return (
    <div className="mt-6">
      <RHFForm form={form} onSubmit={() => handleSearch()}>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <RHFInput
              name="address"
              type="text"
              placeholder="Пошук за адресою (наприклад: вул. Данила Галицького, 6)"
              hotkey="l"
              hotkeyCtrl
              icon={<Search />}
              onChange={e => handleFormChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            {searchError && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <span>⚠️</span>
                <span>{searchError}</span>
              </p>
            )}
            {searchResult && (
              <div className="flex items-center gap-2 mt-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <p className="text-sm text-green-700 dark:text-green-300 flex-1">
                  Знайдено: {searchResult.street}
                </p>
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? 'Шукаю...' : 'Знайти'}
          </Button>
        </div>
      </RHFForm>
    </div>
  );
};
