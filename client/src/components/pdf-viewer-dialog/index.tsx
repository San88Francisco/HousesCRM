import { useAnimatedIcon } from '@/hooks';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { FileTextIcon } from '@/shared/ui/file-text';
import PDFTemplate from './pdf-template';
import { FC, useState } from 'react';
import { useLazyGetContractPdfQuery } from '@/store/contracts';
import { contractViewDto, ContractViewModel } from './contract-dto';
import PDFSkeleton from './pdf-skeleton';

interface Props {
  id: string;
}

const PdfViewerDialog: FC<Props> = ({ id }) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(<FileTextIcon />);

  const [trigger, { data: _, isLoading }] = useLazyGetContractPdfQuery();
  const [contractData, setContractData] = useState<ContractViewModel | null>(null);

  const handleOpen = async () => {
    const res = await trigger(id);
    if (res.data) {
      const contract = contractViewDto(res.data);
      setContractData(contract);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="px-4 py-2 text-text rounded-md w-[28px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOpen}
      >
        {animatedIcon}
      </DialogTrigger>

      <DialogContent className="max-w-[800px] py-[3px] px-[2px] text-text">
        <div
          className="max-w-[800px] max-h-[90vh] overflow-auto p-5
          scrollbar-none
          [&::-webkit-scrollbar]:w-[4px]
          [&::-webkit-scrollbar]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-muted-text
          [&::-webkit-scrollbar-track]:bg-transparent
          [scrollbar-color:scroll-bar_transparent]
          [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {isLoading || !contractData ? <PDFSkeleton /> : <PDFTemplate data={contractData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewerDialog;
