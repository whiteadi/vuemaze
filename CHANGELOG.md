# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- TV Show Dashboard with genre-based categorization
- Horizontal scrollable lists for each genre
- Show detail page with comprehensive information
- Search functionality
- Responsive design for mobile devices
- Unit tests with Vitest

---

## [0.2.0] - 2026-05-05

### Added
- Dashboard view with genre-based show organization
- ShowCard component with poster, rating badge, and hover effects
- GenreRow component with horizontal scroll and navigation
- AppHeader component with logo and search input
- ShowDetailView with comprehensive show information
- Loading spinner and error message components
- Real-time search with debouncing
- 43 unit and component tests

### Technical
- Responsive design for mobile/tablet/desktop
- CSS custom properties for theming
- Accessible components with ARIA labels

---

## [0.1.0] - 2026-05-05

### Added
- Initial project setup with Vue 3.5 + Vite 8 + TypeScript 6
- Project structure with components, views, composables, services, and types
- CSS design system with custom properties (dark theme)
- TypeScript interfaces for TVMaze API data structures
- API service for TVMaze endpoints (shows, search, single show)
- Composables: `useShows`, `useSearch`, `useDebounce`
- Vue Router configuration with Dashboard and ShowDetail routes
- ESLint + Prettier configuration for code quality

---

## Implementation Plan

### Phase 1: Project Setup
- [ ] Initialize Vue 3 project with Vite and TypeScript
- [ ] Configure ESLint and Prettier for code quality
- [ ] Set up project folder structure
- [ ] Configure Vue Router for navigation
- [ ] Create base API service for TVMaze

### Phase 2: Core Features
- [ ] Create reusable ShowCard component
- [ ] Create horizontal scrollable GenreRow component
- [ ] Implement Dashboard view with genre groupings
- [ ] Implement Show Detail view
- [ ] Add search functionality with debouncing

### Phase 3: Polish & Testing
- [ ] Add loading states and error handling
- [ ] Implement responsive design
- [ ] Write unit tests for components
- [ ] Write unit tests for services/composables
- [ ] Performance optimizations (lazy loading, etc.)

### Phase 4: Documentation & Finalization
- [ ] Update README with setup instructions
- [ ] Document architectural decisions
- [ ] Final testing and bug fixes
- [ ] Prepare for deployment

---

## API Endpoints Used

| Endpoint | Description |
|----------|-------------|
| `GET /shows?page={page}` | Get paginated list of all shows (250 per page) |
| `GET /shows/{id}` | Get single show details |
| `GET /search/shows?q={query}` | Search shows by name |

---