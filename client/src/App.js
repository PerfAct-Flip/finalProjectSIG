import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL);

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [profile, setProfile] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [receiver, setReceiver] = useState('');

    const signup = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/signup`, { username, password });
            alert('User created successfully');
        } catch (err) {
            console.error(err);
        }
    };

    const login = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
            setToken(res.data.token);
        } catch (err) {
            console.error(err);
        }
    };

    const getProfile = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data.profile);
        } catch (err) {
            console.error(err);
        }
    };

    const updateProfile = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/profile`, { profile }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data.profile);
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = () => {
        socket.emit('sendMessage', {
            sender: username,
            receiver,
            message
        });
        setMessage('');
    };

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    return (
        <div>
            <h1>Chat</h1>
            <div>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={signup}>Sign Up</button>
                <button onClick={login}>Log In</button>
            </div>
            <div>
                <input type="text" placeholder="Profile" value={profile} onChange={(e) => setProfile(e.target.value)} />
                <button onClick={getProfile}>Get Profile</button>
                <button onClick={updateProfile}>Update Profile</button>
            </div>
            <div>
                <input type="text" placeholder="Receiver" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
                <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendMessage}>Send Message</button>
            </div>
            <div>
                <h2>Messages</h2>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}</strong>: {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
