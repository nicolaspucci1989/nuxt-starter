<script setup>
import { isBefore } from 'date-fns';
import InputNumber from 'primevue/inputnumber';
import { watchEffect } from 'vue';

const $props = defineProps({
    contract: {
        type: Object,
        default: () => ({}),
    },
});
const { handleFileInput, files } = useFileStorage({ clearOldFiles: false })
const title = ref('');
const description = ref('');
const start = ref(null);
const end = ref(null);
const emit = defineEmits(['created']);
const tenants = ref([]);
const owners = ref([]);
const loading = ref({})
const $router = useRouter();
const duration = ref();

if (JSON.stringify($props.contract) !== '{}') {
    title.value = $props.contract.title || '';
    description.value = $props.contract.description || '';
    start.value = $props.contract.startDate ? new Date($props.contract.startDate) : null;
    end.value = $props.contract.endDate ? new Date($props.contract.endDate) : null;
    tenants.value = $props.contract.contractRoles?.filter(role => role.role === 'tenant')?.map(role => role.user.id) || [];
    owners.value = $props.contract.contractRoles?.filter(role => role.role === 'owner')?.map(role => role.user.id) || [];
    files.value = $props.contract.media || [];
}

const createContract = async () => {
    try {
        if (!isBefore(start.value, end.value)) {
            throw new Error('La fecha de inicio debe ser anterior a la fecha de fin.');
        }
        const contractRoles = []
        if (tenants.value?.length) {
            contractRoles.push(...tenants.value.map(tenantId => ({ role: 'tenant', userId: tenantId })));
        }
        if (owners.value?.length) {
            contractRoles.push(...owners.value.map(ownerId => ({ role: 'owner', userId: ownerId })));
        }
        const contract = {
            title: title.value,
            description: description.value,
            startDate: start.value,
            endDate: end.value,
            media: files.value,
            contractRoles
        }
        if ($props.contract.id) {
            await $fetch(`/api/contract/${$props.contract.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contract }),
            });

            emit('created');
        } else {
            await $fetch('/api/contract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contract }),
            });
        }

        emit('created');
        $router.push({ name: 'contracts' });
    } catch (error) {
        console.error(error);
    }
};

const triggerInput = () => {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.click();
    }
};

const onFilInputChange = async (event) => {
    const fileList = event.target.files
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        file.isNew = true;
    }
    await handleFileInput(event);
}

const removeImage = (idx) => {
    const file = files.value[idx]
    if (file.isNew) {
        files.value.splice(idx, 1);
    } else {
        files.value[idx].toDelete = true;
    }
};

const deleteContract = async () => {
    if (!$props.contract.id) {
        return;
    }
    loading.value.delete = true;
    try {
        await $fetch(`/api/contract/${$props.contract.id}`, {
            method: 'DELETE',
        });
        emit('created');
        loading.value.delete = false;
        $router.push({ name: 'contracts' });
    } catch (error) {
        console.error('Error deleting contract:', error);
        loading.value.delete = false;
    }

};

watchEffect(() => {
    if (start.value && end.value) {
        const startDate = new Date(start.value);
        const endDate = new Date(end.value);
        duration.value = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 365)); // Calculate duration in years
    } else {
        duration.value = null;
    }
});
const onBlur = () => {
    console.log('onBlur ' + Date.now());
}
</script>

<template>
    <div>
        <div class="min-h-screen mb-12 mt-8 px-8 shadow-md rounded">
            <h2 class="text-xl font-bold mb-4">Nuevo Contrato</h2>
            <form>
                <div>
                    <div class="flex flex-col md:flex-row mb-4 gap-2">
                        <div class="md:w-1/2">
                            <div>Nombre</div>
                            <InputText class="w-full" type="text" v-model="title" placeholder="Titulo" />
                        </div>
                        <div class="md:w-1/2">
                            <div>Descripcion</div>
                            <InputText class="w-full" type="text" v-model="description" placeholder="Descripción" />
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row mb-4 gap-2">
                        <div class="mb-4 md:w-1/3">
                            <div>Inicio</div>
                            <DatePicker :show-on-focus="false" show-icon @value-change="onBlur" v-model="start" fluid
                                input-id="start_date" />
                        </div>
                        <div class="mb-4 md:w-1/3">
                            <div>Fin</div>
                            <DatePicker :show-on-focus="false" show-icon v-model="end" fluid input-i d="end_date" />
                        </div>
                        <div class="mb-4 md:w-1/3">
                            <div>Duración (años)</div>
                            <InputNumber class="w-full" v-model="duration" />
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row mb-4 gap-4">
                        <div class="w-full md:w-1/2">
                            <div>Inquilinos</div>
                            <Contract-ParticipantSelect v-model="tenants" />
                        </div>
                        <div class="w-full md:w-1/2">
                            <div>Propietarios</div>
                            <Contract-ParticipantSelect v-model="owners" />
                        </div>
                    </div>
                    <div>
                        <Button @click="triggerInput" label="Agregar imagenes" />
                        <input type="file" accept="image/*" multiple @input="onFilInputChange" class="hidden"
                            ref="fileInput" />
                    </div>
                    <div class="flex flex-wrap gap-2 p-4">
                        <div v-for="(file, n) in files" :key="file.id">
                            <div v-if="!file.toDelete" class="relative w-[230px] image-wrapper">
                                <Button class="!absolute top-2 right-2 __button" icon="pi pi-times"
                                    @click="removeImage(n)" rounded severity="danger" />
                                <Image class="object-cover mb-2" :src="file.fullPath || file.content" />
                            </div>
                        </div>
                    </div>
                    <!-- <pre>{{ files }}</pre> -->
                </div>
            </form>
        </div>
        <div class="sticky mr-4 bottom-5">
            <div class=" flex justify-end gap-2">
                <Button v-if="$props.contract.id" :loading="loading.delete" label="Eliminar" @click="deleteContract"
                    severity="danger" />
                <Button :label="`${$props.contract.id ? 'Editar' : 'Crear'} Contrato`" @click="createContract" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.image-wrapper {
    .__button {
        display: none;
    }

    &:hover {
        .__button {
            display: block;
        }
    }
}

</style>