'use client';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

const EmptyTableBody = ({ columnsLength }: { columnsLength: number }) => (
  <TableBody>
    <TableRow>
      <TableCell colSpan={columnsLength} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  </TableBody>
);

export default EmptyTableBody;
