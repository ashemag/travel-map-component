# Travel Map Component

An interactive travel map component built with React, Next.js, and Google Maps that allows users to visualize and explore travel locations with photos and details.

## Features

- 🗺️ Interactive Google Maps integration
- 📍 Clickable location markers
- 🖼️ Automatic photo fetching from Google Places API
- 🎨 Light and dark theme support
- 📱 Responsive design
- ⚡ Optimized photo loading strategy
- 🎯 Smart marker clustering

## Demo

![Travel Map Component](https://via.placeholder.com/800x400?text=Travel+Map+Component+Demo)

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd travel-map-component
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API
   - Create an API key
   - Copy `.env.example` to `.env.local` and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Usage

```tsx
import TravelMap from './TravelMap'

export default function MyPage() {
  return <TravelMap theme="light" />
}
```

### With Custom Data

1. Edit `data.ts` to customize your locations:

```typescript
export const travelData: TravelLocation[] = [
  {
    id: "unique-id",
    name: "City Name",
    country: "Country",
    lat: 40.7128,
    lng: -74.0060,
    photos: [],
    notes: "Your travel notes here",
    dateVisited: "Summer 2023"
  },
  // Add more locations...
]
```

### Theming

The component supports light and dark themes:

```tsx
// Light theme (default)
<TravelMap theme="light" />

// Dark theme
<TravelMap theme="dark" />
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme for the component |

## Data Structure

Each travel location should follow this interface:

```typescript
interface TravelLocation {
  id: string;              // Unique identifier
  name: string;            // City/location name
  country: string;         // Country name
  lat: number;             // Latitude
  lng: number;             // Longitude
  photos: string[];        // Array of photo URLs (optional)
  googlePhotos?: PlacePhoto[]; // Google Places photos (auto-populated)
  notes: string;           // Travel notes/description
  dateVisited: string;     // When you visited
}
```

## Customization

### Styling

The component uses Tailwind CSS. You can customize the appearance by:

1. Modifying the Tailwind classes in `TravelMap.tsx`
2. Adding custom CSS classes
3. Updating the `tailwind.config.ts` file

### Marker Colors

Change marker colors by updating the pin styling in the component:

```typescript
// In TravelMap.tsx, find this section:
background: #95b084; // Change this color
```

### Map Styles

Customize Google Maps styling by modifying the `styles` array in the map configuration.

## API Requirements

This component requires a Google Maps API key with the following APIs enabled:

- **Maps JavaScript API**: For displaying the map
- **Places API**: For fetching location photos
- **Geocoding API**: For location services

## Performance Optimization

The component includes several performance optimizations:

- **Smart photo loading**: Loads photos for visible locations first
- **Staggered requests**: Prevents API rate limiting
- **Lazy loading**: Photos load as needed
- **Caching**: Reduces redundant API calls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your browser, Node.js version, and any error messages

## Acknowledgments

- Google Maps JavaScript API
- Next.js team for the excellent framework
- Tailwind CSS for styling utilities
- The open source community for inspiration