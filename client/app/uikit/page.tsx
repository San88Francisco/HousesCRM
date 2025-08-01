import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export default function Page() {
  return (
    <div>
      <Button size="xs">
        <User />
        Button text
        <User />
      </Button>
      <Button size="sm">
        <User />
        Button text
        <User />
      </Button>
      <Button size="md">
        <User />
        Button text
      </Button>
      <Button size="lg">
        <User />
        Button text
      </Button>
      <Button size="xl">
        <User />
        Button text
      </Button>
    </div>
  );
}
