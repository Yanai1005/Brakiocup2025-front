import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/home';
import About from './pages/About/about';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
