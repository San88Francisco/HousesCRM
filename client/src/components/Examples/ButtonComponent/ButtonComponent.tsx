import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export const ButtonComponent = () => {
  return (
    <>
      <div className="flex items-start">
        <Button size="xs" variant="dark">
          Button text
        </Button>
        <Button size="sm" variant="dark">
          Button text
        </Button>
        <Button size="md" variant="dark">
          Button text
        </Button>
        <Button size="lg" variant="dark">
          Button text
        </Button>
        <Button size="xl" variant="dark">
          Button text
        </Button>
      </div>
      <div className="flex items-start">
        <Button size="xs" variant="gray">
          Button text
        </Button>
        <Button size="sm" variant="gray">
          Button text
        </Button>
        <Button size="md" variant="gray">
          Button text
        </Button>
        <Button size="lg" variant="gray">
          Button text
        </Button>
        <Button size="xl" variant="gray">
          Button text
        </Button>
      </div>
      <div className="flex items-start">
        <Button size="xs" variant="white">
          Button text
        </Button>
        <Button size="sm" variant="white">
          Button text
        </Button>
        <Button size="md" variant="white">
          Button text
        </Button>
        <Button size="lg" variant="white">
          Button text
        </Button>
        <Button size="xl" variant="white">
          Button text
        </Button>
      </div>
      <div className="flex items-start">
        <Button size="xs" variant="danger">
          Button text
        </Button>
        <Button size="sm" variant="danger">
          Button text
        </Button>
        <Button size="md" variant="danger">
          Button text
        </Button>
        <Button size="lg" variant="danger">
          Button text
        </Button>
        <Button size="xl" variant="danger">
          Button text
        </Button>
      </div>
      <div className="flex items-start">
        <Button size="xs">
          <User />
        </Button>
        <Button size="sm">
          <User />
        </Button>
        <Button size="md">
          <User />
        </Button>
        <Button size="lg">
          <User />
        </Button>
        <Button size="xl">
          <User />
        </Button>
      </div>
      <div className="flex items-start">
        <Button size="xs" variant="dark">
          <User />
        </Button>
        <Button size="sm" variant="gray">
          <User />
        </Button>
        <Button size="md" variant="white">
          <User />
        </Button>
        <Button size="lg" variant="danger">
          <User />
        </Button>
        <Button size="lg" variant="icon" className="">
          <User />
        </Button>
      </div>
    </>
  );
};
