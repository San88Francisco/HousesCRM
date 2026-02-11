import { BackgroundLogo } from '@/widgets/login/background-logo';
import { LoginForm } from '@/widgets/login/login-form';

const Page = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      <BackgroundLogo />

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
