<script>
  import { Moon } from "../helpers/moon-functions";
  import { forecastMock } from "../helpers/mock";
  // let moonPhase;
  let moonLeft;
  let moonRight;

  const moon = new Moon();
  const forecastUrl =
    "http://api.openweathermap.org/data/2.5/forecast?q=_city_&APPID=a77e1d2fcad267b4ba535bd5fd05b6e7";

  const fetchForecast = async city => {
    /*  const urlWithCity = forecastUrl.replace("_city_", city);
    const response = await fetch(urlWithCity);
    const data = await response.json(); */

    const data = forecastMock;
    console.log(data);

    let count = 1;

    let prevMoonPhase = moon.phase(2020, 1, count - 1).phase;
    let interval;
    const framerate = 30;

    setInterval(() => {
      const result = moon.phase(2020, 1, count);
      let moonPhase = result.phase; // 0 - 7;

      let difference = moonPhase - prevMoonPhase;
      if (difference < 0) difference = 8 - prevMoonPhase;
      let tickDifference = difference / framerate;

      clearInterval(interval);
      interval = setInterval(() => {
        moonLeft = moonPhase < 4 ? 7.8 - moonPhase * 3.9 : -7.8;
        moonRight = moonPhase >= 4 ? 7.8 - (moonPhase - 4) * 3.9 : 7.8;

        if (moonPhase + tickDifference <= 8) moonPhase += tickDifference;
      }, 1000 / framerate);

      prevMoonPhase = moonPhase;
      count++;
    }, 1000);
  };

  fetchForecast("Hlavní město Praha");
</script>

<style type="text/scss">
  .svg-def {
    position: absolute;
    width: 0;
    height: 0;
  }

  .star {
    width: 70px;
    height: 70px;
    fill: #cafbff;
  }
  .sun {
    width: 250px;
    height: 250px;
    fill: #ffdd40;
  }
  .moon {
    width: 200px;
    height: 200px;
    fill: #ffed9c;
  }

  .glow-filter {
    filter: url("#strokeGlow");
    -webkit-filter: url("#strokeGlow");
  }

  .weather-bg-linear {
    background: rgb(0, 215, 250);
    background: linear-gradient(
      0deg,
      rgb(157, 92, 183) 0%,
      rgb(48, 24, 84) 100%
    );

    /* linear-gradient( 0deg, rgb(64, 0, 90) 0%, rgb(127, 95, 175) 100% ); */
  }
  .weather-bg-radial {
    background: rgb(63, 94, 251);
    background: radial-gradient(
      circle at 30% 40%,
      rgba(63, 94, 251, 0) 0%,
      rgba(0, 0, 0, 0.61) 100%
    );
  }

  .weather-bg-radial {
    height: 100vh;
  }

  .weather-bg,
  .weather-scroll {
    top: 0;
    left: 0;
    width: 100vw;
    position: fixed;
  }

  .weather-scroll {
    display: flex;
    overflow-y: hidden;
    height: 100vh;
  }

  .weather-column {
    flex: 1 0 100vw;
    max-width: 30rem;
  }
</style>

<svg class="svg-def">
  <defs>

    <filter id="strokeGlow" y="-10" x="-10" width="1000" height="1000">

      <feOffset in="StrokePaint" dx="0" dy="0" result="centeredOffset" />

      <feGaussianBlur in="centeredOffset" stdDeviation="1.5" result="blur1" />
      <feGaussianBlur in="centeredOffset" stdDeviation="4" result="blur2" />

      <feMerge>

        <feMergeNode in="blur1" />
        <feMergeNode in="blur2" />

        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

  </defs>
</svg>

<div class="weather-bg weather-bg-linear">
  <div class="weather-bg-radial">

    <svg class="star" viewBox="0 0 32 32">

      <path
        class="glow-filter"
        d="M21.557 14.914l-3.635-0.528-1.625-3.293-1.625 3.293-3.635 0.528 2.63
        2.564-0.621 3.62 3.251-1.709 3.251 1.709-0.621-3.62z" />

    </svg>
    <svg class="moon" viewBox="0 0 32 32">

      <path
        class="glow-filter"
        d="M16.034 21.918c{moonLeft} 0.000 {moonLeft} -11.743 0-11.741 {moonRight}
        0.023 {moonRight} 11.743 0 11.741z" />
      <!--  <path
        class="glow-filter"
        d="M16.034 21.918c-7.812 0.072-7.812-11.743 0-11.741 7.792 0.023 7.792
        11.743 0 11.741z" /> -->

    </svg>
    <svg class="sun" viewBox="0 0 32 32">

      <path
        class="glow-filter"
        d="M22.589 15.229l0.051 1.010-2.813 0.142-0.051-1.010zM21.312
        12.035l0.525 0.865-2.408 1.463-0.525-0.865zM18.477 9.895l0.911
        0.439-1.223 2.538-0.911-0.439zM15.059 9.479l1.010-0.051 0.142
        2.813-1.010 0.051zM11.805 10.945l0.81-0.606 1.687 2.256-0.81
        0.606zM9.807 13.712l0.439-0.911 2.538 1.223-0.439 0.911zM9.524
        17.277l-0.149-1.001 2.786-0.416 0.149 1.001zM11 20.366l-0.602-0.813
        2.264-1.676 0.602 0.813zM13.829 22.314l-0.915-0.432 1.204-2.547 0.915
        0.432zM17.394 22.515l-1.001 0.149-0.416-2.786 1.001-0.149zM20.457
        20.974l-0.813 0.602-1.676-2.264 0.813-0.602zM22.35 17.95l-0.341
        0.952-2.652-0.95 0.341-0.952zM19.055 16.043c0 1.678-1.36 3.038-3.038
        3.038s-3.038-1.36-3.038-3.038c0-1.678 1.36-3.038 3.038-3.038s3.038 1.36
        3.038 3.038z" />

    </svg>
  </div>
</div>

<div class="weather-scroll">
  {#each forecastMock.list as forecast}
    <div class="weather-column">{forecast.weather[0].main}</div>
  {/each}
</div>
