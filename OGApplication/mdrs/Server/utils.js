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

module.exports = {
  processQueryResult,
  isValidId,
  validationErrorToError
}