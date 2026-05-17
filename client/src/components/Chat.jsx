import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import api from '../services/api';

const socket = io('http://localhost:5002');

export default function Chat({ ticketId }) {
  const { user } = useSelector(state => state.auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    // Load existing messages
    api.get(`/messages/${ticketId}`).then(res => setMessages(res.data));

    // Join the room for this ticket
    socket.emit('joinRoom', ticketId);

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [ticketId]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit('sendMessage', {
      ticketId,
      text,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role
    });

    setText('');
  };

  return (
    <div className="card mt-4">
      <div className="card-header fw-semibold">
        Live Chat
      </div>

      {/* Messages */}
      <div className="card-body" style={{ height: 320, overflowY: 'auto' }}>
        {messages.length === 0 && (
          <p className="text-muted text-center mt-4">
            No messages yet. Start the conversation.
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender._id === user.id || msg.sender._id === user._id;
          return (
            <div
              key={msg._id}
              className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`px-3 py-2 rounded-3 ${isMe ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                style={{ maxWidth: '70%' }}
              >
                {!isMe && (
                  <div style={{ fontSize: 11 }} className="text-muted mb-1">
                    {msg.sender.name} · {msg.sender.role}
                  </div>
                )}
                <div>{msg.text}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="card-footer">
        <form onSubmit={handleSend} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}