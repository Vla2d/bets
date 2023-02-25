import input from 'input';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/StringSession.js';
import { NewMessage } from 'telegram/events/NewMessage.js';
// import { EditedMessage } from 'telegram/events/EditedMessage.js';
import getParsedEnvData from './getParsedEnvData.js';
import { recognizeBettingMessage, getBettingData } from './recognizePrediction.js';

const setupBot = async () => {
  // Get our parsed .env variables
  const {
    stringSession, apiId, apiHash, bettingChannelId,
  } = getParsedEnvData();

  // Connect to our client
  const client = new TelegramClient(new StringSession(stringSession), apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => input.text('Please enter your number: '),
    password: async () => input.text('Please enter your password: '),
    phoneCode: async () => input.text('Please enter the code you received: '),
    onError: (err) => console.log(err),
  });

  console.log('You should now be connected. Copy and paste the following string to your .env variable:');
  console.log(client.session.save()); // Save this string to avoid logging in again

  const handler = async (event) => {
    const { peerId } = event.message;

    if (peerId?.channelId?.value === bettingChannelId) {
      const recognizedBettingMessage = await recognizeBettingMessage(
        event,
        bettingChannelId,
        client,
      );
      const bettingData = await getBettingData(recognizedBettingMessage);

      console.log('Betting data: ');
      console.log(bettingData);
    }
  };

  // Recognize bet info (teams, winner, tournament etc. Probably has no odds info).
  client.addEventHandler(handler, new NewMessage({}));

  // Maybe I need to also recognize odds...
  // ...that come in the edited version of initially sent message...
  // TODO:  recognizeOdds()

  // const editHandler = async (event) => {
  //   const { peerId } = event.message;

  //   if (peerId?.channelId?.value === bettingChannelId) {
  //     const channel = await client.getEntity(bettingChannelId);
  //     const messages = await client.getMessages(channel, {
  //       limit: 1,
  //     });

  //     console.log(`Updated: ${messages[0].message}`);
  //     return messages[0].message;
  //   }

  //   return false;
  // };
  // client.addEventHandler(editHandler, new EditedMessage({}));
};

setupBot();
export default setupBot;
