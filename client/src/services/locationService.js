import api from "../config/ApiConfig";

export const updateServerLocation = async (lat, lon) => {
  const response = await api.patch("/rider/location", { lat, lon });
  return response.data;
};

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
            lastUpdated: new Date()
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

export const startWatchingPosition = (onSuccess, onError) => {
  if (!navigator.geolocation) {
    onError(new Error("Geolocation is not supported by your browser"));
    return null;
  }
  
  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
        lastUpdated: new Date()
      });
    },
    (error) => {
      onError(error);
    },
    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
  );
};

export const stopWatchingPosition = (watchId) => {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};
