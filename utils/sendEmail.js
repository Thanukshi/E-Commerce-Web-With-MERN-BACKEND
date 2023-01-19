const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: process.env.EMAIL_PORT,
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: subject,
      html: `<!doctype html>
      <html lang="en-US">

      <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Email Verification - SL BAY</title>
        <meta name="description" content="New Account Email Template.">
        <style type="text/css">
          a:hover {
            text-decoration: underline !important;
          }
        </style>
      </head>

      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!-- 100% body table -->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
          <tr>
            <td>
              <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:80px;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="text-align:center;">
                    <a href="https://rakeshmandal.com" title="logo" target="_blank">
                      <img width="150" src="https://res.cloudinary.com/dpblmx9fn/image/upload/v1674099387/SL%20BAY/sl_bay_logo_earnzx.png" title="logo" alt="logo">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="height:20px;">&nbsp;</td>
                </tr>
                <tr>
                  <td>
                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px; background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                      <tr>
                        <td style="height:40px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="padding:0 35px;">
                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Get started
                          </h1>
                          <p style="font-size:15px; color:#455056; margin:8px 0 0; line-height:24px;">
                            Your account has been created successfully. Please verify your email before login to the SL Bay.

                            <br />
                            <a href=${text} style="background:#20e277;text-decoration:none !important; display:inline-block; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Your Email</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="height:40px;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="height:20px;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="text-align:center;">
                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.slbay.com</strong> </p>
                  </td>
                </tr>
                <tr>
                  <td style="height:80px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>

      </html>`,
    };

    // await transporter.sendMail({
    //   from: process.env.USER,
    //   to: email,
    //   subject: subject,
    //   text: text,
    // });

    await transporter.sendMail(mailOptions, (error, infor) => {
      if (error) {
        console.log("Email is not Send Successfully");
        console.log(error);
      } else {
        console.log("Email Send Successfully");
      }
    });
  } catch (error) {
    console.log("Email is not Send Successfully");
    console.log(error);
  }
};
