export function memoize(func) {
  const cache = {};
  return function memoized(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    return (cache[key] = func(...args));
  };
}

export function isMobileDevice() {
  return (
    window &&
    (typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1)
  );
}

export function hasWorkerSupport() {
  return window && !!window.Worker;
}

export const isBrowser = new Function(
  "try {return this === window;}catch(e){return false;}"
);

export function getDateWithShift(dateIsoString, shiftInMinutes) {
  const timeInMyTimezone = new Date(dateIsoString);
  return new Date(
    timeInMyTimezone.setTime(timeInMyTimezone.getTime() + shiftInMinutes * 1000)
  );
}
