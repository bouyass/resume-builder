<template>
  <div style="padding: 16px; background: #e0f7fa; border-bottom: 2px solid #00838f;">
    <h1 style="margin: 0;">{{ name }}</h1>
    <h2 style="margin: 0; font-weight: normal;">{{ title }}</h2>
  </div>
</template>

<script setup>
defineProps(['name', 'title'])
</script>