import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway {
  @WebSocketServer()
  server: Server;

  emitLogCreated(log: any) {
    this.server.emit('log.created', log);
  }

  emitIncidentUpdated(incident: any) {
    this.server.emit('incident.updated', incident);
  }
}
