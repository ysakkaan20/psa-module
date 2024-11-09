const Email = require("./email");

test("Module.email.textEmail to return queue id", async () => {
        const resp = await Email.textEmail({subject: 'test', to: 'test@psa.ac.ae', data: {body: 'body'}});
        expect(resp).toBeGreaterThan(0)
});
test("Module.email.tableEmail to return queue id", async () => {
        const resp = await Email.tableEmail({subject: 'test', to: 'test@psa.ac.ae', data: {list: [{label: 'body'}]}});
        expect(resp).toBeGreaterThan(0)
});

// test("Module.email.textEmail to return queue id", async () => {
//     try {
//         const resp = await Email.textEmail({subject: 'test', to: 'test@psa.ac.ae', data: {body: 'body'}});
//         expect(resp).toBeGreaterThan(0)
//     } catch (e) {
//         expect(e.message).toEqual('BadRequestError: subject is required')
//     }
// });
