import { GoogleLoginButton } from '@/components/GoogleAuthButton';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export const ButtonComponent = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <Button size="xs">Button text</Button>
        <Button size="sm">Button text</Button>
        <Button size="md">Button text</Button>
        <Button size="lg">Button text</Button>
        <Button size="xl">Button text</Button>
      </div>
      <div className="flex items-start gap-2">
        <Button size="xs" variant="secondary">
          Button text
        </Button>
        <Button size="sm" variant="secondary">
          Button text
        </Button>
        <Button size="md" variant="secondary">
          Button text
        </Button>
        <Button size="lg" variant="secondary">
          Button text
        </Button>
        <Button size="xl" variant="secondary">
          Button text
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button size="xs" variant="outline">
          Button text
        </Button>
        <Button size="sm" variant="outline">
          Button text
        </Button>
        <Button size="md" variant="outline">
          Button text
        </Button>
        <Button size="lg" variant="outline">
          Button text
        </Button>
        <Button size="xl" variant="outline">
          Button text
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button size="xs" variant="destructive">
          Button text
        </Button>
        <Button size="sm" variant="destructive">
          Button text
        </Button>
        <Button size="md" variant="destructive">
          Button text
        </Button>
        <Button size="lg" variant="destructive">
          Button text
        </Button>
        <Button size="xl" variant="destructive">
          Button text
        </Button>
      </div>
      <div className="flex items-start gap-2">
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
      <div className="flex items-start gap-2">
        <Button size="xs">
          <User />
        </Button>
        <Button size="sm" variant="secondary">
          <User />
        </Button>
        <Button size="md" variant="outline">
          <User />
        </Button>
        <Button size="lg" variant="destructive">
          <User />
        </Button>
        <Button size="lg" variant="icon">
          <User />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <GoogleLoginButton size="xs" variant="default" />
        <GoogleLoginButton size="sm" variant="secondary" />
        <GoogleLoginButton size="md" variant="outline" />
      </div>
    </div>
  );
};
