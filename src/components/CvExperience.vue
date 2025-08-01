<template>
  <div style="padding: 12px; border-left: 4px solid #00796b; margin: 8px 0;">
    <strong>{{ role }}</strong><br />
    <em>{{ company }}</em>
  </div>
</template>

<script setup>
defineProps(['company', 'role'])
</script>
