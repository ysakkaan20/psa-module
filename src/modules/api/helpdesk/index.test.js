const API = require('./index');

test('Module.API.helpdesk.get to validate Subject', async () => {
  const resp = API.issueTicketITEdu({ Body: 'this is body' });
  expect(resp).toEqual({ success: 'notNull Violation: Ticket.Subject cannot be null' });
});

test('Module.API.helpdesk.get to validate Body', async () => {
  const resp = API.issueTicketITEdu({ Subject: 'this is test' });
  expect(resp).toEqual({ success: 'notNull Violation: Ticket.Subject cannot be null' });
});
