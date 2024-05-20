function processQueryResult(data) {
  return data[0];
}

function isValidId(id, res) {
  if (id == null || isNaN(id)) {
    res.status(400).json({message: "Please provide a valid id."});
    return false;
  }
  return true;
}

function validationErrorToError(validationError) {
  let str = '';
  for (const error of validationError.errors)
    str += error.msg + '\n';
  return {message: str.substring(0, str.length - 1)};
}

function checkIfExpired(date) {
  if (date >= Date.now()) {
    return false;
  }
  return true;
}

module.exports = {
  processQueryResult,
  isValidId,
  validationErrorToError,
  checkIfExpired
}