/**
 * Debounce composable
 * Delays the update of a value until after a specified delay
 * Follows Vue best practices for composables using toValue/MaybeRefOrGetter
 */

import { ref, watch, toValue, type Ref, type MaybeRefOrGetter } from 'vue'

/**
 * Creates a debounced ref that updates after a delay
 * Accepts a ref, getter function, or plain value
 *
 * @param source - The source value to debounce (can be ref, getter, or plain value)
 * @param delay - Delay in milliseconds (can also be ref or getter)
 * @returns A debounced ref
 *
 * @example
 * // With a ref
 * const query = ref('hello')
 * const debouncedQuery = useDebouncedRef(query, 300)
 *
 * // With a getter (reactive to dependencies)
 * const debouncedQuery = useDebouncedRef(() => searchInput.value, 300)
 *
 * // With reactive delay
 * const debouncedQuery = useDebouncedRef(query, () => isMobile.value ? 500 : 300)
 */
export function useDebouncedRef<T>(
  source: MaybeRefOrGetter<T>,
  delay: MaybeRefOrGetter<number> = 300,
): Ref<T> {
  const debouncedValue = ref(toValue(source)) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  // Watch the source for changes using a getter pattern
  watch(
    () => toValue(source),
    (newValue) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        debouncedValue.value = newValue
      }, toValue(delay))
    },
  )

  return debouncedValue
}
