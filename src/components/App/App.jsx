import React, { useState, useEffect, useRef, Fragment } from "react";
import Button from "react-bootstrap/Button";
import ForecastSection from "../Forecast/Forecast";
import "./App.css";
import searchIcon from "../../assets/search-icon.svg";
import locationIcon from "../../assets/location-icon.svg";
import thermometerIcon from "../../assets/thermometer-icon.svg";
import waterdropIcon from "../../assets/waterdrop-icon.svg";
import windIcon from "../../assets/wind-icon.svg";
import sunriseIcon from "../../assets/sunrise-icon.svg";
import sunsetIcon from "../../assets/sunset-icon.svg";
import arrowUpIcon from "../../assets/arrow-up-icon.svg";
import arrowDownIcon from "../../assets/arrow-down-icon.svg";
import moment from "moment";

export default function App() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState("");
  const [units, setUnits] = useState("metric");
  const [error, setError] = useState(null);
  const didMount = useRef(true);
  const inputCityRef = useRef(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchData("initial", units);
    }
  }, [location]);

  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
    } else {
      try {
        fetchData("user input", units);
      } catch {
        setWeatherData([]);
      }
    }
  }, [city]);

  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchData = async (request, units) => {
    try {
      const weatherResponse = await fetchWeatherData(request, units);
      setWeatherData(weatherResponse);
      setCity(weatherResponse.name)
      console.log(weatherResponse);
    } catch (error) {
      console.error(error);
      setWeatherData([]);
    }
  };

  const fetchWeatherData = async (request, units) => {
    setUnits(units);
    setError(null);
    const endpoint =
      request === "initial"
        ? `weather?lat=${location.lat}&lon=${location.lon}`
        : `weather?q=${city}`;
    const weatherResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/${endpoint}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=${units}`
    );
    if (!weatherResponse.ok) {
      setError(true);
      throw new Error("Wrong request parameters...");
    }
    const weatherResult = await weatherResponse.json();
    return weatherResult;
  };

  const handleKeyDown = (event) => {
    let inputValue = inputCityRef.current.value;
    if (inputValue !== "" && (event.key === "Enter" || event.button === 0)) {
      const selectedCity = (
        inputValue.charAt(0).toUpperCase() + inputValue.slice(1)
      ).trim();
      setCity(selectedCity);
      inputCityRef.current.value = "";
    }
  };

  const getCurrentCityTime = () => {
    const currentDate = `${moment().format(
      "dddd, D MMMM YYYY"
    )} | Local Time: `;
    const timezoneInMinutes = weatherData.timezone / 60;
    const currentTime = moment().utcOffset(timezoneInMinutes).format("HH:mm");
    return currentDate + currentTime;
  };

  const getCurrentCitySunriseSunset = (request) => {
    const timezone = weatherData.timezone;
    const dataSunrise = weatherData.sys.sunrise;
    const dataSunset = weatherData.sys.sunset;

    let currentSunrise = moment
      .utc(dataSunrise, "X")
      .add(timezone, "seconds")
      .format("HH:mm");
    let currentSunset = moment
      .utc(dataSunset, "X")
      .add(timezone, "seconds")
      .format("HH:mm");

    return request === "sunrise" ? currentSunrise : currentSunset;
  };

  return (
    <div className="app d-flex flex-column align-items-center mx-0 px-3 pb-3">
      <div className="input-container col-12 d-flex justify-content-center align-items-center my-3 px-0">
        <div className="d-flex flex-row">
          <input
            className="input-city border-0"
            type="text"
            onKeyDown={handleKeyDown}
            placeholder="Search for a city..."
            ref={inputCityRef}
          />
          <Button
            className="input-container-button bg-transparent d-flex align-items-center border-0 py-0"
            onClick={handleKeyDown}
          >
            <img className="search-city-icon" src={searchIcon} alt="" />
          </Button>
          <Button
            className="input-container-button bg-transparent d-flex align-items-center border-0 py-0"
            onClick={() => {
              fetchData("initial", units);
            }}
          >
            <img src={locationIcon} alt="" />
          </Button>
        </div>
        <div className="units-container">
          <Button
            className="bg-transparent border-0"
            onClick={() => {
              fetchData("user input", "metric");
            }}
          >
            &#176;C
          </Button>
          <span>|</span>
          <Button
            className="bg-transparent border-0"
            onClick={() => {
              fetchData("user input", "imperial");
            }}
          >
            &#176;F
          </Button>
        </div>
      </div>
      {error === null && (
        <div className="weather-info col-xs-12 col-sm-10 col-md-8 col-lg-6 d-flex flex-column align-items-center px-0">
          {weatherData.main ? (
            <Fragment>
              <p className="current-datetime fw-normal my-2 text-center">
                {getCurrentCityTime()}
              </p>
              <p className="current-city fw-bold">{`${weatherData.name}, ${weatherData.sys.country}`}</p>
              <p className="weather-main my-4">{weatherData.weather[0].main}</p>
              <div className="w-100 row justify-content-between align-items-center">
                <div className="col d-flex justify-content-center">
                  <img
                    className="weather-main-icon"
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt=""
                  />
                </div>
                <p className="weather-temp col text-center">
                  {Math.round(weatherData.main.temp)}&#176;
                </p>
                <div className="col">
                  <div className="d-flex justify-content-center my-2">
                    <img className="me-2" src={thermometerIcon} alt="" />
                    <p>
                      Feels like: {Math.round(weatherData.main.feels_like)}
                      &#176;
                    </p>
                  </div>
                  <div className="d-flex justify-content-center my-2">
                    <img className="me-2" src={waterdropIcon} alt="" />
                    <p>Humidity: {weatherData.main.humidity}%</p>
                  </div>
                  <div className="d-flex justify-content-center my-2">
                    <img className="me-2" src={windIcon} alt="" />
                    <p>Wind: {Math.round(weatherData.wind.speed)} m/s</p>
                  </div>
                </div>
              </div>
              <div className="additional-weather-info w-100 d-flex justify-content-between my-5">
                <div className="d-flex">
                  <img className="me-2" src={sunriseIcon} alt="" />
                  <p>Rise: {getCurrentCitySunriseSunset("sunrise")}</p>
                </div>
                <span className="align-middle">&nbsp;|&nbsp;</span>
                <div className="d-flex">
                  <img className="me-2" src={sunsetIcon} alt="" />
                  <p>Set: {getCurrentCitySunriseSunset("sunset")}</p>
                </div>
                <span className="align-middle">&nbsp;|&nbsp;</span>
                <div className="d-flex">
                  <img className="me-2" src={arrowUpIcon} alt="" />
                  <p>High: {Math.round(weatherData.main.temp_max)}&#176;</p>
                </div>
                <span className="align-middle">&nbsp;|&nbsp;</span>
                <div className="d-flex">
                  <img className="me-2" src={arrowDownIcon} alt="" />
                  <p>Low: {Math.round(weatherData.main.temp_min)}&#176;</p>
                </div>
              </div>
              <p className="w-100 fw-bold text-left">3-HOUR FORECAST</p>
              <span className="forecast-splitting-line w-100 my-3"></span>
              <ForecastSection
                city={weatherData.name}
                type={"3-hour"}
                units={units}
              />

              <p className="w-100 fw-bold text-left mt-4">DAILY FORECAST</p>
              <span className="forecast-splitting-line w-100 my-3"></span>
              <ForecastSection
                city={weatherData.name}
                type={"daily"}
                units={units}
              />
            </Fragment>
          ) : null}
        </div>
      )}
      {error !== null && <p>There is no such city: "{city}"</p>}
    </div>
  );
}
