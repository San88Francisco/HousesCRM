export const CONTRACT_TERMINATION_ONGOING = 'new' as const;

export type ContractTerminationPayload = Date | string | typeof CONTRACT_TERMINATION_ONGOING | null;
