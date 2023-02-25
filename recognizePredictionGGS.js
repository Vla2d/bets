import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createWorker } from 'tesseract.js';
import fs from 'fs';

export const downloadMedia = async (eventMessageObj, client) => {
  try {
    const buffer = await client.downloadMedia(eventMessageObj, {});
    const fileName = 'bet.jpg';
    fs.writeFileSync(fileName, buffer);
    console.log('Image downloaded successfully.');

    return fileName;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const recognizeTeamNamesGGS = async (fileName) => {
  const worker = await createWorker({ errorHandler: (err) => console.error(err) });

  const language = 'eng';
  await worker.loadLanguage(language);
  await worker.initialize(language);

  const __dirname = dirname(fileURLToPath(import.meta.url));

  const { data: { text } } = await worker.recognize(join(__dirname, fileName));

  const regex = /nepco.*?\s+(\S[\s\S]*?)\s+npo\S*\s+\S+\s+(\S[\s\S]*?)\s*(?:\r?\n|$)/gmi;
  const teams = regex.exec(text);

  if (teams) {
    console.log(`Recognized team names: ${teams[1]} vs ${teams[2]}`);

    return {
      team1: teams[1],
      team2: teams[2],
    };
  }

  const secondTryRegex = /([A-Za-z.]+(?: [A-Za-z.]+)*)\s+vs\s+([A-Za-z.]+(?: [A-Za-z.]+)*)/gm;
  const secondTryTeams = secondTryRegex.exec(text);

  if (secondTryTeams) {
    console.log(`Recognized team names: ${secondTryTeams[1]} vs ${secondTryTeams[2]}`);

    return {
      team1: secondTryTeams[1],
      team2: secondTryTeams[2],
    };
  }

  console.log(text);
  return null;
};
