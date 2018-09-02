const stampit = require('@stamp/it');

const EventLogger = stampit({
  props: {
    debug: false,
    error: true,
  },
  methods: {
    logDebug(...params) {
      this.debug && console.debug(...params);
    },
    logError(...params) {
      this.error && console.error(...params);
    },
  }
});

module.exports = EventLogger;
