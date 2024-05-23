function processQueryResult(data) {
  return data[0];
}

function isValidId(id, res) {
  if (id == null || isNaN(id)) {
    res.status(400).json({ message: "Please provide a valid id." });
    return false;
  }
  return true;
}

function validationErrorToError(validationError) {
  let str = "";
  for (const error of validationError.errors) str += error.msg + "\n";
  return { message: str.substring(0, str.length - 1) };
}

function checkIfExpired(date) {
  if (date >= Date.now()) {
    return false;
  }
  return true;
}

function htmlResetCode(app, resetCode) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Sugarcane ${app} Consignment App Password Reset</title>
      <style>
        .body p {
          margin-bottom: 24px;
          line-height: 18px;
        }
      </style>
    </head>
    <body
      style="
        background-color: #dde3d6;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      "
    >
      <table
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        bgcolor="#DDE3D6"
      >
        <tr>
          <td align="center">
            <table
              width="600"
              border="0"
              cellspacing="0"
              cellpadding="0"
              bgcolor="#F5F8F0"
              style="margin: auto"
            >
              <tr>
                <td
                  style="
                    background-color: #9bb86f;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      background-color: #dde3d6;
                      padding: 16px;
                      width: 182px;
                      margin-right: auto;
                      margin-left: auto;
                      border-radius: 16px;
                    "
                  >
                  <img
                  src="https://i.postimg.cc/GhhVY0XT/Frame.png"
                  alt="Shield Lock Icon"
                  width="48"
                  height="48" />
                  </p>
                </td>
              </tr>
              <tr>
                <td
                  style="padding: 20px; color: #23282f; background-color: #dae6c6"
                  class="body"
                >
                  <h2 style="color: #a78454">Password Reset Request</h2>
                  <p>Hello,</p>
                  <p>
                    You have requested to reset your password for the Sugarcane ${app} 
                    Consignment App. Please use the following code to reset your
                    password: 
                  </p>
                  <h3 style="color: #a78454; text-align: center">${resetCode}</h3>
                  <p>
                    If you did not request a password reset, please ignore this
                    email or contact support immediately.
                  </p>
                  <hr style="border: 0; height: 1px; background: #a78454" />
                  <p>Thank you,<br />The Sugarcane Consignment App Team</p>
                </td>
              </tr>
              <tr>
                <td style="text-align: center; padding: 20px">
                  <p>
                    <small
                      >This is an automated message from the Sugarcane Consignment
                      App.<br />Please <strong>do not</strong> reply directly to
                      this email.</small
                    >
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

module.exports = {
  processQueryResult,
  isValidId,
  validationErrorToError,
  checkIfExpired,
  htmlResetCode,
};
