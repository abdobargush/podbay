# Podbay Clone Frontend (خليج البودكاست )

A modern Arabic podcast search frontend built with Next.js 15, featuring real-time search, responsive design, and smooth animations.

## 🌟 Features

- **Real-time Search**: Debounced search with 500ms delay for optimal performance
- **Arabic Support**: Full Arabic language support with RTL layout
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive UI**: Smooth animations powered by Framer Motion
- **Multiple View Modes**: Grid and list layouts for episodes
- **Carousel Display**: Swipeable podcast cards with navigation controls
- **Loading States**: Custom loading animations and empty states
- **Modern Styling**: Tailwind CSS with custom gradients and effects

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **React**: React 19 with React DOM 19
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Animations**: Framer Motion 12.18.1
- **Icons**: HackerNoon Pixel Icon Library
- **HTTP Client**: Axios 1.10.0
- **Date Handling**: Day.js with Arabic locale
- **Carousel**: Swiper.js 11.2.8
- **Utilities**: clsx, tailwind-merge, usehooks-ts

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── index.tsx           # Axios configuration
│   ├── app/
│   │   ├── globals.css         # Global styles and theme
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── loading.tsx         # Global loading component
│   │   └── page.tsx            # Home page with search results
│   ├── components/
│   │   ├── EmptyState.tsx      # Empty search state
│   │   ├── EpisodeCard.tsx     # Episode display card
│   │   ├── EpisodesGrid.tsx    # Episodes grid/list layout
│   │   ├── Logo.tsx            # Application logo
│   │   ├── PodcastCard.tsx     # Podcast display card
│   │   ├── PodcastsSwiper.tsx  # Podcast carousel
│   │   └── SearchForm.tsx      # Search input with debouncing
│   ├── hooks/
│   │   └── useRandomColorHelper.tsx # Color generation utility
│   ├── lib/
│   │   ├── dayjs.ts           # Day.js Arabic configuration
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript type definitions
└── package.json
```

## 🎨 Design System

### Theme

- **Background**: Dark theme with `#0a0a0a` primary background
- **Foreground**: Light text with `#ededed` for contrast
- **Font**: Handjet font family with Arabic support
- **Colors**: Dynamic gradient backgrounds with 7 color variations

### Components

- **Cards**: Gradient backgrounds with hover effects
- **Navigation**: Sticky header with backdrop blur
- **Buttons**: Icon-based controls with opacity transitions
- **Inputs**: Rounded search input with focus states

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Environment Variables

Create a `.env` file:

```env
API_URL=http://localhost:3001
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔍 Search Functionality

### Search Flow

1. User types in search input
2. Input is debounced for 500ms
3. Search term is validated (minimum 3 characters)
4. API request is made to backend
5. Results are displayed in grid/list format
6. URL is updated with search parameters

### Search Features

- **Debounced Input**: Prevents excessive API calls
- **URL Persistence**: Search terms persist in URL
- **Loading States**: Visual feedback during searches
- **Empty States**: Helpful messaging for no results
- **Error Handling**: Graceful handling of failed requests

## 📱 Responsive Design

### Layout Adaptations

- **Navigation**: Stacked on mobile, horizontal on desktop
- **Episodes Grid**: 1 column mobile, 2-3 columns desktop
- **Podcast Cards**: Fixed width with horizontal scroll
- **Typography**: Responsive text sizing

## 🎭 Animations

### Framer Motion Integration

- **Stagger Animations**: Sequential card appearances
- **Layout Transitions**: Smooth grid/list view changes
- **Hover Effects**: Interactive card behaviors
- **Page Transitions**: Smooth navigation between states

## 🌐 Internationalization

### Arabic Support

- **RTL Layout**: Right-to-left text direction
- **Arabic Fonts**: Handjet font with Arabic character support
- **Date Formatting**: Arabic locale for Day.js
- **UI Text**: All interface text in Arabic

## 🎯 Performance Optimizations

- **Next.js 15**: Latest framework with improved performance
- **Turbopack**: Fast development builds
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based splitting
- **Debounced Search**: Reduced API calls
- **CSS-in-JS**: Tailwind for optimized styles

## 🔗 API Integration

### Search Endpoint

```typescript
GET /search?term=${encodeURIComponent(term)}

Response: {
  podcasts: Podcast[];
  episodes: Episode[];
}
```

### Data Types

- **Podcast**: Contains metadata, artwork, and artist information
- **Episode**: Includes duration, description, and podcast relationship
- **Artist**: Linked to podcasts with name and external links

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues, suggest features, or submit pull requests to help improve the project.

---

Built with ❤️ and backpain.
