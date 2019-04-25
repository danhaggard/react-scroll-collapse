const makeColorGradient = (frequency1, frequency2, frequency3,
  phase1, phase2, phase3, center, width, len) => {
  if (center === undefined) {
    center = 128;
  }
  if (width === undefined) {
    width = 127;
  }
  if (len === undefined) {
    len = 50;
  }

  const colorObj = {};
  const r = val => Math.round(val);
  for (let i = 0; i < len; ++i) {
    const red = Math.sin(frequency1*i + phase1) * width + center;
    const grn = Math.sin(frequency2*i + phase2) * width + center;
    const blu = Math.sin(frequency3*i + phase3) * width + center;
    colorObj[i] = [r(red), r(grn), r(blu)];
    // colorArray.push([r(red), r(grn), r(blu)]);
  }
  return colorObj;
};

export default makeColorGradient;
