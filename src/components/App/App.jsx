import React, { useState, useEffect, useRef, Fragment } from "react";
import "./App.css";
export default function App() {
  const [data, setData] = useState([]);
  const [city, setCity] = useState("");
  const didMount = useRef(true);

  const fetchData = async () => {
    const response = await fetchWeatherData();
    setData(response);
    console.log(response);
  };

  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
    } else {
      try {
        fetchData();
      } catch {
        setData([]);
      }
    }
  }, [city]);

  const fetchWeatherData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/weather?q=${city}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=metric`
    );
    if (!response.ok) {
      throw new Error("There is no such city...");
    }
    const result = await response.json();
    return result;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const inputValue = event.target.value;
      setCity(inputValue.charAt(0).toUpperCase() + inputValue.slice(1));
    }
  };

  return (
    <div className="app">
      <input
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="Search for a city..."
      />
      {data.main ? (
        <React.Fragment>
          <p>City: {city}</p>
          <p>Current temperature: {data.main.temp} </p>
          <p>Minimum: {data.main.temp_min}</p>
          <p>Maximum: {data.main.temp_max}</p>
          <p>Feels like: {data.main.feels_like}</p>
          <p>Humidity: {data.main.humidity}</p>
        </React.Fragment>
      ) : null}
    </div>
  );
}
