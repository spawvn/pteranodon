import React from "react";
import moment from "moment";
import "./App.css";
import CityWeather from "./Components/CityWeather";
import DemoHot from "./DemoData/hot";
import DemoCold from "./DemoData/cold";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      userName: "Jamie",
      cities: [
        { name: "Amsterdam", id: 249758 },
        { name: "Madrid", id: 308526 },
        { name: "Budapest", id: 187423 }
      ],
      isWeatherLoading: false,
      weatherData: {},
      demoMode: false
    };
  }

  statics = {
    weatherEndpoint:
      "http://dataservice.accuweather.com/forecasts/v1/daily/1day/",
    weatherParams: {
      apikey: "aGrPwpwrDSfTi0dL9yrpLhcSQ6eOLQIi",
      metric: true
    }
  };

  getForecasts = async cities => {
    this.setState({
      isWeatherLoading: true,
      weatherData: {}
    });

    const requests = cities.map(({ id }) => {
      return this.getCityForecast(id);
    });

    await Promise.all(requests)
      .then(() => {
        this.setState({
          isWeatherLoading: false
        });
      })
      .catch(function(error) {
        console.error("Request failed", error);
      });
  };

  getCityForecast(cityKey) {
    const { weatherEndpoint, weatherParams } = this.statics;
    const cached = localStorage.getItem(`weather_${cityKey}`);

    if (cached !== null) {
      const weatherData = JSON.parse(cached);
      this.setState(() => {
        return { weatherData };
      });
      return weatherData;
    } else {
      return fetch(
        `${weatherEndpoint}${cityKey}?${new URLSearchParams(weatherParams)}`,
        {
          method: "GET"
        }
      )
        .then(response => response.json())
        .then(response => {
          this.setCityForecast(cityKey, response);
        });
    }
  }

  setCityForecast(cityKey, payload) {
    const weatherData = this.state.weatherData;
    weatherData[cityKey] = { ...payload, TimeStamp: moment() };
    this.setState(() => {
      return { weatherData };
    });
    localStorage.setItem(`weather_${cityKey}`, JSON.stringify(weatherData));
  }

  getWeatherData() {
    if (this.state.demoMode === "hot") return DemoHot;
    if (this.state.demoMode === "cold") return DemoCold;
    else return this.state.weatherData;
  }

  setDemo(mode) {
    this.setState({
      demoMode: mode
    });
  }

  componentDidMount() {
    const { cities } = this.state;
    this.getForecasts(cities);
  }

  render() {
    const { userName, cities } = this.state;
    const weatherData = this.getWeatherData();

    return (
      <div className="app">
        <header className="app-header">
          <p>
            Hello, <span className="username">{userName}</span>.
            <br />
            Here's what mother nature has got for us:
          </p>
        </header>
        <section className="app-body">
          {cities.map(({ name, id }) => (
            <CityWeather key={id} name={name} data={weatherData[id]} />
          ))}
        </section>
        <section className="app-footer">
          <button onClick={() => this.setDemo("hot")}>Demo hot</button>
          &nbsp;
          <button onClick={() => this.setDemo("cold")}>Demo cold</button>
          &nbsp;
          <button onClick={() => this.setDemo(false)}>Demo off</button>
        </section>
      </div>
    );
  }
}

export default App;
