import BackgroundLogo from '@/widgets/login/background-logo/BackgroundLogo';
import { LoginForm } from '@/widgets/login/login-form';

export default function Page() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      <BackgroundLogo />

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
