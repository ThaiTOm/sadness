import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Beforeunload } from 'react-beforeunload';

import socketApp from './socket';
import { getCookie } from './helpers/auth';
let id = getCookie().token
let socket = socketApp.getSocket()

ReactDOM.render(
  <React.StrictMode>
    <Beforeunload onBeforeunload={() => id ? socket.emit("offline", { id }) : console.log()}>
      <App />
    </Beforeunload>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
