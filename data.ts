// Google Maps type definitions for data file
declare namespace google {
    namespace maps {
        namespace places {
            interface PlacePhoto {
                getUrl(options: { maxWidth?: number; maxHeight?: number }): string;
                width?: number;
                height?: number;
            }
        }
    }
}

export interface TravelLocation {
    id: string;
    name: string;
    country: string;
    lat: number;
    lng: number;
    photos: string[];
    googlePhotos?: google.maps.places.PlacePhoto[];
    notes: string;
    dateVisited: string;
}

export const travelData: TravelLocation[] = [
    // Popular Travel Destinations
    {
        id: "paris",
        name: "Paris",
        country: "France",
        lat: 48.8566,
        lng: 2.3522,
        photos: [],
        notes: "The City of Light. Visited the Eiffel Tower, Louvre Museum, and enjoyed croissants at local cafés.",
        dateVisited: "Summer 2023"
    },
    {
        id: "tokyo",
        name: "Tokyo",
        country: "Japan",
        lat: 35.6762,
        lng: 139.6503,
        photos: [],
        notes: "Amazing blend of traditional and modern culture. Cherry blossoms in spring were breathtaking.",
        dateVisited: "Spring 2023"
    },
    {
        id: "newyork",
        name: "New York",
        country: "United States",
        lat: 40.7128,
        lng: -74.0060,
        photos: [],
        notes: "The city that never sleeps. Central Park, Broadway shows, and incredible skyline views.",
        dateVisited: "Fall 2022"
    },
    {
        id: "london",
        name: "London",
        country: "United Kingdom",
        lat: 51.5074,
        lng: -0.1278,
        photos: [],
        notes: "Rich history and culture. Big Ben, Tower Bridge, and afternoon tea experiences.",
        dateVisited: "Summer 2022"
    },
    {
        id: "rome",
        name: "Rome",
        country: "Italy",
        lat: 41.9028,
        lng: 12.4964,
        photos: [],
        notes: "Ancient history everywhere. Colosseum, Vatican City, and the best pasta ever.",
        dateVisited: "Spring 2022"
    },
    {
        id: "barcelona",
        name: "Barcelona",
        country: "Spain",
        lat: 41.3851,
        lng: 2.1734,
        photos: [],
        notes: "Gaudí's architecture is mind-blowing. Sagrada Familia and Park Güell were highlights.",
        dateVisited: "Summer 2021"
    },
    {
        id: "sydney",
        name: "Sydney",
        country: "Australia",
        lat: -33.8688,
        lng: 151.2093,
        photos: [],
        notes: "Beautiful harbor city. Opera House and Harbour Bridge are iconic landmarks.",
        dateVisited: "Winter 2021"
    },
    {
        id: "amsterdam",
        name: "Amsterdam",
        country: "Netherlands",
        lat: 52.3676,
        lng: 4.9041,
        photos: [],
        notes: "Charming canals and bike-friendly streets. Great museums and vibrant nightlife.",
        dateVisited: "Fall 2021"
    },
    {
        id: "berlin",
        name: "Berlin",
        country: "Germany",
        lat: 52.5200,
        lng: 13.4050,
        photos: [],
        notes: "Historical significance and modern culture. Berlin Wall remnants and Brandenburg Gate.",
        dateVisited: "Spring 2021"
    },
    {
        id: "lisbon",
        name: "Lisbon",
        country: "Portugal",
        lat: 38.7223,
        lng: -9.1393,
        photos: [],
        notes: "Colorful tiles and trams everywhere. Pastéis de nata and beautiful coastal views.",
        dateVisited: "Summer 2020"
    },
    {
        id: "prague",
        name: "Prague",
        country: "Czech Republic",
        lat: 50.0755,
        lng: 14.4378,
        photos: [],
        notes: "Fairytale city with stunning architecture. Charles Bridge and Prague Castle were magical.",
        dateVisited: "Fall 2020"
    },
    {
        id: "vienna",
        name: "Vienna",
        country: "Austria",
        lat: 48.2082,
        lng: 16.3738,
        photos: [],
        notes: "Imperial elegance and classical music heritage. Schönbrunn Palace and Mozart concerts.",
        dateVisited: "Winter 2020"
    },
    {
        id: "santorini",
        name: "Santorini",
        country: "Greece",
        lat: 36.3932,
        lng: 25.4615,
        photos: [],
        notes: "Stunning sunsets and white-washed buildings. Perfect for romantic getaways.",
        dateVisited: "Summer 2019"
    },
    {
        id: "istanbul",
        name: "Istanbul",
        country: "Turkey",
        lat: 41.0082,
        lng: 28.9784,
        photos: [],
        notes: "Where Europe meets Asia. Hagia Sophia and Grand Bazaar were incredible experiences.",
        dateVisited: "Spring 2019"
    },
    {
        id: "reykjavik",
        name: "Reykjavik",
        country: "Iceland",
        lat: 64.1466,
        lng: -21.9426,
        photos: [],
        notes: "Gateway to natural wonders. Northern lights and geothermal hot springs.",
        dateVisited: "Winter 2019"
    },
    {
        id: "copenhagen",
        name: "Copenhagen",
        country: "Denmark",
        lat: 55.6761,
        lng: 12.5683,
        photos: [],
        notes: "Hygge culture and beautiful design. Nyhavn harbor and bicycle-friendly city.",
        dateVisited: "Summer 2018"
    },
    {
        id: "stockholm",
        name: "Stockholm",
        country: "Sweden",
        lat: 59.3293,
        lng: 18.0686,
        photos: [],
        notes: "Built on 14 islands. Gamla Stan old town and modern Scandinavian design.",
        dateVisited: "Spring 2018"
    },
    {
        id: "zurich",
        name: "Zurich",
        country: "Switzerland",
        lat: 47.3769,
        lng: 8.5417,
        photos: [],
        notes: "Clean, efficient, and beautiful. Lake Zurich and nearby Alps access.",
        dateVisited: "Fall 2018"
    },
    {
        id: "dubai",
        name: "Dubai",
        country: "United Arab Emirates",
        lat: 25.2048,
        lng: 55.2708,
        photos: [],
        notes: "Futuristic city in the desert. Burj Khalifa and luxury shopping experiences.",
        dateVisited: "Winter 2017"
    },
    {
        id: "singapore",
        name: "Singapore",
        country: "Singapore",
        lat: 1.3521,
        lng: 103.8198,
        photos: [],
        notes: "Cultural melting pot with amazing food. Gardens by the Bay and Marina Bay Sands.",
        dateVisited: "Summer 2017"
    }
];

// Calculate unique countries
export const uniqueCountries = Array.from(new Set(travelData.map(location => location.country))).length;