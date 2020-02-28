import * as Comlink from 'comlink';
import { sunCalc } from '../helpers/suncalc';

const workerFunctions = {
  animateSun(date, animationKey, coords) {
    const sunPosition = sunCalc.getPosition(date, coords.lat, coords.lon);
    const sunDegAngle = (sunPosition.altitude * 100) / (Math.PI / 2);
    const sunBottomPosition = sunDegAngle + 14 + 'vh'; // 14 is extra for the bottom terrain
    const sunLeftPosition = (sunPosition.azimuth / Math.PI) * 50 + 50; // 0 - 100
    return { sunDegAngle, animationKey, sunBottomPosition, sunLeftPosition };
  },
  animateMoon(date, animationKey, locals, moonLeft, moonRight) {
    let moonPhase = sunCalc.getMoonIllumination(date).phase; // 0 - 1;

    if (animationKey) {
      moonLeft = moonPhase < 0.5 ? 7.8 - moonPhase * 31.2 : -7.8;
      moonRight = moonPhase >= 0.5 ? 7.8 - (moonPhase - 0.5) * 31.2 : 7.8;
    }

    locals.prevMoonPhase = moonPhase;

    const coords = locals.dataSet.city.coord;
    const moonPosition = sunCalc.getMoonPosition(date, coords.lat, coords.lon);

    moonBottomPosition =
      (moonPosition.altitude * 100) / (Math.PI / 2) + 14 + 'vh'; // 14 is extra for the bottom terrain

    moonLeftPosition = (moonPosition.azimuth / Math.PI) * 50 + 50; // 0 - 100

    moonRotationDeg = (moonPosition.parallacticAngle * 180) / Math.PI;
    // max = Pi/2 rad

    return {
      moonBottomPosition,
      moonLeftPosition,
      moonRotationDeg,
      moonLeft,
      moonRight
    };
  }
};

Comlink.expose(workerFunctions);
