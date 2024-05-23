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
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNCAwQzIxLjkzIDAgMTguNDcxIDAuNzk1IDE1LjIxNiAxLjY4QzExLjg4NiAyLjU4IDguNTI5MDIgMy42NDUgNi41NTUwMiA0LjI5QzUuNzI5NjkgNC41NjI1NSA0Ljk5Nzk5IDUuMDYyNCA0LjQ0Mzk3IDUuNzMyMUMzLjg4OTk1IDYuNDAxODEgMy41MzYwOCA3LjIxNDIyIDMuNDIzMDIgOC4wNzZDMS42MzUwMiAyMS41MDcgNS43ODQwMiAzMS40NjEgMTAuODE4IDM4LjA0NkMxMi45NTM1IDQwLjg2MjIgMTUuNDk4OCA0My4zNDI3IDE4LjM2OSA0NS40MDVDMTkuNTI3IDQ2LjIyNCAyMC42MDEgNDYuODUxIDIxLjUxMyA0Ny4yOEMyMi4zNTMgNDcuNjc2IDIzLjI1NiA0OCAyNCA0OEMyNC43NDQgNDggMjUuNjQ0IDQ3LjY3NiAyNi40ODcgNDcuMjhDMjcuNTg3NiA0Ni43NDc3IDI4LjYzOTYgNDYuMTIwMyAyOS42MzEgNDUuNDA1QzMyLjUwMTMgNDMuMzQyNyAzNS4wNDY1IDQwLjg2MjIgMzcuMTgyIDM4LjA0NkM0Mi4yMTYgMzEuNDYxIDQ2LjM2NSAyMS41MDcgNDQuNTc3IDguMDc2QzQ0LjQ2NDUgNy4yMTM2OCA0NC4xMTA5IDYuNDAwNjMgNDMuNTU2OCA1LjczMDM1QzQzLjAwMjcgNS4wNjAwNyA0Mi4yNzA4IDQuNTU5NzggNDEuNDQ1IDQuMjg3QzM4LjU3OTMgMy4zNDgwMyAzNS42OTE0IDIuNDc3NzggMzIuNzg0IDEuNjc3QzI5LjUyOSAwLjc5OCAyNi4wNyAwIDI0IDBaTTI0IDE1QzI1LjA2MjcgMTQuOTk4NCAyNi4wOTE3IDE1LjM3MyAyNi45MDQ3IDE2LjA1NzRDMjcuNzE3NyAxNi43NDE4IDI4LjI2MjMgMTcuNjkxOCAyOC40NDE5IDE4LjczOTJDMjguNjIxNiAxOS43ODY3IDI4LjQyNDggMjAuODYzOSAyNy44ODYzIDIxLjc4MDFDMjcuMzQ3OSAyMi42OTYzIDI2LjUwMjUgMjMuMzkyMyAyNS41IDIzLjc0NUwyNi42NTUgMjkuNzE1QzI2LjY5NyAyOS45MzIxIDI2LjY5MDUgMzAuMTU1OSAyNi42MzU5IDMwLjM3MDJDMjYuNTgxNCAzMC41ODQ1IDI2LjQ4IDMwLjc4NDEgMjYuMzM5MyAzMC45NTQ3QzI2LjE5ODUgMzEuMTI1MyAyNi4wMjE4IDMxLjI2MjYgMjUuODIxNyAzMS4zNTY5QzI1LjYyMTYgMzEuNDUxMiAyNS40MDMyIDMxLjUgMjUuMTgyIDMxLjVIMjIuODE4QzIyLjU5NzEgMzEuNDk5NiAyMi4zNzkgMzEuNDUwNCAyMi4xNzkzIDMxLjM1NkMyMS45Nzk2IDMxLjI2MTUgMjEuODAzMiAzMS4xMjQxIDIxLjY2MjggMzAuOTUzNkMyMS41MjI0IDMwLjc4MyAyMS40MjEzIDMwLjU4MzYgMjEuMzY2OSAzMC4zNjk1QzIxLjMxMjUgMzAuMTU1NCAyMS4zMDYgMjkuOTMxOSAyMS4zNDggMjkuNzE1TDIyLjUgMjMuNzQ1QzIxLjQ5NzUgMjMuMzkyMyAyMC42NTIyIDIyLjY5NjMgMjAuMTEzNyAyMS43ODAxQzE5LjU3NTMgMjAuODYzOSAxOS4zNzg0IDE5Ljc4NjcgMTkuNTU4MSAxOC43MzkyQzE5LjczNzcgMTcuNjkxOCAyMC4yODIzIDE2Ljc0MTggMjEuMDk1MyAxNi4wNTc0QzIxLjkwODMgMTUuMzczIDIyLjkzNzMgMTQuOTk4NCAyNCAxNVoiIGZpbGw9IiNBNzg0NTQiLz4KPC9zdmc+Cg=="
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
