<script>
  import ForecastStats from "./Forecast-stats.svelte";

  export let scrollDate;
  export let activeForecast;
  export let city;

  let day;
  let localDate;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  $: getDates(scrollDate);

  function getDates(date) {
    const newDay = days[date.getDay()];

    if (day !== newDay) {
      day = newDay;
      localDate = date.toLocaleDateString();
    }
  }
</script>

<style type="text/scss">
  @import "../../variables.scss";

  .date-time {
    position: absolute;
    top: 4vh;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: $color-base;
    width: 100%;

    .day {
      font-size: 2rem;
    }

    .date {
      font-size: 1rem;
    }

    .separator {
      opacity: 0.3;
    }
    .realtime {
      padding-left: 0.3rem;
      font-size: 2rem;
    }
  }

  .nav {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 1.2rem;

    .city {
      text-transform: capitalize;
    }

    .nav--item {
      text-decoration: none;
      color: $color-active;
      display: flex;
    }

    .search-icon {
      width: 1.2rem;
      margin-right: 0.5rem;
      fill: currentColor;
    }
  }
</style>

<nav class="nav">
  <a href="/" class="nav--item">
    <svg class="search-icon" viewBox="0 0 26 28">
      <title>search</title>
      <path
        d="M18 13c0-3.859-3.141-7-7-7s-7 3.141-7 7 3.141 7 7 7 7-3.141 7-7zM26
        26c0 1.094-0.906 2-2 2-0.531
        0-1.047-0.219-1.406-0.594l-5.359-5.344c-1.828 1.266-4.016 1.937-6.234
        1.937-6.078 0-11-4.922-11-11s4.922-11 11-11 11 4.922 11 11c0 2.219-0.672
        4.406-1.937 6.234l5.359 5.359c0.359 0.359 0.578 0.875 0.578 1.406z" />
    </svg>

    <div class="city">{city}</div>
  </a>
</nav>
<div class="date-time">
  <div class="day">{day}</div>
  <div class="date">
    {localDate}
    <span class="realtime">
      <span class="separator">|</span>
      {scrollDate.toLocaleTimeString(undefined, { timeStyle: 'short' })}
    </span>
  </div>
  {#if activeForecast}
    <ForecastStats {activeForecast} on:statToggle />
  {/if}
</div>
