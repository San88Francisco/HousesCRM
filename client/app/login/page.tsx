import { BackgroundLogo } from '@/shared/ui/background-logo';
import { GoogleOAuthHashHandler } from '@/widgets/login/google-oauth-hash-handler';
import { LoginForm } from '@/widgets/login/login-form';

const Page = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      <GoogleOAuthHashHandler />
      <BackgroundLogo />

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
