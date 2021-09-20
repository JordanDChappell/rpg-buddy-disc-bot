import { initCubeGame, pauseCubeGame, unpauseCubeGame } from "./cube/cube"

export const startChosenGame = (message, channel) => {
  if (message.includes('cube')) {
    initCubeGame(channel);
    return;
  }

  channel.send('Sorry, I don\'t recognise that game.');
};

export const pauseGame = () => {
  pauseCubeGame();
};

export const 