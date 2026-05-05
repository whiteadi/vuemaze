/**
 * TypeScript interfaces for TVMaze API data structures
 * @see https://www.tvmaze.com/api
 */

/** Country information */
export interface Country {
  name: string
  code: string
  timezone: string
}

/** Network information (e.g., CBS, NBC) */
export interface Network {
  id: number
  name: string
  country: Country | null
  officialSite: string | null
}

/** Web channel information (e.g., Netflix, Hulu) */
export interface WebChannel {
  id: number
  name: string
  country: Country | null
  officialSite: string | null
}

/** Show schedule */
export interface Schedule {
  time: string
  days: string[]
}

/** Show rating */
export interface Rating {
  average: number | null
}

/** Image URLs */
export interface ShowImage {
  medium: string
  original: string
}

/** External IDs for other databases */
export interface Externals {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

/** API link structure */
export interface ApiLink {
  href: string
  name?: string
}

/** Links in show response */
export interface ShowLinks {
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

/** API response for paginated shows */
export type ShowsResponse = Show[]

/** API response for search */
export type SearchResponse = SearchResult[]