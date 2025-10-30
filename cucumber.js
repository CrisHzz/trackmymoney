export default {
  default: {
    import: ['features/step_definitions/**/*.js'],
    format: ['progress', 'json:reports/cucumber_report.json'],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    dryRun: false,
    failFast: false,
    strict: true,
    tags: 'not @skip'
  }
};
