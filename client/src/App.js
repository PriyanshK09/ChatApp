// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';

import Sidebar from './components/Sidebar';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import Register from './components/Register';

const socket = io('http://localhost:5000');

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar socket={socket} />
        <Switch>
          <Route path="/login">
            <Login socket={socket} />
          </Route>
          <Route path="/register">
            <Register socket={socket} />
          </Route>
          <Route path="/">
            <ChatRoom socket={socket} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;