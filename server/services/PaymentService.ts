import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PaymentService = {
  async create(payment: ContractPaymentCreate, contractId: number) {
    await prisma.contractPayment.create({
      data: {
        ...payment,
        contractId: contractId,
      },
    });
  },
};

export default PaymentService;
