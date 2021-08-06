const formatOutput = (username, numberRolled, sides, modifier) => {
  if (modifier !== 0)
    return `${username}: rolled **${numberRolled}** (d${sides}+${modifier})`;

  return `${username}: rolled **${numberRolled}** (d${sides})`;
};

const rollDice = (sides, modifier = 0) => (
  1 + Math.floor(Math.random() * (sides)) + modifier
);

export const extractDiceRoll = (username, content) => {
  if (!content.includes('d')) {
    // default d6 dice roll
    return formatOutput(username, rollDice(6), 6, 0);
  }
  
  // determine the dice being rolled and it's modifier
  const hasModifier = content.includes('+');
  const endOfSides = hasModifier ? content.indexOf('+') : content.length;
  const sides = parseInt(content.substring(content.indexOf('d') + 1, endOfSides));
  const modifier = hasModifier ? parseInt(content.substring(content.indexOf('+') + 1, content.length)) : 0;

  // calculate the roll
  const numberRolled = rollDice(sides, modifier);

  if (isNaN(numberRolled)) 
    return null;
  
  return formatOutput(username, numberRolled, sides, modifier);
};