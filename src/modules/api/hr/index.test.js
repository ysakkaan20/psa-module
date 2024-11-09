const HR = require('./index');

test('Module.hr.findAll to return List Employees', async () => {
  const emp = await HR.findAll(27329);
  expect(emp).not.toEqual(false);
  expect(emp.length).toBeGreaterThanOrEqual(1);
  expect(emp[0]).toHaveProperty('employeeID');
  expect(emp[0]).toHaveProperty('employeeMobileNo');
  expect(emp[0]).toHaveProperty('employeeEmail');
});
