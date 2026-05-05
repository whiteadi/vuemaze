/**
 * Component tests for ShowCard
 */

import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import ShowCard from '../shows/ShowCard.vue'
import type { Show } from '@/types/show'

// Mock show data
const createMockShow = (overrides: Partial<Show> = {}): Show => ({
  id: 1,
  url: 'https://example.com/show/1',
  name: 'Test Show',
  type: 'Scripted',
  language: 'English',
  genres: ['Drama', 'Comedy'],
  status: 'Running',
  runtime: 60,
  averageRuntime: 60,
  premiered: '2020-01-15',
  ended: null,
  officialSite: 'https://example.com',
  schedule: { time: '20:00', days: ['Monday'] },
  rating: { average: 8.5 },
  weight: 100,
  network: { id: 1, name: 'HBO', country: null, officialSite: null },
  webChannel: null,
  dvdCountry: null,
  externals: { tvrage: null, thetvdb: null, imdb: 'tt1234567' },
  image: {
    medium: 'https://example.com/image-medium.jpg',
    original: 'https://example.com/image-original.jpg',
  },
  summary: '<p>Test summary</p>',
  updated: 1234567890,
  _links: { self: { href: 'https://api.tvmaze.com/shows/1' } },
  ...overrides,
})

describe('ShowCard', () => {
  const mountShowCard = (show: Show = createMockShow()) => {
    return mount(ShowCard, {
      props: { show },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })
  }

  it('renders show name', () => {
    const wrapper = mountShowCard()
    expect(wrapper.text()).toContain('Test Show')
  })

  it('renders show rating', () => {
    const wrapper = mountShowCard()
    expect(wrapper.text()).toContain('8.5')
  })

  it('renders premiere year', () => {
    const wrapper = mountShowCard()
    expect(wrapper.text()).toContain('2020')
  })

  it('renders image with correct src', () => {
    const wrapper = mountShowCard()
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/image-medium.jpg')
  })

  it('shows placeholder when no image', () => {
    const show = createMockShow({ image: null })
    const wrapper = mountShowCard(show)

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('No Image')
  })

  it('hides rating when not available', () => {
    const show = createMockShow({ rating: { average: null } })
    const wrapper = mountShowCard(show)

    // Rating badge should not be visible
    expect(wrapper.find('.show-card__rating').exists()).toBe(false)
  })

  it('links to correct show detail page', () => {
    const wrapper = mountShowCard()
    const link = wrapper.findComponent(RouterLinkStub)

    expect(link.props().to).toEqual({
      name: 'show-detail',
      params: { id: 1 },
    })
  })

  it('has accessible aria-label', () => {
    const wrapper = mountShowCard()
    const link = wrapper.findComponent(RouterLinkStub)

    expect(link.attributes('aria-label')).toBe('View details for Test Show')
  })
})
