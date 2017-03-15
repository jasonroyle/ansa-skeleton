import * as BodyParser from 'body-parser';
import * as CookieParser from 'cookie-parser';
import * as Debug from 'debug';
import * as Express from 'express';
import * as Logger from 'morgan';
import * as Path from 'path';
import * as Favicon from 'serve-favicon';
import * as SocketIO from 'socket.io';

import { HTTPError } from 'ansa';
import APIRouter from './routes/api';

const app = Express();
const debug = Debug('WWW:APP');

// create the SocketIO server and store it in Express
const socketio = SocketIO();
app.set('socket.io', socketio);

// view engine setup
app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(Favicon(Path.join(__dirname, 'public', 'favicon.ico')));
app.use(Logger('dev'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(CookieParser());
// serve the client
app.use(Express.static(Path.join(__dirname, '../../client/dist')));
// serve the node modules
app.use('/node_modules', Express.static(Path.join(__dirname, '../../node_modules')));
// serve the API
app.use('/api', APIRouter);
// hand off any remaining `get` requests to the client
app.get('/*', function(req, res, next) {
  res.sendFile(Path.join(__dirname, '../../client/dist/index.html'));
} as Express.RequestHandler);

// catch 404 errors and forward them to the error handler
app.use(function(req, res, next) {
  next(new HTTPError(404));
} as Express.RequestHandler);

// error handler
app.use(function(err, req, res, next) {
  // debug error
  debug(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
} as Express.ErrorRequestHandler);

export default app;
