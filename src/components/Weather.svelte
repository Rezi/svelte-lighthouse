<script>
  import { sunCalc } from "../helpers/suncalc";
  import { forecastMock } from "../helpers/mock";
  import { onMount } from "svelte";
  import Cloud from "../components/Cloud.svelte";

  const forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=_city_&APPID=a77e1d2fcad267b4ba535bd5fd05b6e7";

  let moonLeft = 0;
  let moonRight = 0;
  let fromLeft = 0;
  let elWeatherColumnWidth;
  let elWeatherColumnHeight;
  let elWeatherColumns;
  let dataSet;
  let prevMoonPhase;
  let nearestForecastDate;
  let fakeColumnBefore = 0;
  let fakeColumnAfter = 0;

  let moonBottomPosition;
  let moonLeftPosition;
  let moonRotationDeg;
  let moonOpacity01To1;

  let sunBottomPosition;
  let sunLeftPosition;
  let sunDegAngle;
  let sunFromLeft;

  let groundTopHsl;
  let groundBottomHsl;

  let skyTopHsl;
  let skyBottomHsl;
  let skyHalo;

  let scrollDate = new Date();
  let scrollLeftGrouped = 0;
  let dateTime = scrollDate;
  let date;
  let day;
  let isMobile;
  let stars = [];
  let starsOpacity0To1 = 0;

  let baseCloudBall = 70;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  onMount(() => {
    const secondColumn = elWeatherColumns.childNodes[2];
    elWeatherColumnWidth = secondColumn.clientWidth;
    elWeatherColumnHeight = secondColumn.clientHeight;

    isMobile = isMobileDevice();
    fetchForecast("Hlavní město Praha");
    generateStars();
  });

  function isMobileDevice() {
    return false;
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  }

  function generateStars() {
    const tempStars = [];
    for (let i = 0; i < 20; i++) {
      tempStars.push(
        `transform:scale(${Math.random()}) translate(${Math.random() *
          100}vw, ${Math.random() * 85}vh)`
      );
    }

    stars = [...tempStars];
  }

  function weatherScroll(event) {
    fromLeft = event.target.scrollLeft;
    let animationKey = false;
    // only trigger animation each 50px of scrolling, 50px transitions are made by css transitions
    if (
      fromLeft > scrollLeftGrouped + 50 ||
      fromLeft < scrollLeftGrouped - 50
    ) {
      scrollLeftGrouped = fromLeft;
      animationKey = true;
    }
    window.requestAnimationFrame(() => {
      countOnScrollFrame(fromLeft, animationKey);
    });
  }

  function setDefaultValues(data) {
    nearestForecastDate = new Date(data.list[0].dt_txt);
    prevMoonPhase = sunCalc.getMoonIllumination(nearestForecastDate).phase;
  }

  function animateMoon(date, animationKey) {
    let moonPhase = sunCalc.getMoonIllumination(date).phase; // 0 - 1;

    if (animationKey) {
      moonLeft = moonPhase < 0.5 ? 7.8 - moonPhase * 31.2 : -7.8;
      moonRight = moonPhase >= 0.5 ? 7.8 - (moonPhase - 0.5) * 31.2 : 7.8;
    }

    prevMoonPhase = moonPhase;

    const coords = dataSet.city.coord;
    const moonPosition = sunCalc.getMoonPosition(date, coords.lat, coords.lon);

    moonBottomPosition =
      (moonPosition.altitude * 100) / (Math.PI / 2) + 14 + "vh"; // 14 is extra for the bottom terrain

    moonLeftPosition = (moonPosition.azimuth / Math.PI) * 50 + 50; // 0 - 100

    moonRotationDeg = (moonPosition.parallacticAngle * 180) / Math.PI;
    // max = Pi/2 rad
  }
  function animateSun(date, animationKey) {
    const coords = dataSet.city.coord;

    const sunPosition = sunCalc.getPosition(date, coords.lat, coords.lon);
    sunDegAngle = (sunPosition.altitude * 100) / (Math.PI / 2);
    sunBottomPosition = sunDegAngle + 14 + "vh"; // 14 is extra for the bottom terrain

    sunLeftPosition = (sunPosition.azimuth / Math.PI) * 50 + 50; // 0 - 100
  }

  function colors(sunAngleDeg, animationKey) {
    const itemScrolled = Math.floor(fromLeft / elWeatherColumnWidth);
    const scrolledForecast = dataSet.list[itemScrolled];
    if (scrolledForecast) {
      const cloudsInPercent =
        (scrolledForecast.clouds && scrolledForecast.clouds.all) || 0;

      const saturation = 20 + (100 - cloudsInPercent) * 0.5; // saturation 20 - 70% depending on clouds
      // const saturation = 100; // saturation 20 - 70% depending on clouds

      let lightness = sunAngleDeg < -5 ? -5 : sunAngleDeg; // start 5deg below horizon
      lightness += 5; // ensure we start with lightness of at least 0
      lightness = lightness > 100 ? 100 : lightness; // 0 - 100

      const lightnessTo16 = lightness / 6.25; // 0 - 16
      const lightnessExponential = Math.pow(lightnessTo16, 0.25); // 0-2;  1 => 1,  16 => 2
      const lightnessExponential8To60 = lightnessExponential * 26 + 8;
      moonOpacity01To1 = 1 - lightnessExponential * 0.45;
      starsOpacity0To1 = 1 - lightnessExponential - cloudsInPercent / 105;

      const darkness = 1 - lightness / 100;

      const groundTopHueMax = 38;
      const groundBottomHueMax = 260;
      const groundTopHue = groundTopHueMax + lightnessExponential8To60;
      const groundBottomHue =
        groundBottomHueMax - lightnessExponential8To60 * 1.5;
      const groundLightness = Math.pow(lightnessExponential8To60, 0.85);
      groundTopHsl = `hsl(${groundTopHue}, ${saturation +
        20}%, ${groundLightness}%)`;
      groundBottomHsl = `hsl(${groundBottomHue}, ${saturation +
        20}%, ${groundLightness}%)`;

      const skyTopHueMax = 243;
      const skyBottomHueMax = 223;
      const skyTopHue = skyTopHueMax - lightnessExponential8To60 * 0.8;
      const skyBottomHue = skyBottomHueMax - lightnessExponential8To60 * 0.8;
      skyTopHsl = `hsl(${skyTopHue}, ${saturation}%, ${lightnessExponential8To60}%)`;
      skyBottomHsl = `hsl(${skyBottomHue}, ${saturation}%, ${lightnessExponential8To60}%)`;
      skyHalo = `hsla(0, 0%, 0%, ${darkness})`;
    }
  }

  function countOnScrollFrame(scrollLeft, animationKey) {
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const onePxInMs = threeHoursInMs / elWeatherColumnWidth;
    scrollDate = new Date(
      nearestForecastDate.getTime() + onePxInMs * scrollLeft
    );

    //if (animationKey) {
    dateTime = scrollDate;
    // }

    const newDay = days[scrollDate.getDay()];

    if (day !== newDay) {
      day = newDay;
      date = scrollDate.toLocaleDateString();
    }

    animateMoon(scrollDate, animationKey);
    animateSun(scrollDate, animationKey);
    colors(sunDegAngle, animationKey);
  }

  const fetchForecast = async city => {
    const urlWithCity = forecastUrl.replace("_city_", city);
    const response = await fetch(urlWithCity);
    dataSet = await response.json();

    // dataSet = forecastMock;
    setDefaultValues(dataSet);

    // make initial render
    countOnScrollFrame(0, true);
  };
