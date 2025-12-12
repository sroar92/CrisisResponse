import { CommunicationType } from '@/lib/types';
import { Socket } from 'socket.io-client';

class CommunicationService {
  private socket: Socket | null = null;
  private messages: CommunicationType[] = [];

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  sendMessage(from: string, to: string, message: string) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    const newMessage: CommunicationType = {
      id: Date.now(),
      from,
      to,
      message,
      time: new Date().toLocaleTimeString()
    };

    this.socket.emit('send:message', newMessage);
    this.messages.unshift(newMessage);

    return newMessage;
  }

  receiveMessage(message: CommunicationType) {
    this.messages.unshift(message);
  }

  getMessages() {
    return this.messages;
  }

  getMessagesByUnit(unitId: string) {
    return this.messages.filter(
      msg => msg.from === unitId || msg.to === unitId
    );
  }

  clearMessages() {
    this.messages = [];
  }
}

export const communicationService = new CommunicationService();