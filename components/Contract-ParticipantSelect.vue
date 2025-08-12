<script setup>
import { useFetch } from 'nuxt/app';


const model = defineModel();
const { data, status, execute } = await useFetch('/api/users');

const optionLabel = (option) => [option.email, option.name].filter(Boolean).join(' - ');

const showAddNewDialog = ref(false);
const newParticipantName = ref('');
const newParticipantEmail = ref('');
const creating = ref(false);

const addNewParticipant = async () => {
    if (!newParticipantName.value || !newParticipantEmail.value) {
        return;
    }
    try {
        creating.value = true;
        await $fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                user: {
                    name: newParticipantName.value,
                    email: newParticipantEmail.value,
                }
            },
        });
        showAddNewDialog.value = false;
        newParticipantName.value = '';
        newParticipantEmail.value = '';
        await execute();
        creating.value = false;
    } catch (error) {
        console.error('Error adding participant:', error);
    }
};
</script>

<template>
    <div>
        <MultiSelect v-model="model" display="chip" :loading="status == 'pending'" :options="data"
            :option-label="optionLabel" option-value="id" multiple filter class="w-full" v-bind="$attrs">
            <template #footer>
                <div class="p-3 flex justify-between">
                    <Button @click="showAddNewDialog = true" label="Add New" severity="secondary" text size="small"
                        icon="pi pi-plus" />
                </div>
            </template>
        </MultiSelect>
        <Dialog v-model:visible="showAddNewDialog">
            <div class="p-4">
                <h3 class="text-lg font-semibold mb-4">Crear nuevo usuario</h3>
                <div>
                    <InputText v-model="newParticipantName" placeholder="Nombre" class="mb-4" />
                </div>
                <div>
                    <InputText v-model="newParticipantEmail" placeholder="Email" class="mb-4" />
                </div>
                <Button label="Crear" @click="addNewParticipant" :loading="creating" />
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
:deep(.p-multiselect-label) {
    flex-wrap: wrap;
}
</style>