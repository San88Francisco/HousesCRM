import { ROUTES } from '@/shared/routes';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  redirect(ROUTES.PROFILE_PERSONAL);
}
