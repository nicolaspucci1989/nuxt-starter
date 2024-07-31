<template>
    <div>
        <Button label="Check" icon="pi pi-check" @click="nose" />
        <InputText type="text" v-model="value" />

    </div>
</template>

<script setup>

const value = ref()

const nose = async () => {
    const post = {
        title: 'Hello',
        content: 'World',
    }
    const res = await $fetch('/api/posts', {
        method: 'post',
        body: post
    })
    console.log(res)
}

</script>

<style lang="scss" scoped></style>