/**
 * Unit tests for useDebounce composable
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebouncedRef, useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useDebouncedRef', () => {
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

  describe('useDebounce', () => {
    it('should debounce function calls', () => {
      const fn = vi.fn()
      const debouncedFn = useDebounce(fn, 300)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(300)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to debounced function', () => {
      const fn = vi.fn()
      const debouncedFn = useDebounce(fn, 300)

      debouncedFn('arg1', 'arg2')
      vi.advanceTimersByTime(300)

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should use last arguments when called multiple times', () => {
      const fn = vi.fn()
      const debouncedFn = useDebounce(fn, 300)

      debouncedFn('first')
      debouncedFn('second')
      debouncedFn('third')

      vi.advanceTimersByTime(300)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('third')
    })
  })
})