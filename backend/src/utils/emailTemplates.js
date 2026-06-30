const getBaseTemplate = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7f6; }
    .header { background: #1e293b; padding: 30px 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; border-bottom: 4px solid #3b82f6; }
    .header h1 { margin: 0; font-size: 28px; letter-spacing: 1px; color: #ffffff; }
    .content { background-color: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .content h2 { color: #1e293b; margin-top: 0; }
    .content p { color: #555; line-height: 1.6; font-size: 16px; }
    .otp-box { background-color: #f8fafc; border: 2px dashed #3b82f6; text-align: center; padding: 20px; margin: 30px 0; border-radius: 8px; }
    .otp-code { font-size: 36px; font-weight: bold; color: #1e293b; letter-spacing: 4px; }
    .info-box { background-color: #f9f9f9; border-left: 4px solid #1e293b; padding: 15px 20px; margin: 20px 0; border-radius: 4px; }
    .btn-container { text-align: center; margin-top: 30px; }
    .btn { display: inline-block; background: #3b82f6; color: #ffffff !important; text-decoration: none; padding: 14px 35px; border-radius: 5px; font-weight: bold; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); border: 1px solid #2563eb; }
    .footer { text-align: center; margin-top: 20px; padding-bottom: 20px; color: #888; font-size: 12px; }
    .warning { color: #ef4444; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thori Technical Shop</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Thori Technical Shop Management. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

exports.getWelcomeEmail = (name) => {
  const content = `
    <p>Hello ${name},</p>
    <p>Welcome to the <strong>Thori Technical Shop Management System</strong>!</p>
    <p>Your account has been successfully created. You can now log into your dashboard to access your modules (Inventory, Payroll, Recipes, etc.).</p>
    <div class="btn-container">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="btn">Go to Dashboard →</a>
    </div>
  `;
  return getBaseTemplate("Welcome Aboard!", content);
};

exports.getOtpEmail = (otp) => {
  const content = `
    <p>We received a request to verify your staff account. Please use the One-Time Password (OTP) below to complete your verification.</p>
    
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
    </div>
    
    <p><strong>Note:</strong> This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
  `;
  return getBaseTemplate("Verification Required", content);
};

exports.getReactivationEmail = (name, otp) => {
  const content = `
    <p>Hello ${name},</p>
    <p>You recently tried to log into your account, but it was previously deactivated by the Admin. You can easily reactivate it using the OTP below.</p>
    
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
    </div>
    
    <p><strong>Note:</strong> This code is valid for 10 minutes. If you did not request this, please contact the Super Admin immediately.</p>
  `;
  return getBaseTemplate("Account Reactivation", content);
};

exports.getLoginNotificationEmail = (name) => {
  const content = `
    <p>Hello ${name},</p>
    <p>We noticed a new login to your Management account at <strong>${new Date().toLocaleString()}</strong>.</p>
    <p>If this was you, you can safely ignore this email.</p>
    <p class="warning">If you did not authorize this login, please reset your password immediately to secure your account!</p>
  `;
  return getBaseTemplate("Secure Login Alert", content);
};

exports.getPasswordResetEmail = (otp) => {
  const content = `
    <p>We received a request to reset the password for your Management account. Use the OTP below to set up a new password.</p>
    
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
    </div>
    
    <p><strong>Note:</strong> This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
  `;
  return getBaseTemplate("Password Reset Request", content);
};

exports.getStaffInviteEmail = (name, email, password, roleName) => {
  const content = `
    <p>Hello ${name},</p>
    <p>You have been invited to join the <strong>Thori Technical Shop</strong> management system with the assigned role of <strong style="color: #1e293b;">${roleName}</strong>.</p>
    
    <div class="info-box">
      <p style="margin:0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Your Credentials</p>
      <p style="margin:10px 0 0 0;">Email: <strong>${email}</strong></p>
      <p style="margin:10px 0 0 0;">Temporary Password: <strong style="color: #ef4444; font-size: 18px; letter-spacing: 2px;">${password}</strong></p>
    </div>
    
    <p class="warning" style="margin-top: 15px;">⚠️ Important: Please change your password immediately after your first login for security purposes.</p>
    
    <div class="btn-container">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="btn">Login to Dashboard →</a>
    </div>
  `;
  return getBaseTemplate("You're Invited!", content);
};
