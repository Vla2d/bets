import dotenv from 'dotenv';

const getParsedEnvData = () => {
  dotenv.config();

  const {
    stringSession, apiId, apiHash, bettingChannelId,
  } = process.env;

  return {
    stringSession,
    apiId: Number(apiId),
    apiHash,
    bettingChannelId: BigInt(bettingChannelId),
  };
};

export default getParsedEnvData;
