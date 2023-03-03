import React, { useState, useEffect } from "react";
import "./App.css";
export default function App() {
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchWeatherData(latitude, longitude);
      setData(response);
      console.log(response);
    };
    fetchData();
  }, [latitude, longitude]);

  const fetchWeatherData = async (lat, lon) => {
    const response = await fetch(
      `${import.meta.env.API_URL}/weather?lat=${lat}&lon=${lon}&appid=${
        import.meta.env.API_KEY
      }&units=metric`
    );
    const result = await response.json();
    return result;
  };

  const handleLocationUpdate = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleLocationUpdate);
  }, []);

  return (
    <div className="App">
      <p>{data.name}</p>
    </div>
  );
}
