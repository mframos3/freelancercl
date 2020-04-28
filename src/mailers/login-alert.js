module.exports = function sendLoginAlertEmail(ctx, { user }) {
  return ctx.sendMail('login-alert', { to: 'ctcarstens@uc.cl', subject: 'Alert!' }, { user });
};
