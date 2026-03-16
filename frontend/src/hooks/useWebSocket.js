import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export const useWebSocket = () => {
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('accessToken');
    const socket = new WebSocket(`${process.env.REACT_APP_WS_URL || 'ws://localhost:5000'}?token=${token}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [isAuthenticated, user]);

  const sendMessage = (msg) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  };

  return { sendMessage, lastMessage };
};
