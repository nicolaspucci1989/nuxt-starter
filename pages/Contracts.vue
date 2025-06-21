<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFetch, useRoute, useRouter } from 'nuxt/app';
import { format, parseISO } from 'date-fns';
import { DataTablePageEvent } from 'primevue/datatable';

const route = useRoute();
const router = useRouter();
const showDialog = ref(false);
const selectedContract = ref(null);

const pageSize = ref(Number(route.query.pageSize) || 10);
const page = ref(Number(route.query.page) || 1);
const preSearch = ref('')
const search = ref('');
search.value = Array.isArray(route.query.search)
  ? route.query.search[0] || ''
  : route.query.search || '';
preSearch.value = search.value;

watch([search, page, pageSize], updateRouteParams)
function updateRouteParams() {
  router.replace({
    query: {
      ...route.query,
      search: search.value,
      pageSize: pageSize.value,
      page: page.value,
    },
  });
}

const { data, error, refresh: fetchContracts, status } = await useFetch('/api/contract', {
  query: {
    page,
    search,
    pageSize,
  }
});

if (error.value) {
  console.error('Failed to fetch contracts:', error.value);
}

const onCreated = () => {
  showDialog.value = false;
  fetchContracts();
};

const onReload = (data: DataTablePageEvent) => {
  pageSize.value = data.rows;
  page.value = data.page + 1;
};
</script>

<template>
  <div class="flex flex-col items-center justify-start min-h-screen p-8 space-y-4">
    <h1 class="text-2xl font-bold mb-4">Contratos</h1>
    <div class="flex justify-between items-center w-full max-w-4xl mb-4">
      <IconField>
        <InputText v-model="preSearch" @blur="search = preSearch" @keydown.enter="search = preSearch"
        placeholder="Buscar" />
        <InputIcon class="pi pi-search cursor-pointer" @click="search = preSearch"/>
      </IconField>
      <Button @click="showDialog = true" label="Agregar Nuevo Contrato" />
    </div>

    <div class="w-full max-w-4xl mt-8">
      <DataTable class="w-full" :loading="status == 'pending'" :value="data?.contracts"
        :first="(data?.page - 1) * data?.pageSize" @page="onReload" paginator lazy :total-records="data?.total"
        :rows="pageSize" :rows-per-page-options="[5, 10, 25, 50, 75, 100]">
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
        <Column>
          <template #body="slotProps">
            <Button icon="pi pi-pencil" size="small" text @click="selectedContract = slotProps.data" />
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