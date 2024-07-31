<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-2xl font-bold mb-4">Users Page</h1>
        <div class="flex items-center justify-center mb-4 space-x-4">
            <input v-model="emailFilter" type="text" placeholder="Filter by email" class="mb-4 p-2 border rounded-md" />
            <button @click="showDialog = true"
                class="mb-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add New User
            </button>
        </div>
        <div class="w-full max-w-4xl mt-8">
            <DataTable :value="data" class="w-full">
                <Column field="id" header="ID"></Column>
                <Column field="name" header="Name"></Column>
                <Column field="email" header="Email"></Column>
            </DataTable>
        </div>
        <Dialog header="Add User" v-model:visible="showDialog" modal>
            <AddUserForm @user-added="onUserAdded" />
        </Dialog>
    </div>
</template>

<script setup>
const showDialog = ref(false);
const emailFilter = ref('');
const { data, error, refresh } = await useFetch('/api/user');

const onUserAdded = () => {
    showDialog.value = false;
    refresh();
};

if (error.value) {
    console.error('Failed to fetch users:', error.value);
}
</script>

<style lang="scss" scoped></style>