import { RHFForm } from '../RHF/RHForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { SearchRequest } from '@/types/services/search';
import { searchDefaultValues, searchSchema } from '@/validation/search/search';
import { RHFInput } from '../RHF/RHFInput';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';

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
