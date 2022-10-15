


function calculateOffset(data) {
  const total = data.reduce((a, b) => a + b.y, 0);
  return ((total / data.length) * .5)
}



module.exports = {
  calculateOffset
}