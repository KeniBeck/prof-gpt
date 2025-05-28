import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./views/Home"
import Login from "./views/Login"

function App() {


  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="login" element={<Login/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
