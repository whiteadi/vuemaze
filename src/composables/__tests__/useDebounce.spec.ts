/**
 * Unit tests for useDebouncedRef composable
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebouncedRef } from '../useDebounce'

describe('useDebouncedRef', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('with ref source', () => {
    it('should return initial value immediately', () => {
      const source = ref('initial')
      const debounced = useDebouncedRef(source, 300)

      expect(debounced.value).toBe('initial')
    })

    it('should debounce value changes', async () => {
      const source = ref('initial')
      const debounced = useDebouncedRef(source, 300)

      source.value = 'changed'
      await nextTick()

      // Value should not change immediately
      expect(debounced.value).toBe('initial')

      // Fast forward time
      vi.advanceTimersByTime(300)
      await nextTick()

      // Now value should be updated
      expect(debounced.value).toBe('changed')
    })

    it('should cancel previous timeout on rapid changes', async () => {
      const source = ref('initial')
      const debounced = useDebouncedRef(source, 300)

      source.value = 'first'
      await nextTick()
      vi.advanceTimersByTime(100)

      source.value = 'second'
      await nextTick()
      vi.advanceTimersByTime(100)

      source.value = 'third'
      await nextTick()

      // Value should still be initial (not enough time passed)
      expect(debounced.value).toBe('initial')

      // Fast forward remaining time
      vi.advanceTimersByTime(300)
      await nextTick()

      // Should have the last value
      expect(debounced.value).toBe('third')
    })

    it('should use custom delay', async () => {
      const source = ref('initial')
      const debounced = useDebouncedRef(source, 500)

      source.value = 'changed'
      await nextTick()

      vi.advanceTimersByTime(300)
      await nextTick()
      expect(debounced.value).toBe('initial')

      vi.advanceTimersByTime(200)
      await nextTick()
      expect(debounced.value).toBe('changed')
    })
  })

  describe('with getter source (Vue best practice)', () => {
    it('should work with getter function', async () => {
      const source = ref('initial')
      // Using getter function instead of ref directly
      const debounced = useDebouncedRef(() => source.value, 300)

      expect(debounced.value).toBe('initial')

      source.value = 'changed'
      await nextTick()

      expect(debounced.value).toBe('initial')

      vi.advanceTimersByTime(300)
      await nextTick()

      expect(debounced.value).toBe('changed')
    })

    it('should work with computed-like getter', async () => {
      const firstName = ref('John')
      const lastName = ref('Doe')

      // Getter that combines multiple refs
      const debounced = useDebouncedRef(() => `${firstName.value} ${lastName.value}`, 300)

      expect(debounced.value).toBe('John Doe')

      firstName.value = 'Jane'
      await nextTick()
      vi.advanceTimersByTime(300)
      await nextTick()

      expect(debounced.value).toBe('Jane Doe')
    })
  })

  describe('with reactive delay', () => {
    it('should support reactive delay via ref', async () => {
      const source = ref('initial')
      const delay = ref(300)
      const debounced = useDebouncedRef(source, delay)

      source.value = 'changed'
      await nextTick()

      vi.advanceTimersByTime(300)
      await nextTick()

      expect(debounced.value).toBe('changed')
    })

    it('should support reactive delay via getter', async () => {
      const source = ref('initial')
      const isMobile = ref(false)

      // Dynamic delay based on device type
      const debounced = useDebouncedRef(source, () => (isMobile.value ? 500 : 300))

      source.value = 'changed'
      await nextTick()

      vi.advanceTimersByTime(300)
      await nextTick()

      expect(debounced.value).toBe('changed')
    })
  })
})
