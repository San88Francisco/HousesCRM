import { ThemeSwitch } from '../ThemeDropDown';
import HeaderNavigation from './HeaderNavigation';
import HeaderSearch from './HeaderSearch';

const Header = () => {
  return (
    <header className="w-full border-b-2 border-border flex items-center justify-between px-4 py-2">
      <HeaderNavigation />

      <div className="flex items-center gap-3">
        <HeaderSearch />
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default Header;
