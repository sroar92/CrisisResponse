import { NextRequest } from 'next/server';
import { Server } from 'socket.io';
import { createServer } from 'http';

// Global Socket.io server (prototype; use in production with proper setup)
let io: Server | null = null;

export async function GET(request: NextRequest) {
  if (!io) {
    const httpServer = createServer();
    io = new Server(httpServer, { cors: { origin: '*' } });
    httpServer.listen(4000);  // Separate port for Socket.io

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
    });
  }

  return new Response('Socket.io ready', { status: 200 });
}

// Export for API use
export { io };