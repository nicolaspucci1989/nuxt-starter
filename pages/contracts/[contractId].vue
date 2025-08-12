<script setup lang="ts">
import { useFetch, useRoute } from 'nuxt/app';

const $route = useRoute();

const { data } = await useFetch(`/api/contract/${$route.params.contractId}`, {
    default: () => ({})
});
</script>

<template>
    <div>
        <Tabs value="general">
            <TabList>
                <Tab value="general">General</Tab>
                <Tab value="payments">Pagos</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="general">
                    <Contract-CreateEditForm :contract="data" />
                </TabPanel>
                <TabPanel value="payments">
                    <Contract-Payments :contract-id="$route.params.contractId" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>