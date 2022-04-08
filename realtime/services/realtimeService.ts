import { JSONObjectOrArray } from 'common/types/JSON';
import io, { Socket } from 'common-server/utils/SocketIO';

io.sockets.on('connection', (socket: Socket) => {
    socket.on('project', (projectId: string) => {
        socket.join(projectId);
    });
});

export default class RealtimeService {
    public static send(
        projectId: string,
        eventType: string,
        data: JSONObjectOrArray
    ) {
        io.to(projectId).emit(eventType, data);
    }
}