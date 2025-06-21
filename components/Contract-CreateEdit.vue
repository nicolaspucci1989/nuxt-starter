<script setup>
import { isBefore } from 'date-fns';
const $props = defineProps({
    contract: {
        type: Object,
        default: () => ({}),
    },
});
const id = $props.contract.id || null;
const title = ref('');
const description = ref('');
const start = ref(null);
const end = ref(null);
const emit = defineEmits(['created']);

if (JSON.stringify($props.contract) !== '{}') {
    title.value = $props.contract.title || '';
    description.value = $props.contract.description || '';
    start.value = $props.contract.startDate ? new Date($props.contract.startDate) : null;
    end.value = $props.contract.endDate ? new Date($props.contract.endDate) : null;
}

const createContract = async () => {
    try {
        if (!isBefore(start.value, end.value)) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin.');
        }
        const response = await $fetch('/api/contract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contract: {
                    title: title.value,
                    description: description.value,
                    startDate: start.value,
                    endDate: end.value,
                }
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add user');
        }

        emit('created');
        title.value = '';
        description.value = '';
    } catch (error) {
        console.error(error);
    }
};
</script>

<template>
    <div class="max-w-md mx-auto p-4 shadow-md rounded">
        <h2 class="text-xl font-bold mb-4">Nuevo Contrato</h2>
        <form @submit.prevent="createContract">
            <div>
                <InputText class="mb-4" type="text" v-model="title" placeholder="Titulo" />
            </div>
            <div>
                <InputText class="mb-4" type="text" v-model="description" placeholder="Descripción" />
            </div>
            <div>
                <DatePicker class="mb-4" v-model="start" fluid placeholder="Inicio" />
            </div>
            <div>
                <DatePicker class="mb-4" v-model="end" fluid placeholder="Fin" />
            </div>
            <div class="flex justify-end">
                <Button label="Crear Contrato" type="submit" />
            </div>
        </form>
    </div>
</template>
