declare interface ContractPayment {
  id: number;
  contractId: number;
  description: string;
  amount: number;
  date: Date | string;
}

declare interface ContractPaymentCreate
  extends Pick<ContractPayment, "amount" | "description"> {}
