const SMS = require('./sms');

test('Module.sms.sendSMS to return send SMS', async () => {
  const resp = await SMS.sendSMS('971501234567', 'testing');
  expect(resp).not.toEqual(false);
});
