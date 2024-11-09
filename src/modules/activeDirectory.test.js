const AD = require("./activedirectory");

test("Module.activeDirectory.authenticateUser to return true", async () => {
  try {
    const resp = await AD.authenticateUser('username', 'password');
    expect(resp).toEqual(true)
  }catch (e){
    expect(e.message).toEqual('Invalid username or password')
  }

  try {
    await AD.authenticateUser();
  }catch (e){
    expect(e.message).toEqual('Username is required')
  }

  try {
    await AD.authenticateUser('awais');
  }catch (e){
    expect(e.message).toEqual('Password is required')
  }
  try {
    await AD.authenticateUser('user', 'wrongpassword');
  }catch (e){
    expect(e.message).toEqual('Invalid username or password')
  }
});
test("Module.activeDirectory.validateUser to return user", async () => {
  try {
    const resp = await AD.validateUser('ad');
    expect(resp).toMatchObject({sAMAccountName: 'ad'})
  }catch (e){
    expect(e.message).toEqual('Invalid username or password')
  }

  try {
    await AD.validateUser();
  }catch (e){
    expect(e.message).toEqual('Username is required')
  }

  try {
    await AD.validateUser('wrongusername');
  }catch (e){
    expect(e.message).toEqual('Invalid username')
  }
});
test("Module.activeDirectory.findAll to return user list", async () => {
  try {
    const resp = await AD.findAll();
    expect(resp.length).toBeGreaterThan(0)
  }catch (e){
    expect(e.message).toEqual('Invalid username or password')
  }
});
