const {
  BadRequestError,
  // NotFoundError,
  // ForbiddenError,
  // ApplicationError,
} = require('./error');

module.exports = {

  validateMobile: (iMobile, key = 'mobile') => {
    let mobile = `${Number(iMobile ? iMobile.replace(/ /g, '') : '')}`;

    // 97105x1234567
    if (mobile.indexOf('97105') > -1 && mobile.indexOf('97105') < 3) {
      mobile = `${mobile.replace('97105', '9715')}`;
    }

    // 05x1234567
    if (mobile.length === 10 && mobile.indexOf('0') === 0) mobile = mobile.slice(1);
    // 5x1234567
    if (mobile.length === 9) mobile = `971${mobile}`;
    // 009715x1234567
    if (mobile.length === 14
      && mobile.indexOf('00971') === 0) {
      mobile = `${mobile.replace('00971', '971')}`;
    }
    // +9715x1234567 or 09715x1234567
    if (mobile.length === 13) {
      if (mobile.indexOf('0971') === 0) mobile = `${mobile.replace('0971', '971')}`;
    }

    if (/^(9715)\d{8}$/gm.test(mobile)) return mobile;
    throw new BadRequestError(`Invalid ${key}`);
  },
  validateEID: (eid) => {
    if (!eid) return null;

    const emiratesID = Number(`${eid}`.replace(/-/g, ''));
    if (`${emiratesID}`.length !== 15) throw new BadRequestError('Invalid Emirates ID', { value: eid });
    return emiratesID;
  },
};