</script>

<style type="text/scss">
  $cardinalDirectionsShift: 1rem;

  .svg-def {
    position: absolute;
    width: 0;
    height: 0;
  }
  .stars {
    .star {
      fill: #cafbff;
      position: absolute;
      top: 0;
      left: 0;
      width: 3vh;
      height: 3vh;
    }
  }

  .sun {
    $sunnWidth: 14vh;
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: $cardinalDirectionsShift;

    //transition: all 0.5s;

    .sun-svg {
      width: $sunnWidth * 2.75;
      height: $sunnWidth * 2.75;
      fill: #ffdd40;
      transform: translate(-50%, -50%);
    }
  }

  .moon {
    $moonWidth: 10vh;
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    padding-left: $cardinalDirectionsShift;
    //transition: all 0.5s;

    .moon-svg {
      width: $moonWidth * 2.75;
      height: $moonWidth * 2.75;
      fill: #ffed9c;
      transform: translate(-50%, -50%);
    }

    .moon-bg {
      position: absolute;
      transform: translate(-50%, -50%);
      background-color: rgba(200, 200, 200, 0.015);
      width: $moonWidth;
      height: $moonWidth;
      border-radius: 50%;
    }
  }

  .glow-filter {
    filter: url("#strokeGlow");
    -webkit-filter: url("#strokeGlow");
  }

  .weather-bg-radial {
    height: 100vh;
  }

  .weather-bg {
    top: 0;
    left: 0;
    width: 100vw;
    position: fixed;
  }

  .weather-scroll {
    display: flex;
    overflow-y: hidden;
    height: 100vh;
    position: relative;
  }

  .weather-column {
    flex: 1 0 10rem;

    .forecast {
      font-size: 1.2rem;
      position: relative;
      top: calc(12vh + 5rem);
      text-align: center;
      color: wheat;
    }
  }
  .date-time {
    position: absolute;
    top: 6vh;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: wheat;

    .day {
      font-size: 2rem;
    }

    .date {
      font-size: 1rem;
    }

    .separator {
      color: rgb(49, 49, 49);
    }
    .realtime {
      padding-left: 0.3rem;
      font-size: 2rem;
    }
  }

  .ground {
    $size: 300vh; // earth diameter
    position: absolute;
    height: $size;
    width: $size;
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(#{-$size} + 20vh);
    /*  background: rgb(0, 47, 0);
    background: radial-gradient(
      circle closest-side,
      hsl(260, 73%, 22%) 85%,
      hsl(58, 16%, 41%) 100%
    ); */

    border-radius: 50%;
  }

  .cardinal-directions {
    position: absolute;
    left: 0;
    bottom: calc(1rem + 3vh);
    display: flex;
    width: 100%;
    color: wheat;

    .direction {
      padding-left: $cardinalDirectionsShift;
      width: 25vw;
    }
  }

  .cloud {
    position: absolute;
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

<div
  class="weather-bg weather-bg-linear"
  style="background: linear-gradient( 0deg, {skyBottomHsl} 0%, {skyTopHsl} 100%
  );">
  <div
    class="weather-bg-radial"
    style="background: radial-gradient( circle at 30% 75%, rgba(0, 0, 0, 0) 0%, {skyHalo}
    100% );">

    <div class="stars" style="opacity:{starsOpacity0To1}">
      {#each stars as starStyle}
        <svg class="star" viewBox="0 0 32 32" style={starStyle}>

          <path
            d="M21.557 14.914l-3.635-0.528-1.625-3.293-1.625 3.293-3.635 0.528
            2.63 2.564-0.621 3.62 3.251-1.709 3.251 1.709-0.621-3.62z" />
          <!-- 
        <path
          class:glow-filter={!isMobile}
          d="M21.557 14.914l-3.635-0.528-1.625-3.293-1.625 3.293-3.635 0.528
          2.63 2.564-0.621 3.62 3.251-1.709 3.251 1.709-0.621-3.62z" />
 -->
        </svg>
      {/each}
    </div>
    <div
      class="moon"
      style="opacity:{moonOpacity01To1};transform:translate({moonLeftPosition}vw,-{moonBottomPosition})
      rotate({moonRotationDeg}deg)">
      <div class="moon-bg" />
      <svg class="moon-svg" viewBox="0 0 32 32">

        <path
          class:glow-filter={!isMobile}
          d="M16.034 21.918c{moonLeft} 0.000 {moonLeft} -11.743 0-11.741 {moonRight}
          0.023 {moonRight} 11.743 0 11.741z" />
        <!--  <path
        class="glow-filter"
        d="M16.034 21.918c-7.812 0.072-7.812-11.743 0-11.741 7.792 0.023 7.792
        11.743 0 11.741z" /> -->

      </svg>

    </div>

    <div
      class="sun"
      style="transform: translate({sunLeftPosition}vw,-{sunBottomPosition})
      rotate({sunLeftPosition * -7}deg)">
      <svg class="sun-svg" viewBox="0 0 32 32">
        <path
          class:glow-filter={!isMobile}
          d="M13.795 18.232c0.217 0.24 0.271 0.542 0.121 0.678l-1.082 0.98c-0.15
          0.136-0.445
          0.052-0.662-0.188s-0.271-0.542-0.121-0.678l1.082-0.98c0.15-0.136
          0.445-0.052 0.662 0.188zM15.992 19.217c0.323 0.016 0.575 0.191 0.565
          0.393l-0.072 1.458c-0.010 0.202-0.278 0.352-0.601
          0.336s-0.575-0.191-0.565-0.393l0.072-1.458c0.010-0.202 0.278-0.352
          0.601-0.336zM18.248 18.379c0.24-0.217 0.542-0.271 0.678-0.121l0.98
          1.082c0.136 0.15 0.052 0.445-0.188 0.663s-0.542 0.271-0.678
          0.121l-0.98-1.082c-0.136-0.15-0.052-0.445 0.188-0.663zM19.269
          16.199c0.016-0.323 0.191-0.575 0.393-0.565l1.458 0.072c0.202 0.010
          0.352 0.278 0.336 0.601s-0.191 0.575-0.393
          0.565l-1.458-0.072c-0.202-0.010-0.352-0.278-0.336-0.601zM18.462
          13.922c-0.217-0.239-0.272-0.542-0.123-0.678l1.080-0.982c0.15-0.136
          0.445-0.053 0.663 0.187s0.272 0.542 0.123 0.678l-1.080 0.982c-0.15
          0.136-0.445 0.053-0.663-0.187zM16.309
          12.873c-0.323-0.016-0.575-0.192-0.565-0.394l0.074-1.458c0.010-0.202
          0.279-0.351 0.602-0.335s0.575 0.192 0.565 0.394l-0.074 1.458c-0.010
          0.202-0.279 0.351-0.602 0.335zM14.014 13.643c-0.239 0.218-0.542
          0.272-0.678 0.123l-0.982-1.080c-0.136-0.15-0.053-0.445
          0.187-0.663s0.542-0.272 0.678-0.123l0.982 1.080c0.136 0.15 0.053
          0.445-0.187 0.663zM12.93 15.779c-0.016 0.323-0.192 0.575-0.394
          0.565l-1.458-0.074c-0.202-0.010-0.351-0.278-0.335-0.602s0.192-0.575
          0.394-0.565l1.458 0.074c0.202 0.010 0.351 0.278 0.335 0.602zM18.141
          16.042c0 0 0 0 0 0 0 1.129-0.915 2.045-2.045 2.045v0c-1.129
          0-2.045-0.915-2.045-2.045 0 0 0 0 0 0v0c0-1.129 0.915-2.045
          2.045-2.045v0c1.129 0 2.045 0.915 2.045 2.045v0z" />

      </svg>
    </div>

    <div class="date-time">
      <div class="day">{day}</div>
      <div class="date">
        {date}
        <span class="realtime">
          <span class="separator">|</span>
          {dateTime.toLocaleTimeString(undefined, { timeStyle: 'short' })}
        </span>
      </div>
    </div>

    <div
      class="ground"
      style="background: linear-gradient( 0deg, {groundBottomHsl} 89%, {groundTopHsl}
      100% );" />

    <div class="cardinal-directions">
      <div class="direction">N</div>
      <div class="direction">E</div>
      <div class="direction">S</div>
      <div class="direction">W</div>
    </div>

  </div>
</div>

<div
  class="weather-scroll"
  on:scroll={weatherScroll}
  bind:this={elWeatherColumns}>
  <div class="column-gap" style="width:{fakeColumnBefore}px" />
  {#each forecastMock.list as forecast}
    <div class="weather-column">
      <div class="forecast">
        {new Date(forecast.dt * 1000).toLocaleTimeString(undefined, {
          timeStyle: 'short'
        })}
        <div class="cloud" style="left:-{baseCloudBall / 2}px">

          <Cloud
            columnWidth={elWeatherColumnWidth}
            columnHeight={elWeatherColumnHeight}
            baseCloudBall={(elWeatherColumnHeight * Math.pow(forecast.clouds.all, 0.65)) / 100}
            clouds={forecast.clouds.all}
            rain={(forecast.rain && forecast.rain['3h']) || 0}
            snow={(forecast.snow && forecast.snow['3h']) || 0} />
        </div>

      </div>
    </div>
  {/each}
  <div class="column-gap" style="width:{fakeColumnAfter}px" />
</div>
