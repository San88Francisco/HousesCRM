import { Checkbox } from '@/shared/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Switch } from '@/shared/ui/switch';

export const ControlButtons = () => {
  return (
    <>
      <div className="flex items-start gap-5">
        <Checkbox size="sm" label="test" />
        <Checkbox size="md" label="test" />
        <Checkbox size="lg" label="test" />
      </div>
      <div className="flex items-start gap-5">
        <Switch />
      </div>
      <div className="flex items-center gap-3">
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="option1" id="r1" />
            <RadioGroupItem value="option2" id="r2" />
            <RadioGroupItem value="option3" id="r3" />
          </div>
        </RadioGroup>
      </div>
    </>
  );
};
