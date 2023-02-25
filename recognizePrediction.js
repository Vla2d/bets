import { recognizeTeamNamesGGS, downloadMedia } from './recognizePredictionGGS.js';

const recognizeBettingMessage = async (event, bettingChannelId, client) => {
  const { peerId, message } = event.message;

  if (peerId?.channelId?.value === bettingChannelId) {
    const { title } = await client.getEntity(bettingChannelId);

    const logMsg = `New message from channel: ${title}. \nThe message: ${message}`;
    console.log(logMsg);

    return {
      channelTitle: title,
      textMessage: message,
      eventMessageObj: event.message,
      client,
    };
  }

  return false;
};

const recognizeTeamNames = async (textMessage, channelTitle, ...optionals) => {
  if (channelTitle === 'bet_test') { // bet_test or GGS Bot Dota 2
    return recognizeTeamNamesGGS(optionals[0]);
  }

  return textMessage;
};

const recognizeWinner = async (textMessage, channelTitle) => {
  if (channelTitle === 'bet_test') { // bet_test or GGS Bot Dota 2
    return textMessage;
  }

  return false;
};

const getBettingData = async (recognizedBettingMessage) => {
  const {
    channelTitle, textMessage, eventMessageObj, client,
  } = recognizedBettingMessage;

  if (channelTitle === 'bet_test') { // bet_test or GGS Bot Dota 2
    const downloadedBetPictureFileName = await downloadMedia(eventMessageObj, client);
    const recognizedTeamNames = await recognizeTeamNames(
      textMessage,
      channelTitle,
      downloadedBetPictureFileName,
    );
    const recognizedWinner = await recognizeWinner(textMessage, channelTitle);

    return {
      teamNames: recognizedTeamNames,
      winner: recognizedWinner,
    };
  }

  console.log('The new message is probably not from a betting channel.');
  return null;
};

export { recognizeBettingMessage, getBettingData };
