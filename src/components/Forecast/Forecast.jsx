import moment from "moment";
import React, { useState, useEffect } from "react";

export default function ForecastSection(props) {
  const [forecastData, setForecastData] = useState([]);

  const fetchData = async () => {
    const units = props.units;
    const forecastResponse = await fetchForecastData(units);
    setForecastData(forecastResponse);
    console.log(forecastResponse);
  };

  useEffect(() => {
    try {
      fetchData();
    } catch {
      setForecastData([]);
    }
  }, [props.city, props.units]);

  const fetchForecastData = async (units) => {
    const forecastResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/forecast?q=${props.city}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=${units}`
    );
    if (!forecastResponse.ok) {
      throw new Error("Something went wrong...");
    }
    const forecastResult = await forecastResponse.json();
    return forecastResult;
  };

  const appendDays = (i) => {
    return `${moment().add(i + 1, "day").format("ddd")}`;
  };

  const appendForecast = () => {
    const forecastArray = [];
    if (props.type === "3-hour") {
      for (let i = 0; i < 5; i++) {
        forecastArray.push(
          <div
            className="forecast-3-hour d-flex flex-column align-items-center"
            key={i}
          >
            <p>{`${moment(forecastData.list[i].dt_txt).format("HH:mm")}`}</p>
            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png`}
              alt=""
            />
            <p>{Math.round(forecastData.list[i].main.temp)}&#176;</p>
          </div>
        );
      }
    } else {
      let dailyForecastArray = [];
      for (let i = 0; i < forecastData.list.length; i++) {
        if (
          moment(forecastData.list[i].dt_txt).format("DD MM yyyy") !==
          moment().format("DD MM yyyy")
        ) {
          dailyForecastArray.push(forecastData.list[i].main.temp_max);
        }
      }

      let subarrays = [
        dailyForecastArray.slice(0, 8),
        dailyForecastArray.slice(8, 16),
        dailyForecastArray.slice(16, 24),
        dailyForecastArray.slice(24, 32),
        dailyForecastArray.slice(32),
      ];
      let maxArray = subarrays.map((subarray) => {
        return Math.max(...subarray);
      });

      for (let i = 0; i < 5; i++) {
        const maxIndex = subarrays[i].indexOf(maxArray[i]);

        forecastArray.push(
          <div
            className="forecast-daily d-flex flex-column align-items-center"
            key={i}
          >
            <p>{appendDays(i)}</p>
            <img
              className="forecast-icon"
              src={`https://openweathermap.org/img/wn/${
                forecastData.list[i * 8 + maxIndex].weather[0].icon
              }@2x.png`}
              alt=""
            />
            <p>{Math.round(maxArray[i])}&#176;</p>
          </div>
        );
      }
    }
    return forecastArray;
  };

  return (
    <div className="forecast-container w-100 d-flex justify-content-between">
      {forecastData.list && forecastData.list.length ? appendForecast() : null}
    </div>
  );
}
