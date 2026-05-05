/**
 * Unit tests for TVMaze API service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getShows, getShowById, searchShows, ApiError } from '../tvmazeApi'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('tvmazeApi', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getShows', () => {
    it('should fetch shows from the API', async () => {
      const mockShows = [
        { id: 1, name: 'Show 1' },
        { id: 2, name: 'Show 2' },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockShows),
      })

      const result = await getShows(0)

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=0')
      expect(result).toEqual(mockShows)
    })

    it('should use default page 0 when not specified', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await getShows()

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=0')
    })

    it('should throw ApiError on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(getShows(999)).rejects.toThrow(ApiError)
    })

    it('should throw ApiError on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getShows()).rejects.toThrow(ApiError)
    })
  })

  describe('getShowById', () => {
    it('should fetch a single show by ID', async () => {
      const mockShow = { id: 169, name: 'Breaking Bad' }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockShow),
      })

      const result = await getShowById(169)

      expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/169')
      expect(result).toEqual(mockShow)
    })

    it('should throw ApiError for invalid show ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(getShowById(99999)).rejects.toThrow(ApiError)
    })
  })

  describe('searchShows', () => {
    it('should search shows by query', async () => {
      const mockResults = [
        { score: 0.9, show: { id: 1, name: 'Breaking Bad' } },
        { score: 0.8, show: { id: 2, name: 'Better Call Saul' } },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults),
      })

      const result = await searchShows('breaking')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=breaking',
      )
      expect(result).toEqual(mockResults)
    })

    it('should encode special characters in query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await searchShows('game of thrones')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=game%20of%20thrones',
      )
    })

    it('should return empty array for empty query', async () => {
      const result = await searchShows('')
      expect(result).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should return empty array for whitespace-only query', async () => {
      const result = await searchShows('   ')
      expect(result).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('ApiError', () => {
    it('should have correct name and message', () => {
      const error = new ApiError('Test error', 404)

      expect(error.name).toBe('ApiError')
      expect(error.message).toBe('Test error')
      expect(error.status).toBe(404)
    })

    it('should work without status', () => {
      const error = new ApiError('Test error')

      expect(error.name).toBe('ApiError')
      expect(error.message).toBe('Test error')
      expect(error.status).toBeUndefined()
    })
  })
})