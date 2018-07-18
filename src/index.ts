import * as http from 'http';
import Server from './server';

const port = process.env.PORT || 5000;

Server.set('port', port);

console.log(`Server listening on Port ${port}`);

const server = http.createServer(Server);

server.listen(port);
