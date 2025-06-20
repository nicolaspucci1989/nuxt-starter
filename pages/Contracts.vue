<script setup>
const showDialog = ref(false);
const search = ref('');
const { data: contracts, error, refresh: fetchContracts } = await useFetch('/api/contract');

if (error.value) {
  console.error('Failed to fetch contracts:', error.value);
}
</script>

<template>
  <div class="flex flex-col items-center justify-start min-h-screen p-8 space-y-4">
    <h1 class="text-2xl font-bold mb-4">Contratos</h1>
    <div class="flex justify-between items-center w-full max-w-4xl mb-4">
      <InputText v-model="search" placeholder="Buscar" />
      <Button @click="showDialog = true" label="Agregar Nuevo Contrato"/>
    </div>
    <div class="w-full max-w-4xl mt-8">
      <DataTable :value="contracts" class="w-full">
        <Column field="title" header="Titulo"></Column>
        <Column field="startDate" header="Inicio"></Column>
        <Column field="endDate" header="Fin"></Column>
        <template #empty>
          <div class="text-center text-gray-500">
            No hay contratos disponibles.
          </div>
        </template>
      </DataTable>
    </div>
    <Dialog header="Add User" v-model:visible="showDialog" modal>
      <AddContractForm @created="fetchContracts" />
    </Dialog>
  </div>
</template>


<style lang="scss" scoped></style>