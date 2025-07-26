"use client";
import { useState, useEffect, useRef } from "react";
import { travelData, type TravelLocation } from "./data";

// Google Maps type definitions
declare namespace google {
  namespace maps {
    class Map {
      constructor(element: Element, options: any);
      getBounds(): LatLngBounds | undefined;
      getCenter(): LatLng | undefined;
      addListener(event: string, handler: Function): void;
    }
    class LatLng {
      constructor(lat: number, lng: number);
    }
    class LatLngBounds {
      contains(latLng: LatLng): boolean;
    }
    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: LatLng, to: LatLng): number;
      }
    }
    namespace marker {
      class AdvancedMarkerElement {
        constructor(options: any);
        addListener(event: string, handler: Function): void;
        setMap(map: any): void;
      }
    }
    class Marker {
      constructor(options: any);
      addListener(event: string, handler: Function): void;
      setMap(map: any): void;
    }
    class Size {
      constructor(width: number, height: number);
    }
    class Point {
      constructor(x: number, y: number);
    }
    namespace places {
      class PlacesService {
        constructor(map: any);
        textSearch(request: any, callback: Function): void;
      }
      namespace PlacesServiceStatus {
        const OK: string;
      }
      interface PlacePhoto {
        getUrl(options: { maxWidth?: number; maxHeight?: number }): string;
        width?: number;
        height?: number;
      }
    }
  }
}

declare global {
  interface Window {
    initMap: () => void;
    google?: {
      maps: {
        Map: any;
        marker: {
          AdvancedMarkerElement: any;
        };
        Marker: any;
        Size: any;
        Point: any;
        places: {
          PlacesService: any;
          PlacesServiceStatus: {
            OK: string;
          };
          PlacePhoto: any;
        };
      };
    };
    gm_authFailure?: () => void;
  }
}

interface TravelMapProps {
  theme?: 'light' | 'dark';
}

