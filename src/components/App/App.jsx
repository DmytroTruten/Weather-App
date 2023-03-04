import React, { useState, useEffect, useRef } from "react";
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
      fetchData();
    }
  }, [city]);

  const fetchWeatherData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/weather?q=${city}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=metric`
    );
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
      <input type="text" onKeyDown={handleKeyDown} />
      <p>{city}</p>
    </div>
  );
}
