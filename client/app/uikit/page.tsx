import { ButtonComponent } from '@/components/Examples/ButtonComponent/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent/CardComponent';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent />
      <CardComponent />
    </div>
  );
}
