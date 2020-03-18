<style type="text/scss">
  @import "../variables.scss";

  :global(html) {
    background-color: $color-bg-sky-bottom;
  }

  .about {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(
      0deg,
      $color-bg-sky-bottom 0%,
      $color-bg-sky-top 100%
    );
    position: relative;
  }

  .back {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 1rem;

    z-index: 2;

    svg {
      fill: $color-active;
      width: 2rem;
      height: 2rem;
    }
  }
  a {
    color: $color-active;
  }

  .text {
    font-size: 1.2rem;
    color: $color-base;
    padding: 4rem 2rem;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>

<section class="about">
  <a href="/" class="back">
    <svg width="512" height="512" viewBox="0 0 512 512">
      <title>Back</title>

      <path
        d="M201.373 438.627l-160-160c-12.497-12.496-12.497-32.758
        0-45.255l160-160c12.497-12.496 32.758-12.496 45.255 0s12.497 32.758 0
        45.255l-105.373 105.373h306.745c17.673 0 32 14.327 32 32s-14.327 32-32
        32h-306.745l105.373 105.373c6.248 6.248 9.372 14.438 9.372 22.627s-3.124
        16.379-9.372 22.627c-12.497 12.497-32.758 12.497-45.255 0z" />
    </svg>

  </a>

  <div class="text">
    <h2>About the weather app</h2>
    <p>
      This app was developed to prove, that production ready SPA app with
      reasonable UX quality can reach max (100%)
      <a href="https://web.dev/measure/">lighthouse score</a>
      .
    </p>
    <p>
      Please DON'T use this app as your weather forecast app, it has limited
      numer of requests allowed to free weather forecast by
      <a href="https://openweathermap.org/">openweathermap.org/</a>
      (60 requests per hour)
    </p>
    <p>
      Made by Tomas Rezac:
      <a href="https://github.com/Rezi/svelte-lighthouse/tree/feature/weather">
        Github repo
      </a>
    </p>
    <p>List of features:</p>
    <ul>

      <li>PWA - works offline with cached data</li>
      <li>Is installable on phone as web app</li>
      <li>Search forecast by city</li>
      <li>Remember searched cities</li>
      <li>Each of six main weather parameters can be visualized as a chart</li>
      <li>
        Show forecast via animated scenery (generated clouds with different
        size, opacity and color based on rain, cloudiness and sun angle)
      </li>
      <li>Show animated rain and show fall, based on it intensity</li>
      <li>Show animated thunderstorms</li>
      <li>Show times of sun/moon rise/set and animate sun/moon accordingly</li>
      <li>Show sun/moon directions from Eeast to West</li>
      <li>
        Show sun/moon angle above horizon based on time and period of year
      </li>
      <li>Show phases of moon in realtime</li>

    </ul>
  </div>
</section>
