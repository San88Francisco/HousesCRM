// import { useAnimatedIcon } from '@/hooks';
// import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
// import { FileTextIcon } from '@/shared/ui/file-text';
// import PDFTemplate from './pdf-template';
// import { FC } from 'react';
// import { useLazyGetContractPdfQuery } from '@/store/contracts';

// interface Props {
//   id: string;
// }

// const PdfViewerDialog: FC<Props> = ({ id }) => {
//   const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(<FileTextIcon />);

//   const [trigger, { data, isLoading }] = useLazyGetContractPdfQuery();

//   // if (isLoading) return <div>Загрузка...</div>;
//   const handleOpen = async () => {
//     await trigger(id).unwrap();
//     await console.warn(data);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger
//         className="px-4 py-2 text-text rounded-md w-[28px]"
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onClick={handleOpen}
//       >
//         {animatedIcon}
//       </DialogTrigger>

//       <DialogContent className="max-w-[800px] py-[3px] px-[2px] text-text">
//         <div
//           className="max-w-[800px] max-h-[90vh] overflow-auto p-5
//           scrollbar-none
//          [&::-webkit-scrollbar]:w-[4px]
//          [&::-webkit-scrollbar]:bg-transparent
//          [&::-webkit-scrollbar-thumb]:bg-muted-text
//          [&::-webkit-scrollbar-track]:bg-transparent
//          [scrollbar-color:scroll-bar_transparent]
//          [&::-webkit-scrollbar-thumb]:rounded-full"
//         >
//           {/* {isLoading ? <div>Loading</div> : <PDFTemplate />} */}
//            <PDFTemplate />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default PdfViewerDialog;
import { useAnimatedIcon } from '@/hooks';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { FileTextIcon } from '@/shared/ui/file-text';
import PDFTemplate from './pdf-template';
import { FC, useMemo } from 'react';
import { useLazyGetContractPdfQuery } from '@/store/contracts';
import { mapContractToPdfView } from './contract-dto';

interface Props {
  id: string;
}

const PdfViewerDialog: FC<Props> = ({ id }) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(<FileTextIcon />);

  const [trigger, { data: rawData, isLoading }] = useLazyGetContractPdfQuery();

  const handleOpen = async () => {
    await new Promise(res => setTimeout(res, 3000));
    await trigger(id);
  };

  const contractData = useMemo(() => mapContractToPdfView(rawData), [rawData]);

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
          <PDFTemplate data={contractData} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewerDialog;
