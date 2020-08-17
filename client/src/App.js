import React, { useEffect } from 'react';
import logo from './logo.svg';
import axios from "axios";
import './App.css';

const App = () => {
  useEffect(() => {
    axios.get("/status").then((res) => {
      console.log("axios", res);
    }).catch(err => {
      console.log("axios error", err);
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
