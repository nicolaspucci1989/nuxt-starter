<script setup lang="ts">
defineProps({
    contractId: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div>
        Contract Payments {{ contractId }}
    </div>
</template>