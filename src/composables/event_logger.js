const stampit = require('@stamp/it');
const _ = require('lodash');
const moment = require('moment');

const { LogLevel } = require('../constants');

const EventLogger = stampit({
  props: {
    logLevel: LogLevel.ERROR,
  },
  init() {
    this.events = [];
  },
  methods: {
    logDebug(...params) {
      this.logLevel === LogLevel.DEBUG && console.debug(...params);
    },

    logError(...params) {
      this.logLevel !== LogLevel.SILENT && console.error(...params);
    },

    logEvent(event, context) {
      const now = moment(moment(), 'ddd HH:mm:ss.SSS');
      this.logDebug(`[${now}][${event}]`, _.pickBy(context));
      this.events.push({
        event,
        context: _.pickBy(context)
      });
    },
  }
});

module.exports = EventLogger;
