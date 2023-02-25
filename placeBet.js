import { chromium } from 'playwright';

const bettingDataSample = { teamNames: { team1: 'EHOME', team2: 'Spirit' }, winner: '' };
const { team1, team2 } = bettingDataSample.teamNames;
// TODO: Прибирати з назви команди "Team", наприклад Team Spirit = Spirit

const placeBet = async () => {
  const browser = await chromium.launch({ headless: false });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://pm.ua/uk/e-sports');
  await page.waitForLoadState();

  const team1SpanSelector = `span:has-text("${team1}")`;
  const team2SpanSelector = `span:has-text("${team2}")`;
  await page.waitForSelector(team1SpanSelector);
  await page.waitForSelector(team2SpanSelector);

  const team1Spans = await page.$$(team1SpanSelector);
  const team2Spans = await page.$$(team2SpanSelector);

  const closestAAnchorSelector = 'xpath=ancestor::a';

  // find matching spans if page includes several spans with our team names
  const getRightATag = async () => {
    const promises = team1Spans.map(async (team1Span) => {
      const team1SpansAAnchor = await team1Span.$(closestAAnchorSelector);
      const team1AAnchorHref = await team1SpansAAnchor.getAttribute('href');

      const results = await Promise.all(team2Spans.map(async (team2Span) => {
        const team2SpansAAnchor = await team2Span.$(closestAAnchorSelector);
        const team2AAnchorHref = await team2SpansAAnchor.getAttribute('href');

        if (team1AAnchorHref === team2AAnchorHref) {
          console.log('Matched hrefs: ', team1AAnchorHref, team2AAnchorHref);
          return team1AAnchorHref;
          // Match! Now we are sure, that <a> of team1span equals <a> of team2span.
          // So we can safely make a bet by operatin this <a> element.
        }

        return false;
      }));

      return results.filter((el) => typeof el === 'string');
    });

    return Promise.all(promises).then((arr) => arr.flat().filter((el) => typeof el === 'string')[0]);
  };

  console.log('getRightATag(): ', await getRightATag());

  // await context.close();
  // await browser.close();
};

placeBet();
