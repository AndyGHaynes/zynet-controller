const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(bodyParser.json());

function initializeServer({ port }, controller) {
  app.get('/alive', (req, res, next) => {
    res.json({ alive: true });
    next();
  });

  app.get('/update', (req, res, next) => {
    const lastUpdate = controller.getUpdate();
    res.json({ lastUpdate });
    next();
  });

  app.post('/start', (req, res, next) => {
    return controller.start()
      .then(() => {
        res.json({ status: 'started' });
        next();
      })
      .catch((e) => {
        res.status(500).send(e.message);
        next(e);
      });
  });

  app.post('/set_temperature', (req, res, next) => {
    const { temperature } = req.body;
    return controller.setTargetTemperature(temperature)
      .then(() => {
        res.json({ status: 'temperature set' });
        next();
      })
      .catch((e) => {
        res.status(500).send(e.message);
        next(e);
      });
  });

  app.post('/stop', (req, res, next) => {
    controller.stop();
    res.json({ status: 'paused' });
    next();
  });

  app.post('/shutdown', (req, res, next) => {
    return controller.shutdown()
      .then(() => {
        res.json({ status: 'shutdown' });
        next();
      })
      .catch((e) => {
        res.status(500).json({ error: e.message, stack: e.stack });
        next(e);
      });
  });

  app.listen(port);
}

module.exports = {
  initializeServer,
};