export default function TravelMap({ theme = 'light' }: TravelMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<TravelLocation | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [locationsWithPhotos, setLocationsWithPhotos] = useState<TravelLocation[]>(travelData);
  const [loadingPhotos, setLoadingPhotos] = useState<Set<string>>(new Set());
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const locationsWithPhotosRef = useRef<TravelLocation[]>(travelData);
  const loadingPhotosRef = useRef<Set<string>>(new Set());
  const fetchLocationPhotosRef = useRef<((location: TravelLocation) => void) | null>(null);

  useEffect(() => {
    // Hide Google Maps error dialogs and warnings
    window.gm_authFailure = () => {
      // Google Maps: Please set up billing in Google Cloud Console
    };

    // Suppress console warnings
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && args[0].includes && args[0].includes('Google Maps JavaScript API')) {
        return; // Suppress Google Maps warnings
      }
      originalConsoleWarn.apply(console, args);
    };

    // Load Google Maps API with proper async loading
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Check if script is already loading
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        setIsMapLoaded(false);
        return;
      }

      const script = document.createElement('script');
      // Set up the callback before loading the script
      window.initMap = initializeMap;

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=marker,places,geometry&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setIsMapLoaded(false);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google?.maps?.Map) {
        setTimeout(initializeMap, 500);
        return;
      }

      try {
        const map = new google.maps.Map(mapRef.current, {
          zoom: 2,
          center: { lat: 20, lng: 0 },
          mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
          disableDefaultUI: false,
          mapTypeControl: false, // Removes MAP | Satellite buttons
          streetViewControl: false, // Removes street view control
          fullscreenControl: true, // Keep fullscreen button
          zoomControl: true, // Keep zoom buttons
          styles: theme === 'dark' ? [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry",
              stylers: [{ color: "#263c3f" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6b9a76" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#212a37" }],
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9ca5b3" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1f2835" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#f3d19c" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
            {
              featureType: "transit.station",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [{ color: "#515c6d" }],
            },
            {
              featureType: "water",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#17263c" }],
            },
          ] : []
        });

        googleMapRef.current = map;

        // Fetch photos for each location using Places API
        const fetchLocationPhotos = async (location: TravelLocation) => {
          if (!window.google?.maps?.places || !googleMapRef.current) {
            return;
          }

          // Mark as loading
          setLoadingPhotos(prev => {
            const newSet = new Set(prev).add(location.id);
            loadingPhotosRef.current = newSet;
            return newSet;
          });

          const service = new window.google.maps.places.PlacesService(googleMapRef.current);

          // Try multiple search strategies to ensure we find photos
          const searchStrategies = [
            `${location.name} ${location.country}`,      // Full search
            `${location.name} city center`,              // City center search
            `${location.name} tourist attractions`,      // Tourist spots
            `${location.name} landmark`,                 // Landmarks
            `${location.name} downtown`,                 // Downtown
            `${location.name} main square`,              // Main square
            location.name,                               // Just city name
            `${location.country} ${location.name}`       // Country first
          ];

          const trySearch = (searchIndex: number) => {
            if (searchIndex >= searchStrategies.length) {
              // Remove from loading state
              setLoadingPhotos(prev => {
                const newSet = new Set(prev);
                newSet.delete(location.id);
                loadingPhotosRef.current = newSet;
                return newSet;
              });
              return;
            }

            const request = {
              query: searchStrategies[searchIndex],
              fields: ['photos', 'name', 'place_id']
            };

            service.textSearch(request, (results: any, status: any) => {
              if (status === window.google?.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
                // Try all results to find photos
                for (let i = 0; i < results.length; i++) {
                  const place = results[i];
                  if (place.photos?.length > 0) {


                    // Get the photo with the highest resolution available
                    const bestPhotos = place.photos.sort((a: any, b: any) => {
                      const aSize = (a.width || 0) * (a.height || 0);
                      const bSize = (b.width || 0) * (b.height || 0);
                      return bSize - aSize;
                    });

                    setLocationsWithPhotos(prev => {
                      const updated = prev.map(loc =>
                        loc.id === location.id
                          ? { ...loc, googlePhotos: bestPhotos }
                          : loc
                      );
                      locationsWithPhotosRef.current = updated;

                      // Update selected location if this is the currently selected one
                      setSelectedLocation(currentSelected => {
                        if (currentSelected && currentSelected.id === location.id) {
                          return { ...currentSelected, googlePhotos: bestPhotos };
                        }
                        return currentSelected;
                      });

                      return updated;
                    });

                    // Remove from loading state
                    setLoadingPhotos(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(location.id);
                      loadingPhotosRef.current = newSet;
                      return newSet;
                    });

                    return; // Found photos, stop searching
                  }
                }
              }

              // No photos found with this strategy, try next
              trySearch(searchIndex + 1);
            });
          };

          trySearch(0);
        };

        // Store reference for click handlers
        fetchLocationPhotosRef.current = fetchLocationPhotos;

        // Smart photo loading strategy
        const loadPhotosIntelligently = () => {

          // Priority 1: Get map bounds and load visible locations first
          const bounds = map.getBounds();
          const visibleLocations: TravelLocation[] = [];
          const nearbyLocations: TravelLocation[] = [];
          const farLocations: TravelLocation[] = [];

          if (bounds) {
            travelData.forEach(location => {
              const latLng = new google.maps.LatLng(location.lat, location.lng);
              if (bounds.contains(latLng)) {
                visibleLocations.push(location);
              } else {
                // Calculate distance to center for prioritization
                const center = map.getCenter();
                if (center) {
                  const distance = google.maps.geometry.spherical.computeDistanceBetween(
                    center,
                    latLng
                  );
                  if (distance < 5000000) { // Within 5000km
                    nearbyLocations.push(location);
                  } else {
                    farLocations.push(location);
                  }
                } else {
                  farLocations.push(location);
                }
              }
            });
          } else {
            // Fallback if bounds not available
            farLocations.push(...travelData);
          }

          // Load in priority order
          let loadIndex = 0;
          const allLocations = [...visibleLocations, ...nearbyLocations, ...farLocations];

          // Load visible locations immediately (first 5)
          visibleLocations.slice(0, 5).forEach((location, i) => {
            setTimeout(() => {
              fetchLocationPhotos(location);
            }, i * 200);
            loadIndex++;
          });

          // Load remaining locations with staggered delays
          allLocations.slice(loadIndex).forEach((location, i) => {
            setTimeout(() => {
              fetchLocationPhotos(location);
            }, (loadIndex * 200) + (i * 400));
          });
        };

        // Initial load after map is ready
        setTimeout(loadPhotosIntelligently, 2000);

        // Reload photos when map view changes significantly
        map.addListener('idle', () => {
          // Only reload if user has stopped moving the map
          const currentBounds = map.getBounds();
          if (currentBounds) {
            // Check if any visible locations don't have photos yet
            const needsLoading = travelData.some(location => {
              const latLng = new google.maps.LatLng(location.lat, location.lng);
              const locationData = locationsWithPhotosRef.current.find(l => l.id === location.id);
              return currentBounds.contains(latLng) && !locationData?.googlePhotos?.length;
            });

            if (needsLoading) {
              loadPhotosIntelligently();
            }
          }
        });

        // Initialize locations
        setLocationsWithPhotos(travelData);

        // Handle location selection
        const selectLocation = (location: TravelLocation) => {
          const locationWithPhotos = locationsWithPhotos.find(loc => loc.id === location.id) || location;
          setSelectedLocation(locationWithPhotos);
          // No zoom or pan - just show the info
        };

        // Add markers for each location
        travelData.forEach((location) => {
          // Try to use AdvancedMarkerElement first
          if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
            try {
              // Create custom pin element
              const pinElement = document.createElement('div');
              pinElement.innerHTML = `
              <div style="
                width: 32px; 
                height: 32px; 
                background: #95b084; 
                border: 2px solid white; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                cursor: pointer;
              ">
                <div style="
                  width: 8px; 
                  height: 8px; 
                  background: white; 
                  border-radius: 50%;
                "></div>
              </div>
            `;

              const marker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                title: `${location.name}, ${location.country}`,
                content: pinElement
              });

              marker.addListener('click', () => {
                handleLocationSelect(location);
              });

              markersRef.current.push(marker);
              return; // Success, skip fallback
            } catch (error) {
              // AdvancedMarkerElement failed, using fallback
            }
          }

          // Fallback to regular marker
          const fallbackMarker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: `${location.name}, ${location.country}`,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#95b084" stroke="#fff" stroke-width="3"/>
                <circle cx="16" cy="16" r="6" fill="#fff"/>
              </svg>
            `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }
          });

          fallbackMarker.addListener('click', () => {
            handleLocationSelect(location);
          });
        });

        setIsMapLoaded(true);
      } catch (error) {
        setIsMapLoaded(false);
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [theme]);

  // Photo fetching function (accessible outside useEffect)
  const fetchPhotosForLocation = async (location: TravelLocation) => {
    if (!window.google?.maps?.places || !googleMapRef.current || loadingPhotosRef.current.has(location.id)) {
      return;
    }

    // Mark as loading and trigger re-render
    setLoadingPhotos(prev => {
      const newSet = new Set(prev).add(location.id);
      loadingPhotosRef.current = newSet;
      return newSet;
    });

    // Call the actual fetch function if available
    if (fetchLocationPhotosRef.current) {
      fetchLocationPhotosRef.current(location);
    }
  };

  const handleLocationSelect = (location: TravelLocation) => {
    // Find the location with photos
    const locationWithPhotos = locationsWithPhotos.find(loc => loc.id === location.id) || location;
    setSelectedLocation(locationWithPhotos);

    // Fetch photos if needed
    if (!locationWithPhotos.googlePhotos?.length && !loadingPhotosRef.current.has(location.id)) {
      fetchPhotosForLocation(location);
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {!isMapLoaded && (
          <div className={`absolute inset-0 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <div className="text-center">
              <div className={`text-lg mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Loading map...
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                (Add your Google Maps API key to make this work)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className={`
        w-96 h-full overflow-y-auto overflow-x-hidden
        ${theme === 'dark' ? 'bg-gray-800 border-l border-gray-700' : 'bg-white border-l border-gray-200'}
      `}>
        {!selectedLocation ? (
          /* Empty state */
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Click a pin to explore
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Select a location on the map to see photos and details
              </p>
            </div>
          </div>
        ) : (
          /* Selected Location Details */
          <div className="h-full flex flex-col">
            {/* Banner Image - Google Photos */}
            {selectedLocation.googlePhotos && selectedLocation.googlePhotos.length > 0 ? (
              <div className="relative h-56 w-full flex-shrink-0">
                <img
                  src={selectedLocation.googlePhotos[0].getUrl({ maxWidth: 800, maxHeight: 400 })}
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Hide the banner container if photo fails to load
                    const bannerContainer = (e.target as HTMLImageElement).closest('.relative');
                    if (bannerContainer) {
                      (bannerContainer as HTMLElement).style.display = 'none';
                    }
                  }}
                />
              </div>
            ) : loadingPhotos.has(selectedLocation.id) ? (
              <div className={`relative h-56 w-full flex-shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex flex-col items-center space-y-2">
                  {/* Loading spinner */}
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Loading photo...
                  </p>
                </div>
              </div>
            ) : (
              <div className={`relative h-56 w-full flex-shrink-0 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No photo available
                </p>
              </div>
            )}

            <div className="p-6 flex-1 overflow-y-auto">
              {/* Title and Date */}
              <div className="mb-4">
                <h2 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {selectedLocation.name}
                </h2>
                {selectedLocation.dateVisited && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Visited: {selectedLocation.dateVisited}
                  </p>
                )}
              </div>

              {/* Notes - only show if notes exist */}
              {selectedLocation.notes && selectedLocation.notes.trim() && (
                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-2 uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Notes
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedLocation.notes}
                  </p>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedLocation(null)}
                className={`
                  mt-6 w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                `}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}