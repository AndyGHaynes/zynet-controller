const stampit = require('@stamp/it');

const EventLogger = stampit({
  props: {
    debug: false,
    test: false,
  },
  methods: {
    logDebug(...params) {
      this.debug && console.debug(...params);
    },
    logError(...params) {
      !this.test && console.error(...params);
    },
  }
});

module.exports = EventLogger;
