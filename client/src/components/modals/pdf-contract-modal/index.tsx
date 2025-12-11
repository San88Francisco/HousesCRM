import { DialogDescription } from '@/shared/ui/dialog';
import { Fragment, useEffect, useState, useCallback } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/shared/ui/button';
import { PdfContractSkeleton } from '@/widgets/skeletons/pdf-contract-skeleton';
import { PdfContractDocument } from '@/widgets/pdf-contract-content/pdf-contract-document';
import { PdfContractFile } from '@/widgets/pdf-contract-content/pdf-contract-file';
import Modal from '../modal-wrapper';
import { ModalTriggers } from '@/types/model/modals';
import { useAppSelector } from '@/store/hooks';
import { PdfContractModel } from '@/types/services/contracts';
import { useLazyGetContractPdfQuery } from '@/store/contracts';
import { PdfContractAdapter } from '@/shared/utils/pdf-contract/pdf-contract-adapter';

export const PdfContractModal = () => {
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const [fetchTrigger, { isLoading }] = useLazyGetContractPdfQuery();
  const [contractData, setContractData] = useState<PdfContractModel | null>(null);

  const handleOpen = useCallback(async () => {
    if (!payload?.id) return;

    const res = await fetchTrigger(payload?.id as string);

    if (res.data) {
      setContractData(PdfContractAdapter(res.data));
    }
  }, [payload?.id, fetchTrigger]);

  useEffect(() => {
    if (isOpen && trigger === ModalTriggers.PDF_CONTRACT) {
      handleOpen();
    }

    if (!isOpen) {
      setContractData(null);
    }
  }, [isOpen, trigger, handleOpen]);

  return (
    <Modal
      triggers={ModalTriggers.PDF_CONTRACT}
      className="max-w-[800px] w-[100%] py-[3px] px-[2px] text-text"
    >
      <DialogDescription className="sr-only">
        Тут відображається PDF договору та можливість його завантажити.
      </DialogDescription>

      <div
        className="max-w-[800px] max-h-[90vh] overflow-auto p-5
            scrollbar-none
            [&::-webkit-scrollbar]:w-[4px]
            [&::-webkit-scrollbar]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-muted-text
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {isLoading || !contractData ? (
          <PdfContractSkeleton />
        ) : (
          <Fragment>
            <PdfContractDocument data={contractData} />

            <div className="flex justify-center pt-6">
              <Button variant="outline">
                <PDFDownloadLink
                  document={<PdfContractFile data={contractData} />}
                  fileName="contract.pdf"
                >
                  {({ loading }) => (loading ? 'Генерується PDF...' : 'Скачати PDF')}
                </PDFDownloadLink>
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    </Modal>
  );
};
