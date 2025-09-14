import Image from 'next/image';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '../ui/sidebar';

type Props = {
  state: 'collapsed' | 'expanded';
  label: string;
};

const sidebarTriggerStyles = 'h-7 w-7 p-0';

export const SidebarHeader = ({ state, label }: Props) => {
  return (
    <div
      className={cn('flex items-center gap-2 p-4', state === 'collapsed' && 'px-0 justify-center')}
    >
      <div className="relative h-7 w-7 group/avatar">
        <Image
          className={cn(
            'rounded-full h-7 w-7 object-cover transition-opacity',
            state === 'collapsed' && 'group-hover/avatar:opacity-0',
          )}
          alt="avatar"
          src="/avatar.png"
          width={28}
          height={28}
        />
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            state === 'collapsed'
              ? 'opacity-0 group-hover/avatar:opacity-100 transition-opacity'
              : 'hidden',
          )}
        >
          <SidebarTrigger className={cn(sidebarTriggerStyles, 'w-10')} />
        </div>
      </div>
      {state === 'expanded' && (
        <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      )}
      {state === 'expanded' && (
        <div className="ml-auto">
          <SidebarTrigger className={sidebarTriggerStyles} />
        </div>
      )}
    </div>
  );
};
