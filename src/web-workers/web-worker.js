import * as Comlink from "comlink";
import { sunCalc } from "../helpers/suncalc";

const workerFunctions = {
  animateSun(date, animationKey, coords) {
    const sunPosition = sunCalc.getPosition(date, coords.lat, coords.lon);
    const sunDegAngle = (sunPosition.altitude * 100) / (Math.PI / 2);
    const sunBottomPosition = sunDegAngle + 14 + "vh"; // 14 is extra for the bottom terrain
    const sunLeftPosition = (sunPosition.azimuth / Math.PI) * 50 + 50; // 0 - 100
    return { sunDegAngle, animationKey, sunBottomPosition, sunLeftPosition };
  }
};

Comlink.expose(workerFunctions);
