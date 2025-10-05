<script setup lang="ts">
import BookCard from './BookCard.vue'
import type { Book, ReadingListMap } from '../types'

const props = defineProps<{ 
  cards: Book[]
  readingList: ReadingListMap
}>()

const emit = defineEmits<{
  (e: 'removeFromList', key: string): void
  (e: 'updateProgress', key: string, value: number): void
}>()
</script>

<template>
  <v-container class="py-6" max-width="1000">
    <v-row>
      <v-col cols="12">
        <h2 class="mb-4">Your Reading List</h2>
      </v-col>
    </v-row>
    <v-row v-if="props.cards.length">
      <v-col v-for="book in props.cards" :key="book.key" cols="12" sm="6" md="4">
        <BookCard
          :book="book"
          :in-list="true"
          :progress="props.readingList[book.key]?.progress ?? 0"
          mode="list"
          @remove="(key) => emit('removeFromList', key)"
          @updateProgress="(key, val) => emit('updateProgress', key, val)"
        />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-alert type="info">Your reading list is empty. Go to Search to add books.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>