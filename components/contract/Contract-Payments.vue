<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFetch, useRoute, useRouter } from 'nuxt/app';
import { format, parseISO } from 'date-fns';
import { DataTablePageEvent } from 'primevue/datatable';

const $props = defineProps({
    contractId: {
        type: String,
        required: true,
    },
})

const route = useRoute();
const router = useRouter();

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

const { data, status } = await useFetch(`/api/contract/${$props.contractId}/payments`, {
    query: {
        page,
        search,
        pageSize,
    }
});


const onReload = (data: DataTablePageEvent) => {
    pageSize.value = data.rows;
    page.value = data.page + 1;
};

const newPayment = ref({
    amount: 0,
    description: '',
});

const showNewPaymentDialog = ref(false);
const loading = ref({
    newPayment: false,
});
const addNewPayment = async () => {
    if (!newPayment.value.amount || !newPayment.value.description) {
        return;
    }
    loading.value.newPayment = true;
    await $fetch(`/api/contract/${$props.contractId}/payments`, {
        method: 'POST',
        body: { payment: newPayment.value }
    });
    showNewPaymentDialog.value = false;
    newPayment.value = { amount: 0, description: '' };
    loading.value.newPayment = false;
}
</script>

<template>
    <div class="flex flex-col items-center justify-start min-h-screen p-8 space-y-4">
        <h1 class="text-2xl font-bold mb-4">Pagos</h1>
        <div class="flex justify-between items-center w-full max-w-4xl mb-4">
            <IconField>
                <InputText v-model="preSearch" @blur="search = preSearch" @keydown.enter="search = preSearch"
                    placeholder="Buscar" />
                <InputIcon class="pi pi-search cursor-pointer" @click="search = preSearch" />
            </IconField>
            <Button @click="showNewPaymentDialog = true" label="Agregar Nuevo Pago" />
        </div>

        <div class="w-full max-w-4xl mt-8">
            <DataTable class="w-full" :loading="status == 'pending'" :value="data?.payments"
                :first="(data?.page - 1) * data?.pageSize" @page="onReload" paginator lazy :total-records="data?.total"
                :rows="pageSize" :rows-per-page-options="[5, 10, 25, 50, 75, 100]">
                <Column field="description" header="Descripción"></Column>
                <Column field="createdAt" header="Fecha">
                    <template #body="slotProps">
                        {{ format(parseISO(slotProps.data.createdAt), 'dd/MM/yyyy') }}
                    </template>
                </Column>
                <Column field="amount" header="monto"></Column>
                <template #empty>
                    <div class="text-center text-gray-500">
                        No hay contratos disponibles.
                    </div>
                </template>
            </DataTable>
        </div>

        <Dialog v-model:visible="showNewPaymentDialog" modal>
            <div>
                <h3 class="text-lg font-semibold mb-4">Nuevo Pago</h3>
                <div class="flex flex-col gap-3">
                    <InputNumber v-model="newPayment.amount" placeholder="Monto" />
                    <InputText v-model="newPayment.description" placeholder="Descripción" />
                    <Button label="Crear" @click="addNewPayment" :loading="loading.newPayment" />
                </div>
            </div>
        </Dialog>
    </div>
</template>