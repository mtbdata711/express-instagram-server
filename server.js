//setup app
const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");
const https = require("https");
const cors = require("cors");

//setup env
require("dotenv").config();

const HTTP_PORT = 8080;
const HTTPS_PORT = 8443;

// setup cors
app.use(cors());

// setup routes
const { routes } = require("./routes");
app.use("/", routes);

// setup cron
const { cron } = require("./src/common/cron");

// here we go!

if( "DEV" === process.env.ENV ){
const key = fs.readFileSync("./src/certs/selfsigned.key", "utf8");
const cert = fs.readFileSync("./src/certs/selfsigned.crt", "utf8");
const httpServer = http.createServer(app);
const httpsServer = https.createServer({ key, cert }, app);

httpServer.listen(HTTP_PORT);
httpsServer.listen(HTTPS_PORT);

console.log(`🚀 server running port ${HTTP_PORT}`);
console.log(`🚀 server running port ${HTTPS_PORT}`);
}else{
app.listen(process.env.PORT || 3000, 
    () => console.log("🚀 server running")
);
}


