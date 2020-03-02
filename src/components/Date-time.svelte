<script>
  import ForecastStats from "./Forecast-stats.svelte";

  export let scrollDate;
  export let activeForecast;

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
  @import "../variables.scss";

  .date-time {
    position: absolute;
    top: 4vh;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: $colorBase;
    width: 100%;

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
</style>

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
    <ForecastStats {activeForecast} />
  {/if}
</div>
