'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { SearchRequest } from '@/types/services/search';
import { searchDefaultValues, searchSchema } from '@/validation/search/search';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { RHFForm } from '@/components/RHF/RHForm';
import { RHFInput } from '@/components/RHF/RHFInput';

const HeaderSearch = () => {
  const form = useForm<SearchRequest>({
    resolver: yupResolver(searchSchema),
    defaultValues: searchDefaultValues,
  });

  const onSubmit = async (data: SearchRequest) => {
    console.warn(data.query);
  };
  return (
    <RHFForm form={form} onSubmit={onSubmit}>
      <RHFInput name="query" type="query" placeholder="Search..." icon={<Search />} />
    </RHFForm>
  );
};

export default HeaderSearch;
