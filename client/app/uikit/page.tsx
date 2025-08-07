import { LabelWithElement } from '@/components/LabelWithElement/LabelWithElement';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { User } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
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
      <div className="flex items-start gap-5">
        <Checkbox />
        <Switch />
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="default" id="r1" />
          </div>
        </RadioGroup>
      </div>
      <LabelWithElement text="label title">
        <Checkbox />
      </LabelWithElement>
    </div>
  );
}
