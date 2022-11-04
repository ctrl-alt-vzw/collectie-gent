


function calculateOffset(data) {

  const set = data
  .sort((a, b) => {
    return b.y - a.y
  })
  .slice(0, 50);
  const total = set.reduce((a, b) =>  {
      return a + b.y
    }, 0);
  console.log(total / set.length)
  return ((total / set.length) * .8)


}



module.exports = {
  calculateOffset
}