const stampit = require('@stamp/it');

const { LogLevel } = require('../constants');

const EventLogger = stampit({
  props: {
    logLevel: LogLevel.ERROR,
  },
  methods: {
    logDebug(...params) {
      this.logLevel === LogLevel.DEBUG && console.debug(...params);
    },
    logError(...params) {
      this.logLevel !== LogLevel.SILENT && console.error(...params);
    },
  }
});

module.exports = EventLogger;
