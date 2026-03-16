import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useWebSocket } from '../hooks/useWebSocket';

const Chat = () => {
  const { user } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { sendMessage, lastMessage } = useWebSocket();

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
    }
  }, [activeChat]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'new_message' && lastMessage.chatId === activeChat?.id) {
      setMessages(prev => [...prev, lastMessage.message]);
    }
  }, [lastMessage]);

  const fetchChats = async () => {
    const response = await api.get('/chats');
    setChats(response.data.groupChats); // simplified
  };

  const fetchMessages = async (chatId) => {
    const response = await api.get(`/chats/${chatId}/messages`);
    setMessages(response.data);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage({
      type: 'message',
      chatId: activeChat.id,
      content: newMessage,
    });
    setNewMessage('');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc' }}>
        <h2>Чаты</h2>
        <ul>
          {chats.map(chat => (
            <li key={chat.id} onClick={() => setActiveChat(chat)}>
              {chat.name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: '70%', padding: '1rem' }}>
        {activeChat && (
          <>
            <h2>{activeChat.name}</h2>
            <div style={{ height: '400px', overflowY: 'scroll' }}>
              {messages.map(msg => (
                <div key={msg.id}>
                  <strong>{msg.first_name} {msg.last_name}:</strong> {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend}>Отправить</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
