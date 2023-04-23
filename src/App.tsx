import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { initBluePrint } from './blueprint/main'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    initBluePrint()
  }, []);

  return (
    <div className="App" id="container">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
    </div>
  )
}

export default App
