import { ConfirmDeleteModal } from './confirm-delete-modal';
import { ContractCreateUpdateModal } from './contract-create-update-modal';
import { ContractModal } from './contract-modal';
import { HouseCreateUpdateModal } from './house-create-update-modal';
import { PdfContractModal } from './pdf-contract-modal';
import { RenterCreateUpdateModal } from './renter-create-update-modal';

export const ModalRoot = () => {
  return (
    <>
      <ConfirmDeleteModal />
      <HouseCreateUpdateModal />
      <RenterCreateUpdateModal />
      <ContractCreateUpdateModal />
      <PdfContractModal />
      <ContractModal />
    </>
  );
};
