const number = require('./number');

test('Module.number.round to return number', () => {
  // to be null
  expect(number.round(null)).toBeNull();
  expect(number.round({})).toBeNull();
  expect(number.round([])).toBeNull();
  // number to number
  expect(number.round(1)).toEqual(expect.any(Number));
  expect(number.round(0.1)).toEqual(0.1);
  expect(number.round(0.11)).toEqual(0.11);
  expect(number.round(0.111)).toEqual(0.11);
  expect(number.round(0.116)).toEqual(0.12);
  expect(number.round(1.999)).toEqual(2);
  // using precision
  expect(number.round(0.1, 0)).toEqual(0);
  expect(number.round(0.1, 1)).toEqual(0.1);
  expect(number.round(0.01, 2)).toEqual(0.01);
  expect(number.round(0.001, 3)).toEqual(0.001);
  expect(number.round(0.0001, 3)).toEqual(0);
  expect(number.round(0.0006, 3)).toEqual(0.001);
  // string to null
  expect(number.round('')).toBeNull();
  expect(number.round(' ')).toBeNull();
  expect(number.round('a')).toBeNaN();
  expect(number.round('0.1a')).toBeNaN();
  // string to number
  expect(number.round('1')).toEqual(expect.any(Number));
  expect(number.round(' 1 ')).toEqual(1);
  expect(number.round(' 1.11 ')).toEqual(1.11);
  expect(number.round(' 1.167 ')).toEqual(1.17);
  // using precision
  expect(number.round('0.1', 0)).toEqual(0);
  expect(number.round('0.1', 1)).toEqual(0.1);
  expect(number.round('0.01', 2)).toEqual(0.01);
  expect(number.round('0.001', 3)).toEqual(0.001);
  expect(number.round('0.0001', 3)).toEqual(0);
  expect(number.round('0.0006', 3)).toEqual(0.001);
});
