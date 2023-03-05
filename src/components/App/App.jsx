import React, { useState, useEffect, useRef, Fragment } from "react";
import Button from "react-bootstrap/Button";
import "./App.css";
import searchIcon from "../../assets/search-icon.svg";
export default function App() {
  const [data, setData] = useState([]);
  const [city, setCity] = useState("");
  const didMount = useRef(true);
  const inputCityRef = useRef(null);

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
    const inputValue = inputCityRef.current.value;
    if (event.key === "Enter" || event.button === 0) {
      setCity(inputValue.charAt(0).toUpperCase() + inputValue.slice(1));
    }
  };

  return (
    <div className="app">
      <div className="input-container d-flex align-items-center">
        <input
          className="input-city border-light"
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Search for a city..."
          ref={inputCityRef}
        />
        <Button
          className="search-city-button btn bg-transparent border-0 py-0"
          onClick={handleKeyDown}
        >
          <img className="search-city-icon" src={searchIcon} alt="" />
        </Button>
      </div>
      {data.main ? (
        <Fragment>
          <p>{city}</p>
          <p>Current temperature: {data.main.temp} </p>
          <p>Minimum: {data.main.temp_min}</p>
          <p>Maximum: {data.main.temp_max}</p>
          <p>Feels like: {data.main.feels_like}</p>
          <p>Humidity: {data.main.humidity}</p>
        </Fragment>
      ) : null}
    </div>
  );
}
