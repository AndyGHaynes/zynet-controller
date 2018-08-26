const rpio = require('rpio');

const controller = require('./composables/controller');

const pi = controller.props({ gpio: rpio })();
pi.createLED({ color: 'red', pin: 11 });
pi.createLED({ color: 'green', pin: 12 });
pi.createLED({ color: 'blue', pin: 13 });
pi.toggleLEDs();
pi.toggleLEDs();
pi.shutdown();
