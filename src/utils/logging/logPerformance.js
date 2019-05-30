const logPerformance = (func, name) => (...args) => {
  const t1 = performance.now();
  const value = func(...args);
  const t2 = performance.now();
  console.log(`${name} Time: `, t2 - t1);
  return value;
};

export default logPerformance;
