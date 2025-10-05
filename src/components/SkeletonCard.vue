<script setup lang="ts">
// No props needed; this is a presentational skeleton matching final card structure
</script>

<template>
  <v-card class="full-card">
    <v-skeleton-loader type="image" class="skeleton-image" />

    <v-card-title class="text-wrap">
      <v-skeleton-loader type="text" height="28" width="70%" />
    </v-card-title>
    <v-card-subtitle>
      <v-skeleton-loader type="text" height="18" width="50%" />
    </v-card-subtitle>

    <v-card-text>
      <v-skeleton-loader type="text" width="40%" height="16" class="mb-2" />
      <div class="mt-3 d-flex align-center">
        <v-skeleton-loader class="chip-skeleton mr-2" type="text" />
        <v-skeleton-loader class="btn-skeleton" type="text" />
      </div>
      <div class="mt-4">
        <v-skeleton-loader type="text" width="30%" height="14" class="mb-2" />
        <v-skeleton-loader class="slider-skeleton" type="text" />
        <v-skeleton-loader type="text" width="40%" height="14" class="mt-2" />
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.full-card {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.skeleton-image {
  height: 240px;
  width: 100%;
}
.skeleton-image.v-skeleton-loader { padding: 0; }

:deep(.v-skeleton-loader) {
  display: block;
  width: 100%;
  padding: 0;
}

:deep(.skeleton-image .v-skeleton-loader__bone) {
  width: 100%;
  height: 100%;
  border-radius: 0;
  display: block;
}
</style>
