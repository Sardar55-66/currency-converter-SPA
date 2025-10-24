# Currency Converter

A modern, responsive currency converter web application built with React, TypeScript, and Vite. Features live exchange rates, offline support, and a beautiful user interface that matches the Figma design specifications.

## Features

- 🔄 **Live Exchange Rates**: Real-time currency conversion using VATComply API
- 📱 **Responsive Design**: Pixel-perfect implementation matching Figma designs for mobile (≤480px) and desktop (≥1024px)
- 🔌 **Offline Support**: Cached rates with offline functionality and clear status indicators
- ⚡ **Fast Performance**: Optimized with React.memo, useMemo, and useCallback
- 🎨 **Figma-Accurate UI**: Exact implementation of provided Figma designs with proper spacing, colors, and typography
- ⌨️ **Keyboard Navigation**: Full keyboard support in currency selection modal (↑/↓, Enter, Esc)
- 💾 **Persistent State**: Remembers last currencies and amount in localStorage
- 🔄 **Auto-refresh**: Background rate updates with 5-minute cache expiry
- 📊 **Detailed Rate Info**: Shows exchange rate and inverse rate calculations
- ⚠️ **Error Handling**: User-friendly error messages with retry functionality

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: VATComply Exchange Rates API

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd currency-converter
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create a `.env` file in the root directory:

```env
# Exchange Rate API Configuration
VITE_EXCHANGE_API_URL=https://api.vatcomply.com/rates
VITE_CACHE_EXPIRY_MINUTES=5
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AmountInput.tsx
│   ├── ConversionDisplay.tsx
│   ├── CurrencyConverter.tsx
│   ├── CurrencyModal.tsx
│   ├── CurrencySelector.tsx
│   └── SwapButton.tsx
├── constants/           # App constants
│   └── index.ts
├── hooks/              # Custom React hooks
│   ├── useCurrencyConverter.ts
│   └── useCurrencySelector.ts
├── services/           # API services
│   └── exchangeRateService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── ui/                 # Reusable UI components
│   └── Button.tsx
├── utils/              # Utility functions
│   └── index.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Design Implementation

### Figma Design Compliance
- **Desktop Layout**: Horizontal arrangement with side-by-side currency selectors and result panel
- **Mobile Layout**: Vertical stacking with currency selectors above and below swap button
- **Color Scheme**: Exact color matching from Figma (blue accents #1447E6, green status #008236, neutral grays)
- **Typography**: Inter font family with proper weights (400, 500, 600, 700) and sizes
- **Spacing**: Precise padding, margins, and gaps matching design specifications
- **Components**: Circular currency symbols, rounded corners (8px, 16px), proper border styles

### Responsive Breakpoints
- **Mobile**: ≤480px - Vertical layout with stacked elements
- **Desktop**: ≥1024px - Horizontal layout with side-by-side arrangement
- **Tablet**: 481px-1023px - Adaptive layout with flexible positioning

## Architecture & Key Decisions

### API Choice
- **VATComply API**: Chosen for its reliability, free usage, and comprehensive currency support
- **Base Currency**: EUR (as provided by the API)
- **Rate Calculation**: Handles base currency conversion using the formula: `rate(A→B) = rate(Base→B) / rate(Base→A)`

### Caching Strategy
- **localStorage**: Stores exchange rates with timestamp
- **Cache Expiry**: 5 minutes (configurable via environment variable)
- **Offline Fallback**: Uses cached data when offline with clear indication
- **Background Refresh**: Automatically refreshes rates when online

### State Management
- **Custom Hooks**: `useCurrencyConverter` manages conversion logic and state
- **Local Storage**: Persists user preferences (last currencies, amount)
- **Network Status**: Real-time online/offline detection

### Performance Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **useMemo**: Memoizes expensive calculations
- **useCallback**: Prevents function recreation on every render
- **Debounced Input**: 250ms delay for amount input to reduce API calls

### Error Handling
- **Network Errors**: Graceful fallback to cached data
- **API Errors**: User-friendly error messages
- **Validation**: Input validation with helpful feedback
- **Retry Mechanism**: Manual refresh button for failed requests

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Demo

You can view a live demo at: [Deploy your own version]

---

Built with ❤️ using React, TypeScript, and Vite.