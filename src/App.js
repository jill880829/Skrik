import React, { Component } from 'react'
import { useState, useEffect } from 'react';
import Editor from './Editor'
// import useLocalStorage from '../hooks/useLocalStorage'
import './App.css';


function App() {
  const [python, setPython] = useState('');
  return (
    <Editor
      // language="python"
      // displayName="PYTHON"
      // value={python}
      // onChange={setPython}
    />
  )

}

export default App;
