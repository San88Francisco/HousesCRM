import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
        <Checkbox size="sm" />
        <Checkbox size="sm" variant="blueCustom" />
        <Checkbox size="sm" variant="sky100" />
        <Checkbox />
        <Checkbox variant="blueCustom" />
        <Checkbox variant="sky100" />
        <Checkbox size="lg" />
        <Checkbox size="lg" variant="blueCustom" />
        <Checkbox size="lg" variant="sky100" />
      </div>
      <div className="flex items-start gap-5">
        <Switch />
        <Switch variant="blueCustom" />
        <Switch variant="sky100" />
        <Switch size="sm" />
        <Switch size="sm" variant="blueCustom" />
        <Switch size="sm" variant="sky100" />
        <Switch size="lg" />
        <Switch size="lg" variant="blueCustom" />
        <Switch size="lg" variant="sky100" />
      </div>
      <div className="flex items-start gap-5">
        <RadioGroup className="flex items-start gap-5">
          <RadioGroupItem value="1" size="sm" />
          <RadioGroupItem value="2" variant="blueCustom" size="sm" />
          <RadioGroupItem value="3" variant="sky100" size="sm" />
        </RadioGroup>
        <RadioGroup className="flex items-start gap-5">
          <RadioGroupItem value="1" />
          <RadioGroupItem value="2" variant="blueCustom" />
          <RadioGroupItem value="3" variant="sky100" />
        </RadioGroup>
        <RadioGroup className="flex items-start gap-5">
          <RadioGroupItem value="1" size="lg" />
          <RadioGroupItem value="2" variant="blueCustom" size="lg" />
          <RadioGroupItem value="3" variant="sky100" size="lg" />
        </RadioGroup>
      </div>
    </div>
  );
}
