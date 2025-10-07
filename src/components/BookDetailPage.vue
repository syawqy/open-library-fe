<script setup lang="ts">
import type { Book } from '../types'

const props = defineProps<{
  book: Book
  inList: boolean
  progress: number
}>()

const emit = defineEmits<{
  (e: 'addToList', book: Book): void
  (e: 'removeFromList', key: string): void
  (e: 'updateProgress', key: string, value: number): void
  (e: 'close'): void
}>()

function onAdd() { emit('addToList', props.book) }
function onRemove() { emit('removeFromList', props.book.key) }
function onProgress(v: number) { emit('updateProgress', props.book.key, v) }
function onClose() { emit('close') }
</script>

<template>
  <v-container class="py-6" max-width="900">
    <v-btn class="mb-4" variant="text" prepend-icon="mdi-arrow-left" @click="onClose">Back</v-btn>
    <v-card>
      <v-row no-gutters>
        <v-col cols="12" md="5">
          <v-img :src="props.book.coverUrl" height="320" cover>
            <template #placeholder>
              <div class="d-flex h-100 align-center justify-center bg-grey-lighten-2">
                <v-icon size="64">mdi-book</v-icon>
              </div>
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" md="7">
          <v-card-title class="text-wrap">{{ props.book.title }}</v-card-title>
          <v-card-subtitle>
            <span v-if="props.book.author_name && props.book.author_name.length">{{ props.book.author_name.join(', ') }}</span>
            <span v-else>Unknown author</span>
          </v-card-subtitle>
          <v-card-text>
            <div class="mb-3">
              <div class="text-caption">First published: {{ props.book.first_publish_year || 'N/A' }}</div>
            </div>

            <div class="d-flex align-center mb-3">
              <v-chip class="mr-2" :color="props.inList ? 'primary' : 'grey'" variant="flat">
                {{ props.inList ? 'In Reading List' : 'Not Saved' }}
              </v-chip>
              <v-btn class="mr-2" :color="props.inList ? 'secondary' : 'primary'" @click="props.inList ? onRemove() : onAdd()">
                {{ props.inList ? 'Remove' : 'Add' }}
              </v-btn>
            </div>

            <div class="progress-block">
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
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped>
.text-wrap { white-space: normal; }
.progress-block { margin-top: 8px; }
.progress-label { margin-bottom: 4px; }
.progress-percent { margin-top: 4px; }
</style>