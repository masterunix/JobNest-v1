import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { user } = useAuth();
  const [connected, setConnected] = React.useState(false);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user && socketRef.current && connected) {
      socketRef.current.emit('join', { userId: user.id || user._id, role: user.role });
    }
  }, [user, connected]);

  return (
    <SocketContext.Provider value={connected ? socketRef.current : null}>
      {children}
    </SocketContext.Provider>
  );
}; 