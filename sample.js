let recipeMap = new Map([
    ['cucumber', 500],
    ['tomatoes', 350],
    ['onion',    50]
]);
  
console.log('recipeMap', recipeMap)
const newObj = Object.fromEntries(recipeMap.entries())
console.log('newObj', newObj)