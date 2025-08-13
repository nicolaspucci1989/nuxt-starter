import PaymentService from "~/server/services/PaymentService";

export default defineEventHandler(async (event) => {
  const { payment } = await readBody(event);
  const contractId = getRouterParam(event, "contractId");

  if (!payment || !contractId) {
    return { error: "Invalid request data" };
  }

  await PaymentService.create(payment, Number(contractId));

  return { ok: true };
});
