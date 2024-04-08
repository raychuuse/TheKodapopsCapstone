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

module.exports = {
  processQueryResult,
  isValidId
}