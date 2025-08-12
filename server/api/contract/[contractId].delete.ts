import ContractService from "./ContractService";

export default defineEventHandler(async (event) => {
  try {
    const contractId = getRouterParam(event, "contractId");
    await ContractService.delete(Number(contractId));
    return { ok: true };
  } catch (error) {
    return { error };
  }
});
