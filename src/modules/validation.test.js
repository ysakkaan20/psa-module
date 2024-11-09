const validation = require('./validation');
const {
  BadRequestError,
  // NotFoundError,
  // ForbiddenError,
  // ApplicationError,
} = require('./error');

test('Module.validation.validateMobile to 05x1234567', () => {
  expect(validation.validateMobile('0501234567')).toEqual('971501234567');
  expect(validation.validateMobile('0511234567')).toEqual('971511234567');
  expect(validation.validateMobile('0591234567')).toEqual('971591234567');
});
test('Module.validation.validateMobile to 501234567', () => {
  const resp = validation.validateMobile('501234567');
  expect(resp).toEqual('971501234567');
});

test('Module.validation.validateMobile to 971501234567', () => {
  expect(validation.validateMobile('971501234567')).toEqual('971501234567');
  expect(validation.validateMobile('9710501234567')).toEqual('971501234567');
  expect(validation.validateMobile('009710501234567')).toEqual('971501234567');
});
test('Module.validation.validateMobile to +971501234567', () => {
  const resp = validation.validateMobile('+971501234567');
  expect(resp).toEqual('971501234567');
});
test('Module.validation.validateMobile to 00971501234567', () => {
  const resp = validation.validateMobile('00971501234567');
  expect(resp).toEqual('971501234567');
});
test('Module.validation.validateMobile to 0971501234567', () => {
  const resp = validation.validateMobile('0971501234567');
  expect(resp).toEqual('971501234567');
});
test('Module.validation.validateMobile to 9 7 1 5 0 1 2 3 4 5 6 7 ', () => {
  const resp = validation.validateMobile('9 7 1 5 0 1 2 3 4 5 6 7 ');
  expect(resp).toEqual('971501234567');
});

test('Module.validation.validateMobile to invalid numbers', () => {
  expect(() => validation.validateMobile('71501234567')).toThrow(BadRequestError);
  expect(() => validation.validateMobile('1501234567')).toThrow(BadRequestError);
  expect(() => validation.validateMobile('601234567')).toThrow(BadRequestError);
  expect(() => validation.validateMobile('0401234567')).toThrow(BadRequestError);
  expect(() => validation.validateMobile('0601234567')).toThrow(BadRequestError);
  expect(() => validation.validateMobile('')).toThrow(BadRequestError);
});
