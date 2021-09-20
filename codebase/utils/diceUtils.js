/**
 * Format a dice roll string ready to post to the channel.
 * @param {string} username Either the username or nickname on current server of message author.
 * @param {number} numberOfDice Amount of dice rolled.
 * @param {number} sides Sides on dice rolled.
 * @param {number} numberRolled Total number rolled on all dice.
 * @param {number} modifier Additional modifier value.
 * @returns {string} Formatted output string to return to client.
 */
const formatOutput = (username, numberRolled, numberOfDice, sides, modifier = 0) => {
  if (modifier !== 0)
    return `${username}: rolled **${numberRolled}** (${numberOfDice}d${sides}+${modifier})`;

  return `${username}: rolled **${numberRolled}** (${numberOfDice}d${sides})`;
};

/**
 * Roll the specified number of dice and add any modifiers.
 * @param {number} sides Sides on dice chosen. 
 * @param {number} numberOfDice Determines how many dice are rolled.
 * @param {number} modifier Additional modifier value.
 * @returns 
 */
const rollDice = (sides, numberOfDice = 1, modifier = 0) => {
  let totalRolled = 0;

  for (let i = 0; i < numberOfDice; i++) {
    totalRolled = totalRolled + (1 + Math.floor(Math.random() * (sides)));
  }

  return totalRolled + modifier;
};
  
/**
 * Parse a string to extract information about a dice roll. E.g. '!roll 2d10 + 6'
 * @param {string} username Either the username or nickname on current server of message author.
 * @param {string} content Command sent by the user. Comes in format '!roll {numberOfDice}d{sides} + {modifier}.  
 * @returns {string} Formatted response to be sent to the channel.
 */
export const extractDiceRollResponse = (username, content) => {
  if (!content.includes('d')) {
    // default d20 dice roll
    return formatOutput(username, rollDice(20), 1, 20);
  }
  
  // determine the number and type of dice being rolled and it's modifier
  // first just grab some index values from the string we are parsing
  const hasModifier = content.includes('+');
  const indexOfD = content.indexOf('d');
  const indexOfPlus = content.indexOf('+');

  // determine number of dice (this comes after the !roll command but before the 'd')
  let numberOfDice = parseInt(content.substring(content.lastIndexOf('l') + 1, indexOfD));
  if (isNaN(numberOfDice))
    numberOfDice = 1;

  if (numberOfDice <= 0)
    return 'That\'s a weird number of dice 😢';

  // determine the number of sides on the dice being rolled
  const endOfSides = hasModifier ? indexOfPlus : content.length;
  const sides = parseInt(content.substring(indexOfD + 1, endOfSides));

  if (sides <= 0 || sides > 1000)
    return 'That\'s a strange dice you\'re trying to roll 🙊';

  // determine the modifier being added to the total dice roll
  const modifier = hasModifier ? parseInt(content.substring(indexOfPlus + 1, content.length)) : 0;

  // calculate the roll
  const numberRolled = rollDice(sides, numberOfDice, modifier);

  if (isNaN(numberRolled))
    return null;
  
  return formatOutput(username, numberRolled, numberOfDice, sides, modifier);
};