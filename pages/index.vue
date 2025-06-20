<template>
  <div class="flex flex-col items-center justify-center min-h-screen space-y-4">
    <h1 class="text-2xl font-bold">Home</h1>
    <div class="flex space-x-4">
      <NuxtLink to="/contracts" class="px-4 text-blue-500 underline">
        Go to Contracts Page
      </NuxtLink>
      <NuxtLink to="/posts" class="px-4 text-blue-500 underline">
        Go to Posts Page
      </NuxtLink>
    </div>
  </div>
</template>
<script setup></script>