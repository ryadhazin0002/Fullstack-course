import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/message')
    .then((res) => res.json())
    .then((data) => setMessage(data.message))
    },[])
  return (
    <div style={{ padding: 20}}>
      <p>Backend message: {message}</p>
    </div>
  )
}

export default App
