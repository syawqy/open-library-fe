<script setup lang="ts">
import { computed } from 'vue'
import SkeletonCard from './SkeletonCard.vue'
import BookCard from './BookCard.vue'
import type { Book, ReadingListMap } from '../types'

const props = defineProps<{ 
  query: string
  loading: boolean
  error: string | null
  results: Book[]
  readingList: ReadingListMap
}>()

const emit = defineEmits<{
  (e: 'update:query', value: string): void
  (e: 'search'): void
  (e: 'addToList', book: Book): void
  (e: 'removeFromList', key: string): void
  (e: 'updateProgress', key: string, value: number): void
}>()

const filteredResults = computed(() => props.results)
</script>

<template>
  <v-container class="py-6" max-width="1000">
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col cols="12" md="8">
        <v-text-field
          :model-value="props.query"
          label="Search books on Open Library"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="search-input"
          @update:modelValue="(v: string) => emit('update:query', v)"
          @keyup.enter="emit('search')"
        />
      </v-col>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn color="primary" class="ml-md-3" :loading="props.loading" @click="emit('search')">
          Search
        </v-btn>
      </v-col>
    </v-row>

    <v-alert v-if="props.error" type="error" class="mb-4">{{ props.error }}</v-alert>

    <!-- Skeletons: one full row -->
    <v-row v-if="props.loading" class="mb-4">
      <v-col v-for="n in 3" :key="n" cols="12" sm="6" md="4">
        <SkeletonCard />
      </v-col>
    </v-row>

    <!-- Results grid -->
    <v-row v-if="!props.loading && filteredResults.length">
      <v-col v-for="book in filteredResults" :key="book.key" cols="12" sm="6" md="4">
        <BookCard
          :book="book"
          :in-list="!!props.readingList[book.key]"
          :progress="props.readingList[book.key]?.progress ?? 0"
          mode="search"
          @add="(b) => emit('addToList', b)"
          @remove="(key) => emit('removeFromList', key)"
          @updateProgress="(key, val) => emit('updateProgress', key, val)"
        />
      </v-col>
    </v-row>

    <!-- No data: show nothing (no cards) -->
    <v-row v-if="!props.loading && !filteredResults.length"></v-row>
  </v-container>
</template>

<style scoped>
.search-input { width: 100%; }
</style>