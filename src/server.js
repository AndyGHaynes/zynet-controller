const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment');
const WebSocket = require('ws');

const BROADCAST_UPDATE_INTERVAL = moment.duration(5, 'seconds').asMilliseconds();

const app = express();
app.use(bodyParser.json());

function initializeWebSocketServer(controller, port) {
  const wss = new WebSocket.Server({ port });
  let updateInterval;

  wss.on('connection', (ws) => {
    updateInterval = setInterval(() => {
      ws.send(JSON.stringify({
        update: controller.getUpdate(),
      }));
    }, BROADCAST_UPDATE_INTERVAL);
  });

  wss.on('close', () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });
}

function initializeServer({ port }, controller) {
  initializeWebSocketServer(controller, 4000);

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
