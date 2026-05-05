# VueMaze - TV Show Dashboard Implementation Plan

## 🎯 Project Overview

A Vue.js TV show dashboard application that displays TV shows categorized by genre, with search functionality and detailed show information pages.

## 🛠 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vue.js** | 3.x | Frontend framework (Composition API) |
| **TypeScript** | 5.x | Type safety and better DX |
| **Vite** | 5.x | Build tool and dev server |
| **Vue Router** | 4.x | Client-side routing |
| **Vitest** | 1.x | Unit testing framework |
| **Vue Test Utils** | 2.x | Component testing utilities |
| **ESLint** | 8.x | Code linting |
| **Prettier** | 3.x | Code formatting |

### Why These Choices?

1. **Vue 3 + Composition API**: Modern, performant, better TypeScript support, and aligns with ABN AMRO's tech stack
2. **TypeScript**: Catches errors at compile time, better IDE support, self-documenting code
3. **Vite**: Fastest build tool for Vue, native ESM support, excellent HMR
4. **No state management library**: For this scope, Vue's built-in reactivity (ref/reactive) is sufficient - avoiding over-engineering
5. **No CSS framework**: Custom CSS with CSS variables for theming - demonstrates CSS skills

## 📁 Project Structure

```
vuemaze/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── main.css          # Global styles
│   │       └── variables.css     # CSS custom properties
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   │   ├── AppHeader.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── ErrorMessage.vue
│   │   ├── shows/                # Show-specific components
│   │   │   ├── ShowCard.vue
│   │   │   ├── GenreRow.vue
│   │   │   └── ShowSearch.vue
│   │   └── __tests__/            # Component tests
│   ├── composables/              # Reusable composition functions
│   │   ├── useShows.ts
│   │   ├── useSearch.ts
│   │   └── useDebounce.ts
│   ├── services/                 # API services
│   │   └── tvmazeApi.ts
│   ├── types/                    # TypeScript interfaces
│   │   └── show.ts
│   ├── views/                    # Page components
│   │   ├── DashboardView.vue
│   │   └── ShowDetailView.vue
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── CHANGELOG.md
├── PLAN.md
└── README.md
```

## 🎨 UI/UX Design

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│  🎬 VueMaze                    [🔍 Search shows...]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Drama                                           ► ► ►  │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│  │    │ │    │ │    │ │    │ │    │ │    │  ────────► │
│  │    │ │    │ │    │ │    │ │    │ │    │            │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘            │
│                                                         │
│  Comedy                                         ► ► ►   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│  │    │ │    │ │    │ │    │ │    │ │    │  ────────► │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘            │
│                                                         │
│  Thriller                                       ► ► ►   │
│  ...                                                    │
└─────────────────────────────────────────────────────────┘
```

### Show Card Design
- Poster image with lazy loading
- Show title overlay
- Rating badge (star icon + number)
- Hover effect with scale transform

### Color Scheme
- Dark theme (modern streaming app feel)
- Primary: #3B82F6 (blue)
- Background: #0F172A (dark blue-gray)
- Surface: #1E293B (lighter dark)
- Text: #F8FAFC (off-white)
- Accent: #F59E0B (amber for ratings)

## 🔌 API Integration

### Endpoints Used

1. **Show Index** - `GET /shows?page={page}`
   - Returns 250 shows per page
   - Contains genres array for filtering
   - Contains rating.average for sorting
   - We'll fetch first 2-3 pages to get enough variety

2. **Single Show** - `GET /shows/{id}`
   - Full show details for detail page

3. **Search** - `GET /search/shows?q={query}`
   - Search results with score
   - Returns wrapped show objects

### Data Processing Strategy
1. Fetch shows from index endpoint
2. Group shows by genre (a show can appear in multiple genres)
3. Sort each genre group by rating (highest first)
4. Display top N shows per genre (e.g., top 20)

## 📋 Implementation Phases

### Phase 1: Project Setup (Commit 1)
- [x] Initialize Vue 3 + Vite + TypeScript project
- [x] Configure ESLint and Prettier
- [x] Set up folder structure
- [x] Create base styles and CSS variables

### Phase 2: Core Infrastructure (Commit 2)
- [ ] Create TypeScript interfaces for Show data
- [ ] Implement TVMaze API service
- [ ] Set up Vue Router with routes
- [ ] Create basic App shell with header

### Phase 3: Dashboard Components (Commit 3)
- [ ] Create ShowCard component
- [ ] Create GenreRow component (horizontal scroll)
- [ ] Implement DashboardView with genre groupings
- [ ] Add loading states

### Phase 4: Show Details (Commit 4)
- [ ] Create ShowDetailView
- [ ] Display comprehensive show information
- [ ] Add back navigation

### Phase 5: Search Feature (Commit 5)
- [ ] Create SearchInput component with debouncing
- [ ] Implement search results display
- [ ] Handle empty states

### Phase 6: Polish & Responsive (Commit 6)
- [ ] Mobile responsive design
- [ ] Error handling and fallbacks
- [ ] Performance optimizations
- [ ] Accessibility improvements

### Phase 7: Testing (Commit 7)
- [ ] Unit tests for composables
- [ ] Component tests for ShowCard, GenreRow
- [ ] Integration tests for views

### Phase 8: Documentation (Commit 8)
- [ ] Complete README with instructions
- [ ] Document architectural decisions
- [ ] Add code comments where needed

## ✅ Quality Checklist

- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Fast initial load
- [ ] Smooth scrolling and animations
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] Type-safe (no TypeScript errors)
- [ ] All tests passing
- [ ] Clean git history with meaningful commits

## 🚀 Getting Started

After approval of this plan, we'll execute:

```bash
# Initialize the Vue project
npm create vue@latest . -- --typescript --vue-router --vitest --eslint --prettier

# Install dependencies
npm install

# Start development
npm run dev
```

---

*Ready to proceed? Let me know if you'd like to modify anything in this plan!*