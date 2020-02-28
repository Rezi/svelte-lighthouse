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
    !!window &&
    (typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1)
  );
}

export function hasWorkerSupport() {
  return !!window && !!window.Worker;
}
