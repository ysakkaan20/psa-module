const number = exports;

number.toNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    if (value.trim().length === 0) return null;
    return Number(value);
  }
  return null;
};

number.round = (iValue, precision = 2) => {
  let value = iValue;
  if (typeof value === 'string') value = number.toNumber(value);
  if (typeof value !== 'number') return null;
  return Number(`${Math.round(`${value}e${precision}`)}e-${precision}`);
};
