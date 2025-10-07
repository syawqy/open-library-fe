<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import SearchPage from './components/SearchPage.vue'
import ReadingListPage from './components/ReadingListPage.vue'
import BookDetailPage from './components/BookDetailPage.vue'

type Book = {
  key: string
  title: string
  author_name: string[]
  first_publish_year?: number
  coverUrl?: string
}

// Navigation
const currentPage = ref<'search' | 'list' | 'detail'>('search')
const selectedBook = ref<Book | null>(null)
const previousPage = ref<'search' | 'list'>('search')

// Search state
const query = ref('')
const loading = ref(false)
const results = ref<Book[]>([])
const error = ref<string | null>(null)

// Reading list state persisted to localStorage
const LIST_KEY = 'openlib-reading-list'
const readingList = ref<Record<string, { progress: number; meta?: Book }>>({})

function saveList() {
  localStorage.setItem(LIST_KEY, JSON.stringify(readingList.value))
}
function loadList() {
  try {
    const raw = localStorage.getItem(LIST_KEY)
    if (raw) readingList.value = JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to parse reading list from localStorage', e)
  }
}

function normalizeSearchDoc(doc: any): Book {
  const coverId = doc.cover_i || (Array.isArray(doc.covers) ? doc.covers[0] : undefined)
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : undefined
  return {
    key: doc.key,
    title: doc.title,
    author_name: doc.author_name || [],
    first_publish_year: doc.first_publish_year,
    coverUrl,
  }
}

async function fetchBooks() {
  if (!query.value.trim()) {
    results.value = []
    return
  }
  loading.value = true
  error.value = null
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query.value)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    results.value = (data.docs || []).map((doc: any) => normalizeSearchDoc(doc))
  } catch (e: any) {
    error.value = e?.message || 'Failed to fetch'
  } finally {
    loading.value = false
  }
}

async function hydrateListMetadata() {
  const keysToHydrate = Object.entries(readingList.value)
    .filter(([_, val]) => !val.meta)
    .map(([key]) => key)

  for (const key of keysToHydrate) {
    try {
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(key)}`
      const res = await fetch(url)
      if (!res.ok) continue
      const data = await res.json()
      const docs: any[] = data.docs || []
      const doc = docs.find((d: any) => d.key === key) || docs[0]
      if (doc) {
        const book = normalizeSearchDoc(doc)
        const existing = readingList.value[key]
        const progress = existing?.progress ?? 0
        readingList.value[key] = { progress, meta: book }
      }
    } catch (e) {
      // ignore hydration errors per item
    }
  }
  saveList()
}

onMounted(() => {
  loadList()
  fetchBooks()
  hydrateListMetadata()
})

watch(currentPage, (p) => {
  if (p === 'list') hydrateListMetadata()
})

function setProgress(bookKey: string, progress: number) {
  const existing = readingList.value[bookKey]
  if (existing) {
    existing.progress = progress
  } else {
    readingList.value[bookKey] = { progress }
  }
  saveList()
}

function getProgress(bookKey: string) {
  return readingList.value[bookKey]?.progress ?? 0
}

function addToList(book: Book) {
  const prev = readingList.value[book.key]?.progress ?? 0
  readingList.value[book.key] = { progress: prev, meta: book }
  saveList()
}

function removeFromList(bookKey: string) {
  if (readingList.value[bookKey]) {
    delete readingList.value[bookKey]
    saveList()
  }
}

const filteredResults = computed(() => results.value)

const readingListCards = computed(() => {
  return Object.entries(readingList.value).map(([key, val]) => ({
    key,
    title: val.meta?.title ?? key,
    author_name: val.meta?.author_name ?? [],
    first_publish_year: val.meta?.first_publish_year,
    coverUrl: val.meta?.coverUrl,
  })) as Book[] & { key: string }[]
})
function openDetailsFromSearch(book: Book) {
  selectedBook.value = book
  previousPage.value = 'search'
  currentPage.value = 'detail'
}
function openDetailsFromList(book: Book) {
  selectedBook.value = book
  previousPage.value = 'list'
  currentPage.value = 'detail'
}
function closeDetails() {
  currentPage.value = previousPage.value
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-toolbar-title>Open Library</v-toolbar-title>
      <v-spacer />
      <v-btn variant="text" :active="currentPage === 'search'" @click="currentPage = 'search'">
        Search
      </v-btn>
      <v-btn variant="text" :active="currentPage === 'list'" @click="currentPage = 'list'">
        Reading List
      </v-btn>
    </v-app-bar>

    <v-main>
      <SearchPage
        v-if="currentPage === 'search'"
        :query="query"
        :loading="loading"
        :error="error"
        :results="filteredResults"
        :readingList="readingList"
        @update:query="(v: string) => (query = v)"
        @search="fetchBooks"
        @addToList="addToList"
        @removeFromList="removeFromList"
        @updateProgress="setProgress"
        @openDetails="openDetailsFromSearch"
      />

      <ReadingListPage
        v-else-if="currentPage === 'list'"
        :cards="readingListCards"
        :readingList="readingList"
        @removeFromList="removeFromList"
        @updateProgress="setProgress"
        @openDetails="openDetailsFromList"
      />

      <BookDetailPage
        v-else-if="currentPage === 'detail' && selectedBook"
        :book="selectedBook"
        :in-list="!!readingList[selectedBook.key]"
        :progress="getProgress(selectedBook.key)"
        @addToList="addToList"
        @removeFromList="removeFromList"
        @updateProgress="setProgress"
        @close="closeDetails"
      />
    </v-main>
  </v-app>
</template>

<style scoped>
.text-wrap {
  white-space: normal;
}
.search-input {
  width: 100%;
}
/* Removed obsolete skeleton styles since SkeletonCard handles its own styling */
</style>
