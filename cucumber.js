const common = [
  'features/**/*.feature',
  '--require-module ts-node/register',
  '--require src/support/**/*.ts',
  '--require src/steps/**/*.ts',
  '--format progress-bar',
  '--format json:reports/cucumber-report.json',
  '--format html:reports/cucumber-report.html',
].join(' ');

module.exports = {
  default: common,
};
