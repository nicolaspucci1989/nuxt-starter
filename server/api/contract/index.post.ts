import ContractService from "./ContractService";

export default defineEventHandler(async (event) => {
  try {
    const { contract } = await readBody(event);

    await ContractService.create(contract);

    return { ok: true };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create new contract" };
  }
});
