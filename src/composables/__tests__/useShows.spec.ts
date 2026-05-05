/**
 * Unit tests for useShows composable
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatRating, stripHtml, formatDate, getYear } from '../useShows'

// Mock the API module
vi.mock('@/services/tvmazeApi', () => ({
  getShowsMultiplePages: vi.fn(),
  getShowById: vi.fn(),
}))

describe('useShows utilities', () => {
  describe('formatRating', () => {
    it('should format rating to one decimal place', () => {
      expect(formatRating(8.5)).toBe('8.5')
      expect(formatRating(9.0)).toBe('9.0')
      expect(formatRating(7.25)).toBe('7.3')
    })

    it('should return N/A for null rating', () => {
      expect(formatRating(null)).toBe('N/A')
    })

    it('should handle zero rating', () => {
      expect(formatRating(0)).toBe('0.0')
    })
  })

  describe('stripHtml', () => {
    it('should remove HTML tags from string', () => {
      expect(stripHtml('<p>Hello World</p>')).toBe('Hello World')
      expect(stripHtml('<b>Bold</b> and <i>italic</i>')).toBe('Bold and italic')
    })

    it('should handle nested HTML tags', () => {
      expect(stripHtml('<div><p><span>Nested</span></p></div>')).toBe('Nested')
    })

    it('should return empty string for null input', () => {
      expect(stripHtml(null)).toBe('')
    })

    it('should return empty string for empty input', () => {
      expect(stripHtml('')).toBe('')
    })

    it('should handle string without HTML', () => {
      expect(stripHtml('Plain text')).toBe('Plain text')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const formatted = formatDate('2020-01-15')
      expect(formatted).toContain('2020')
      expect(formatted).toContain('January')
      expect(formatted).toContain('15')
    })

    it('should return Unknown for null date', () => {
      expect(formatDate(null)).toBe('Unknown')
    })

    it('should return Unknown for empty string', () => {
      expect(formatDate('')).toBe('Unknown')
    })
  })

  describe('getYear', () => {
    it('should extract year from date string', () => {
      expect(getYear('2020-01-15')).toBe('2020')
      expect(getYear('2015-12-31')).toBe('2015')
    })

    it('should return Unknown for null date', () => {
      expect(getYear(null)).toBe('Unknown')
    })

    it('should return Unknown for empty string', () => {
      expect(getYear('')).toBe('Unknown')
    })
  })
})

describe('useShows composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Note: Full composable tests would require more complex mocking
  // These are kept simple for demonstration purposes
  it('should be importable', async () => {
    const { useShows } = await import('../useShows')
    expect(useShows).toBeDefined()
    expect(typeof useShows).toBe('function')
  })

  it('should return expected structure', async () => {
    const { useShows } = await import('../useShows')
    const result = useShows()

    expect(result).toHaveProperty('shows')
    expect(result).toHaveProperty('genreGroups')
    expect(result).toHaveProperty('isLoading')
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('fetchShows')
    expect(result).toHaveProperty('getShowById')
  })
})
