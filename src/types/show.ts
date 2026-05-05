/**
 * TypeScript interfaces for TVMaze API data structures
 * @see https://www.tvmaze.com/api
 */

/** Country information (internal) */
interface Country {
  name: string
  code: string
  timezone: string
}

/** Network information (e.g., CBS, NBC) (internal) */
interface Network {
  id: number
  name: string
  country: Country | null
  officialSite: string | null
}

/** Web channel information (e.g., Netflix, Hulu) (internal) */
interface WebChannel {
  id: number
  name: string
  country: Country | null
  officialSite: string | null
}

/** Show schedule (internal) */
interface Schedule {
  time: string
  days: string[]
}

/** Show rating (internal) */
interface Rating {
  average: number | null
}

/** Image URLs (internal) */
interface ShowImage {
  medium: string
  original: string
}

/** External IDs for other databases (internal) */
interface Externals {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

/** API link structure (internal) */
interface ApiLink {
  href: string
  name?: string
}

/** Links in show response (internal) */
interface ShowLinks {
  self: ApiLink
  previousepisode?: ApiLink
  nextepisode?: ApiLink
}

/** Main Show interface */
export interface Show {
  id: number
  url: string
  name: string
  type: string
  language: string | null
  genres: string[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: Schedule
  rating: Rating
  weight: number
  network: Network | null
  webChannel: WebChannel | null
  dvdCountry: Country | null
  externals: Externals
  image: ShowImage | null
  summary: string | null
  updated: number
  _links: ShowLinks
}

/** Search result wrapper */
export interface SearchResult {
  score: number
  show: Show
}

/** Genre with associated shows */
export interface GenreGroup {
  name: string
  shows: Show[]
}
