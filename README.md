# Weather App

This is a simple weather app that allows users to search for weather information by city name. It uses the [OpenWeather API](https://openweathermap.org/) to retrieve weather data, and displays the current weather conditions, as well as a 3-hour and daily forecast.

## Features

- Search for weather information by city name
- Display current weather conditions, including temperature, humidity, wind speed, and sunrise/sunset times
- Display a 3-hour forecast and a daily forecast
- Toggle between Celsius and Fahrenheit units

## Technologies

This app was built using the following technologies:

- [Vite](https://vitejs.dev/)
- [React.js](https://ru.reactjs.org/)
- [Moment.js](https://momentjs.com/)
- [React-Bootstrap](https://react-bootstrap.netlify.app/)
- [OpenWeatherMap API](https://openweathermap.org/)

## Getting Started

To get started with this app, follow these steps:

1. Clone this repository to your local machine.<br />
2. Run ```npm install``` to install the necessary dependencies.<br />
3. Obtain an API key from the OpenWeatherMap website.<br />
4. Create a ```.env``` file in the root directory of the project.<br />
5. Add your API key and API URL to the ```.env``` file, like this: 

```
VITE_API_KEY = <your_api_key_here>
VITE_API_URL = https://api.openweathermap.org/data/2.5'
```
<br />

6. Run ```npm run dev``` to start the development server.<br />
7. Navigate to ```http://localhost:5173``` to view the app in your browser.

## Usage

To use the app, simply enter the name of the city you want to search for in the input field and press the "Search" button or hit the "Enter" key. The app will display the current weather information for the selected city, along with the 3-hour and daily forecast.

You can also toggle between Celsius and Fahrenheit temperature units by clicking on the respective buttons.
