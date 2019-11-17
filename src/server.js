const express = require('express');

const app = express();

function initializeServer({ port }, controller) {
  app.get('/alive', (req, res) => {
    res.json({ alive: true });
  });

  app.get('/update', (req, res) => {
    const lastUpdate = controller.getUpdate();
    res.json({ last_update: lastUpdate });
  });

  app.post('/start', (req, res) => {
    return controller.start()
      .then(() => res.json({ status: 'started' }))
      .catch((e) => res.status(500).send(e.message));
  });

  app.post('/stop', (req, res) => {
    controller.stop();
    res.json({ status: 'paused' });
  });

  app.post('/shutdown', (req, res) => {
    return controller.shutdown()
      .then(() => res.json({ status: 'shutdown' }))
      .catch((e) => res.status(500).json({ error: e.message, stack: e.stack }));
  });

  app.listen(port);
}

module.exports = {
  initializeServer,
};
