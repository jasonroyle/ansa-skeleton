#!/usr/bin/env node

import * as Debug from 'debug';
import * as HTTP from 'http';
import * as SocketIO from 'socket.io';

import app from '../app';

const debug = Debug('WWW:WWW');

// get the port from the environment and store it in Express
const port = normalizePort(process.env.PORT);
app.set('port', port);

// create the HTTP server
const server = HTTP.createServer(app);

// attach the HTTP server to the SocketIO server
const io: SocketIO.Server = app.get('socket.io');
io.attach(server);

// listen on the provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
