import { RHFForm } from '../RHF/RHForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { SearchRequest } from '@/types/services/search';
import { searchDefaultValues, searchSchema } from '@/validation/search/search';
import { RHFInput } from '../RHF/RHFInput';
import { ThemeSwitch } from '../ThemeDropDown';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import HeaderNavigation from './HeaderNavigation';

const Header = () => {
  const form = useForm<SearchRequest>({
    resolver: yupResolver(searchSchema),
    defaultValues: searchDefaultValues,
  });

  const onSubmit = async (data: SearchRequest) => {
    console.warn(data.query);
  };

  return (
    <header className="w-full border-b-2 border-border flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <HeaderNavigation />
      </div>

      <div className="flex items-center gap-3">
        <RHFForm form={form} onSubmit={onSubmit}>
          <RHFInput name="query" type="query" placeholder="Search..." icon={<Search />} />
        </RHFForm>
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
