
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface UserLocation {
  lat: number;
  lng: number;
  name: string;
  accuracy: number;
  timestamp: number;
}

interface LocationContextType {
  userLocation: UserLocation | null;
  isLocating: boolean;
  locationError: string | null;
  requestUserLocation: () => Promise<UserLocation | null>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

async function resolvePlaceName(lat: number, lng: number): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const url = new URL(
      "https://nominatim.openstreetmap.org/reverse"
    );

    url.search = new URLSearchParams({
      format: "jsonv2",
      lat: String(lat),
      lon: String(lng),
      zoom: "18",
      addressdetails: "1",
      "accept-language": "es",
    }).toString();

    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });

    if (!response.ok) return "";

    const data = await response.json();
    const address = data.address;

    if (!address) return "";

    const road = address.road || address.pedestrian || "";
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county ||
      "";

    return [
      road,
      city,
      address.postcode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  } catch {
    return "";
  } finally {
    clearTimeout(timeoutId);
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestUserLocation = (): Promise<UserLocation | null> => {
    if (!navigator.geolocation) {
      setLocationError("Este navegador no soporta geolocalización.");
      return Promise.resolve(null);
    }

    setIsLocating(true);
    setLocationError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            const name = await resolvePlaceName(lat, lng);

            const location: UserLocation = {
              lat,
              lng,
              name,
              accuracy,
              timestamp: position.timestamp,
            };

            setUserLocation(location);
            resolve(location);
          } catch {
            setLocationError("No se pudo procesar la ubicación.");
            resolve(null);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          const messages: Record<number, string> = {
            1: "Permiso de ubicación denegado.",
            2: "No se pudo determinar la ubicación.",
            3: "Tiempo de espera agotado.",
          };

          setLocationError(
            messages[error.code] ?? "No se pudo obtener la ubicación."
          );

          setIsLocating(false);
          resolve(null);
        },
        {
          timeout: 7000,
          enableHighAccuracy: true,
          maximumAge: 10000,
        }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLocating,
        locationError,
        requestUserLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("useLocation debe usarse dentro de LocationProvider.");
  }

  return context;
}
