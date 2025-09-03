import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TableActionsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  customText?: string;
};

export const TableActions = ({
  onEdit,
  onDelete,
  customText = 'Твій текст тут',
}: TableActionsProps) => {
  return (
    <div className="flex justify-end items-center gap-4">
      <span className="text-sm text-text">{customText}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="opacity-0 group-hover:opacity-100" variant="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>Редагувати</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Видалити</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
