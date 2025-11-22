import BackgroundLogo from '@/widgets/login/background-logo/BackgroundLogo';
import { LoginForm } from '@/widgets/login/login-form';

export default async function Page() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <BackgroundLogo />

      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
