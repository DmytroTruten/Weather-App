import React, { useState, useEffect, useRef, Fragment } from "react";
import Button from "react-bootstrap/Button";
import ForecastSection from "../Forecast/Forecast";
import "./App.css";
import searchIcon from "../../assets/search-icon.svg";
import thermometerIcon from "../../assets/thermometer-icon.svg";
import waterdropIcon from "../../assets/waterdrop-icon.svg";
import windIcon from "../../assets/wind-icon.svg";
import sunriseIcon from "../../assets/sunrise-icon.svg";
import sunsetIcon from "../../assets/sunset-icon.svg";
import arrowUpIcon from "../../assets/arrow-up-icon.svg";
import arrowDownIcon from "../../assets/arrow-down-icon.svg";
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

  const formatData = (data) => {
    return Math.round(data);
  };

  return (
    <div className="app d-flex flex-column align-items-center mx-0">
      <div className="input-container col-12 d-flex justify-content-center align-items-center px-0">
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
      <div className="weather-info col-xs-12 col-sm-10 col-md-8 col-lg-6 d-flex flex-column align-items-center px-0">
        {weatherData.main ? (
          <Fragment>
            <p className="current-datetime fw-normal my-2">
              {getCurrentCityTime()}
            </p>
            <p className="current-city fw-bold">{`${city}, ${weatherData.sys.country}`}</p>
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
                {formatData(weatherData.main.temp)}&#176;
              </p>
              <div className="col">
                <div className="d-flex justify-content-center my-2">
                  <img className="me-2" src={thermometerIcon} alt="" />
                  <p>
                    Feels like: {formatData(weatherData.main.feels_like)}
                    &#176;
                  </p>
                </div>
                <div className="d-flex justify-content-center my-2">
                  <img className="me-2" src={waterdropIcon} alt="" />
                  <p>Humidity: {weatherData.main.humidity}%</p>
                </div>
                <div className="d-flex justify-content-center my-2">
                  <img className="me-2" src={windIcon} alt="" />
                  <p>Wind: {formatData(weatherData.wind.speed)} m/s</p>
                </div>
              </div>
            </div>
            <div className="w-100 d-flex justify-content-between my-5">
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
                <p>High: {formatData(weatherData.main.temp_max)}&#176;</p>
              </div>
              <span className="align-middle">&nbsp;|&nbsp;</span>
              <div className="d-flex">
                <img className="me-2" src={arrowDownIcon} alt="" />
                <p>Low: {formatData(weatherData.main.temp_min)}&#176;</p>
              </div>
            </div>
            <p className="w-100 fw-bold text-left">3-HOUR FORECAST</p>
            <span className="forecast-splitting-line w-100 my-3"></span>
            <ForecastSection city={city} type={"3-hour"} />

            <p className="w-100 fw-bold text-left mt-4">DAILY FORECAST</p>
            <span className="forecast-splitting-line w-100 my-3"></span>
            <ForecastSection city={city} type={'daily'} />
          </Fragment>
        ) : null}
      </div>
    </div>
  );
}
