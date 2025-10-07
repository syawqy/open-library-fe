<script setup lang="ts">
import type { Book } from '../types'

const props = defineProps<{
  book: Book
  inList: boolean
  progress: number
  mode: 'search' | 'list'
}>()

const emit = defineEmits<{
  (e: 'add', book: Book): void
  (e: 'remove', key: string): void
  (e: 'updateProgress', key: string, value: number): void
  (e: 'details', book: Book): void
}>()

function onAdd() {
  emit('add', props.book)
}
function onRemove() {
  emit('remove', props.book.key)
}
function onProgress(value: number) {
  emit('updateProgress', props.book.key, value)
}
function onDetails() {
  emit('details', props.book)
}
</script>

<template>
  <v-card>
    <v-img :src="props.book.coverUrl" height="240" cover>
      <template #placeholder>
        <div class="d-flex h-100 align-center justify-center bg-grey-lighten-2">
          <v-icon size="64">mdi-book</v-icon>
        </div>
      </template>
    </v-img>
    <v-card-title class="text-wrap title-truncate">{{ props.book.title }}</v-card-title>
    <v-card-subtitle class="subtitle-truncate">
      <span v-if="props.book.author_name && props.book.author_name.length">{{ props.book.author_name.join(', ') }}</span>
      <span v-else>Unknown author</span>
    </v-card-subtitle>

    <v-card-text>
      <div class="text-caption caption-row">First published: {{ props.book.first_publish_year || 'N/A' }}</div>

      <!-- Actions for search page -->
      <template v-if="props.mode === 'search'">
        <div class="mt-3 actions-row d-flex align-center">
          <v-chip class="mr-2" :color="props.inList ? 'primary' : 'grey'" variant="flat">
            {{ props.inList ? 'In Reading List' : 'Not Saved' }}
          </v-chip>
          <v-btn class="mr-2" :color="props.inList ? 'secondary' : 'primary'" @click="props.inList ? onRemove() : onAdd()">
            {{ props.inList ? 'Remove' : 'Add' }}
          </v-btn>
          <v-btn variant="text" @click="onDetails">Details</v-btn>
        </div>
        <!-- Always reserve smaller space for progress to keep height constant -->
        <div class="mt-2 progress-block">
          <template v-if="props.inList">
            <div class="text-caption progress-label">Reading progress</div>
            <v-slider
              :model-value="props.progress"
              :step="1"
              :min="0"
              :max="100"
              color="primary"
              @update:modelValue="onProgress($event)"
            />
            <div class="text-caption progress-percent">{{ props.progress }}% complete</div>
          </template>
        </div>
      </template>

      <!-- Actions for reading list page -->
      <template v-else>
        <div class="mt-3 actions-row d-flex align-center">
          <v-btn class="mr-2" color="secondary" @click="onRemove">Remove</v-btn>
          <v-btn variant="text" @click="onDetails">Details</v-btn>
        </div>
        <div class="mt-2 progress-block">
          <div class="text-caption progress-label">Reading progress</div>
          <v-slider
            :model-value="props.progress"
            :step="1"
            :min="0"
            :max="100"
            color="primary"
            @update:modelValue="onProgress($event)"
          />
          <div class="text-caption progress-percent">{{ props.progress }}% complete</div>
        </div>
      </template>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-wrap { white-space: normal; }
/* Prevent title from altering card height: single line clamp with ellipsis */
.title-truncate { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; min-height: 32px; }
/* Keep author line to a single line */
.subtitle-truncate { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; min-height: 20px; }
/* Reserve a fixed height for caption row */
.caption-row { min-height: 20px; }
/* Ensure actions section has a consistent height (chip/button alignment) */
.actions-row { min-height: 56px; }
/* Reserve smaller, fixed space for progress block so presence/absence doesn't change card height */
.progress-block { height: 72px; display: flex; flex-direction: column; justify-content: center; }
/* Tighten progress spacing to fit the compact block */
.progress-label { margin-bottom: 4px; }
.progress-percent { margin-top: 4px; }
</style>