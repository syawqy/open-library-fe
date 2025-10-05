export type Book = {
  key: string
  title: string
  author_name: string[]
  first_publish_year?: number
  coverUrl?: string
}

export type ReadingListEntry = { progress: number; meta?: Book }
export type ReadingListMap = Record<string, ReadingListEntry>