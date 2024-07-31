<template>
    <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
        <h2 class="text-xl font-bold mb-4">Add User</h2>
        <form @submit.prevent="addUser">
            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" v-model="email" required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" v-model="name"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <button type="submit"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add User
            </button>
        </form>
    </div>
</template>

<script setup>
const email = ref('');
const name = ref('');
const emit = defineEmits(['user-added']);
const addUser = async () => {
    try {
        const response = await $fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    email: email.value,
                }
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add user');
        }

        emit('user-added');
        // Reset form fields
        email.value = '';
        name.value = '';
    } catch (error) {
        console.error(error);
    }
};
</script>