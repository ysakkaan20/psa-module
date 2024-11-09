const API = require('./index');

test('Module.API.accounts.get to validate username', async () => {
  const resp = await API.getData('auth/validate/field?userType=employee&field=username&value=thisistestusername');
  expect(resp).toEqual({ success: true });
});

test('Module.API.accounts.get to validate mobile', async () => {
  const resp = await API.getData('auth/validate/field?userType=employee&field=mobile&value=971500000000');
  expect(resp).toEqual({ success: true });
});

test('Module.API.accounts.get to validate email', async () => {
  const resp = await API.getData('auth/validate/field?userType=employee&field=email&value=testuser@psa.ac.ae');
  expect(resp).toEqual({ success: true });
});
