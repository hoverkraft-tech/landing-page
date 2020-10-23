const { readFileSync, readdirSync, writeFileSync } = require('fs');

const lighthouseLinks = JSON.parse(process.env.LIGHTHOUSE_LINKS);
const reportUrl = lighthouseLinks[Object.keys(lighthouseLinks)[0]];
const summary = JSON.parse(
  readFileSync(process.env.LIGHTHOUSE_RESULTS_PATH + '/manifest.json')
);

const summaryKeys = Object.keys(summary);
const sum = summaryKeys.reduce(
  (currentSum, key) => (currentSum += summaryKeys[key]),
  0
);

const percentage = Math.round((sum / summaryKeys.length) * 100);

const percentageToColor = (percentage) => {
  if (percentage >= 95) return 'brightgreen';
  if (percentage >= 90) return 'green';
  if (percentage >= 75) return 'yellowgreen';
  if (percentage >= 60) return 'yellow';
  if (percentage >= 40) return 'orange';
  return 'red';
};

const color = percentageToColor(percentage);
const badgeUrl = `https://img.shields.io/badge/Lighthouse-${percentage}%25-${color}?logo=lighthouse`;

console.info(summary, percentage, color, badgeUrl);

writeFileSync(
  'README.md',
  readFileSync('README.md', { encoding: 'utf8' })
    .replace(
      /(title="Go to Lighthouse report" href=")([^"]*)(")/,
      '$1' + reportUrl + '$3'
    )
    .replace(/(alt="Lighthouse" src=")([^"]*)(")/, '$1' + badgeUrl + '$3')
);
