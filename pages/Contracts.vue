<script setup lang="ts">
import { format, parseISO } from 'date-fns';
import { useFetch } from 'nuxt/app';
import { ref } from 'vue';

const showDialog = ref(false);
const search = ref('');
const rowsAmount = ref(5);
const filter = ref({})

const { data, error, refresh: fetchContracts, status } = await useFetch('/api/contract', {
  query: {
    page: 2,
    search: search.value,
    pageSize: rowsAmount.value,
  }
});

if (error.value) {
  console.error('Failed to fetch contracts:', error.value);
}
const onCreated = () => {
  showDialog.value = false;
  fetchContracts();
};

const onReload = (data: { page: number }) => {
  console.log('Reloading contracts...', data);
};
</script>

<template>
  <div class="flex flex-col items-center justify-start min-h-screen p-8 space-y-4">
    <h1 class="text-2xl font-bold mb-4">Contratos</h1>
    <div class="flex justify-between items-center w-full max-w-4xl mb-4">
      <InputText v-model="search" placeholder="Buscar" />
      <Button @click="showDialog = true" label="Agregar Nuevo Contrato" />
    </div>
    <div class="w-full max-w-4xl mt-8">
      <DataTable :loading="status == 'pending'" :value="data?.contracts" :first="(data?.page - 1) * data?.pageSize"
        @page="onReload" paginator lazy :total-records="data?.total" :rows="rowsAmount"
        :rows-per-page-options="[5, 25, 50, 75, 100]" class="w-full">
        <Column field="title" header="Titulo"></Column>
        <Column field="startDate" header="Inicio">
          <template #body="slotProps">
            {{ format(parseISO(slotProps.data.startDate), 'dd/MM/yyyy') }}
          </template>
        </Column>
        <Column field="endDate" header="Fin">
          <template #body="slotProps">
            {{ format(parseISO(slotProps.data.endDate), 'dd/MM/yyyy') }}
          </template>
        </Column>
        <Column field="createdAt" header="Creación">
          <template #body="slotProps">
            {{ format(parseISO(slotProps.data.createdAt), 'dd/MM/yyyy') }}
          </template>
        </Column>
        <template #empty>
          <div class="text-center text-gray-500">
            No hay contratos disponibles.
          </div>
        </template>
      </DataTable>
    </div>
    <Dialog header="Add User" v-model:visible="showDialog" modal>
      <AddContractForm @created="onCreated" />
    </Dialog>
  </div>
</template>


<style lang="scss" scoped></style>