'use client';

import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';

import { SearchRequest } from '@/types/services/search';
import { searchDefaultValues, searchSchema } from '@/validation/search/search';
import { RHFForm } from '@/components/RHF/RHForm';
import { RHFInput } from '@/components/RHF/RHFInput';
import { useLazyGetAllSearchQuery } from '@/store/search';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchDropdown } from './SearchDropdown';

const DEBOUNCE = 400;

const HeaderSearch = () => {
  const [open, setOpen] = useState(false);
  const [triggerSearch, { data, isFetching, isError }] = useLazyGetAllSearchQuery();

  const form = useForm<SearchRequest>({
    resolver: yupResolver(searchSchema),
    defaultValues: searchDefaultValues,
  });

  const query = form.watch('query');
  const debouncedQuery = useDebounce(query, DEBOUNCE);

  useEffect(() => {
    const term = debouncedQuery?.trim() ?? '';

    if (!term) {
      setOpen(false);
      return;
    }

    triggerSearch({ query: term })
      .unwrap()
      .then(() => setOpen(true))
      .catch(() => setOpen(false));
  }, [debouncedQuery, triggerSearch]);

  return (
    <div className="relative w-full max-w-md">
      <RHFForm form={form} onSubmit={() => {}}>
        <RHFInput
          name="query"
          type="text"
          placeholder="Пошук..."
          hotkey="k"
          hotkeyCtrl
          icon={<Search />}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const term = form.getValues('query')?.trim();
              if (!term) {
                setOpen(false);
                return;
              }
              triggerSearch({ query: term })
                .unwrap()
                .then(() => setOpen(true))
                .catch(() => setOpen(false));
            }
          }}
        />
      </RHFForm>

      <SearchDropdown
        open={open}
        onOpenChange={setOpen}
        data={data}
        isFetching={isFetching}
        isError={isError}
      />
    </div>
  );
};

export default HeaderSearch;
