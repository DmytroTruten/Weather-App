import React, { useState, useEffect, useRef, Fragment } from "react";
import Button from "react-bootstrap/Button";
import ForecastSection from "../Forecast/Forecast";
import "./App.css";
import searchIcon from "../../assets/search-icon.svg";
import moment from "moment";

export default function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState("");
  const didMount = useRef(true);
  const inputCityRef = useRef(null);

  const fetchData = async () => {
    const weatherResponse = await fetchWeatherData();
    setWeatherData(weatherResponse);
    console.log(weatherResponse);
  };

  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
    } else {
      try {
        fetchData();
      } catch {
        setWeatherData([]);
      }
    }
  }, [city]);

  const fetchWeatherData = async () => {
    const weatherResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/weather?q=${city}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=metric`
    );
    if (!weatherResponse.ok) {
      throw new Error("There is no such city...");
    }
    const weatherResult = await weatherResponse.json();
    return weatherResult;
  };

  const handleKeyDown = (event) => {
    let inputValue = inputCityRef.current.value;
    if (event.key === "Enter" || event.button === 0) {
      const selectedCity =
        inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
      setCity(selectedCity);
      inputCityRef.current.value = "";
    }
  };

  const getCurrentCityTime = () => {
    const currentDate = `${moment().format(
      "dddd, D MMMM YYYY"
    )} | Local Time: `;
    const timezoneInMinutes = weatherData.timezone / 60;
    const currentTime = moment().utcOffset(timezoneInMinutes).format("h:mm A");
    return currentDate + currentTime;
  };

  const getCurrentCitySunriseSunset = (request) => {
    const timezone = weatherData.timezone;
    const dataSunrise = weatherData.sys.sunrise;
    const dataSunset = weatherData.sys.sunset;

    let currentSunrise = moment
      .utc(dataSunrise, "X")
      .add(timezone, "seconds")
      .format("HH:mm A");
    let currentSunset = moment
      .utc(dataSunset, "X")
      .add(timezone, "seconds")
      .format("HH:mm A");

    return request === "sunrise" ? currentSunrise : currentSunset;
  };

  return (
    <div className="app d-flex flex-column align-items-center">
      <div className="input-container d-flex align-items-center">
        <input
          className="input-city border-0"
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Search for a city..."
          ref={inputCityRef}
        />
        <Button
          className="search-city-button btn bg-transparent d-flex align-items-center border-0 py-0"
          onClick={handleKeyDown}
        >
          <img className="search-city-icon" src={searchIcon} alt="" />
        </Button>
      </div>
      <div className="weather-info d-flex flex-column align-items-center">
        {weatherData.main ? (
          <Fragment>
            <p className="fw-light">{getCurrentCityTime()}</p>
            <p className="fw-bold">{`${city}, ${weatherData.sys.country}`}</p>
            <p className="weather-main">{weatherData.weather[0].main}</p>
            <div className="w-50% d-flex justify-content-between align-items-center">
              <p className="weather-temp">{weatherData.main.temp}&#176;</p>
              <div>
                <p>Feels like: {weatherData.main.feels_like}&#176;</p>
                <p>Humidity: {weatherData.main.humidity}</p>
                <p>Wind: {weatherData.wind.speed} meter/sec</p>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <p>Rise: {getCurrentCitySunriseSunset("sunrise")}</p>
              <p>Set: {getCurrentCitySunriseSunset("sunset")}</p>
              <p>Low: {weatherData.main.temp_min}&#176;</p>
              <p>High: {weatherData.main.temp_max}&#176;</p>
            </div>
            <ForecastSection city={city} />
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}
