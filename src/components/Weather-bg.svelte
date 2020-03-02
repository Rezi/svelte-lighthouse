<script>
  export let skyBottomHsl;
  export let skyTopHsl;
  export let skyHalo;
</script>

<style type="text/scss">
  @import "../variables.scss";

  .weather-bg-radial {
    height: 100vh;
  }

  .weather-bg {
    top: 0;
    left: 0;
    width: 100vw;
    position: fixed;
  }
</style>

<div
  class="weather-bg weather-bg-linear"
  style="background: linear-gradient( 0deg, {skyBottomHsl} 0%, {skyTopHsl} 100%
  );">
  <div
    class="weather-bg-radial"
    style="background: radial-gradient( circle at 20% 25%, rgba(0, 0, 0, 0) 0%, {skyHalo}
    100% );" />
</div>
