//(C)2023 giovanni ortu

var express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  mqtt = require("mqtt");

const mqtthost = "10.0.128.128";
const mqttport = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const app = express();
const port = 8080;

app.use("/", express.static(__dirname + "/public/"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectUrl = `mqtt://${mqtthost}:${mqttport}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log("Connected");
  client.subscribe(
    [
      "/ufficio28/acquario/mainlight/status/+",
      "/ufficio28/acquario/ambilight/status/+",
    ],
    () => {
      console.log(`Subscribe to topic status`);
    }
  );
});

client.on("message", (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());
});

app.post("/send-command", function (req, res) {
  console.log(req.body);

  var topic = req.body.topic;
  var msg = req.body.message;

  console.log(topic);
  console.log(msg);

  client.publish(
    topic,
    JSON.stringify(msg),
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );

  res.send("Okay");
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
