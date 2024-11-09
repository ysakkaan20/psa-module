const HR = require("./hrOld");

test("Module.hrOld.findOne to return Employee", async () => {
  const emp = await HR.findOne({MilitaryNo: 27329});
  expect(emp).not.toEqual(false)
  // expect(emp.length).toBeGreaterThanOrEqual(1)
  expect(emp).toHaveProperty('MilitaryNo')
  expect(emp).toHaveProperty('Emp_Mobile')
  expect(emp).toHaveProperty('Emp_Email')
});
test("Module.hrOld.findAll to return List Employees", async () => {
  const emp = await HR.findAll();
  expect(emp).not.toEqual(false)
  expect(emp.length).toBeGreaterThanOrEqual(1)
  expect(emp[0]).toHaveProperty('MilitaryNo')
  expect(emp[0]).toHaveProperty('Emp_Mobile')
  expect(emp[0]).toHaveProperty('Emp_Email')
});
