/**
 * Debounce composable
 * Delays the execution of a function until after a specified delay
 */

import { ref, watch, type Ref } from 'vue'

/**
 * Creates a debounced ref that updates after a delay
 * @param value - The reactive ref to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns A debounced ref
 */
export function useDebouncedRef<T>(value: Ref<T>, delay: number = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

/**
 * Creates a debounced function
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns A debounced function
 */
export function useDebounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number = 300,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}