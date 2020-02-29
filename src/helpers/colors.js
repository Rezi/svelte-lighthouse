export function getColors(locals, sunAngleDeg) {
  const itemScrolled = Math.floor(locals.scrollFromLeft / locals.columnWidth);

  const scrolledForecast = locals.dataSet.list[itemScrolled];

  const cloudsInPercent =
    (scrolledForecast.clouds && scrolledForecast.clouds.all) || 0;

  const saturation = 20 + (100 - cloudsInPercent) * 0.5; // saturation 20 - 70% depending on clouds

  let lightness = sunAngleDeg < -5 ? -5 : sunAngleDeg; // start 5deg below horizon
  lightness += 5; // ensure we start with lightness of at least 0
  lightness = lightness > 100 ? 100 : lightness; // 0 - 100

  const lightnessTo16 = lightness / 6.25; // 0 - 16
  const lightnessExponential = Math.pow(lightnessTo16, 0.25); // 0-2;  1 => 1,  16 => 2
  const lightnessExponential8To60 = lightnessExponential * 26 + 8;
  const moonOpacity01To1 = 1 - lightnessExponential * 0.45;
  const starsOpacity0To1 = 1 - lightnessExponential - cloudsInPercent / 100;

  const cloudBrightness = lightnessExponential / 2.06 + 0.12;

  const darkness = 1 - lightness / 100;

  const groundTopHueMax = 38;
  const groundBottomHueMax = 260;
  const groundTopHue = groundTopHueMax + lightnessExponential8To60;
  const groundBottomHue = groundBottomHueMax - lightnessExponential8To60 * 1.5;
  const groundLightness = Math.pow(lightnessExponential8To60, 0.85);
  const groundTopHsl = `hsl(${groundTopHue}, ${saturation +
    20}%, ${groundLightness}%)`;
  const groundBottomHsl = `hsl(${groundBottomHue}, ${saturation +
    20}%, ${groundLightness}%)`;

  const skyTopHueMax = 243;
  const skyBottomHueMax = 223;
  const skyTopHue = skyTopHueMax - lightnessExponential8To60 * 0.8;
  const skyBottomHue = skyBottomHueMax - lightnessExponential8To60 * 0.8;
  const skyTopHsl = `hsl(${skyBottomHue}, ${saturation}%, ${lightnessExponential8To60}%)`;
  const skyBottomHsl = `hsl(${skyTopHue}, ${saturation}%, ${lightnessExponential8To60}%)`;
  const skyHalo = `hsla(0, 0%, 0%, ${darkness})`;

  return {
    groundTopHsl,
    groundBottomHsl,
    moonOpacity01To1,
    starsOpacity0To1,
    cloudBrightness,
    skyTopHsl,
    skyBottomHsl,
    skyHalo
  };
}
