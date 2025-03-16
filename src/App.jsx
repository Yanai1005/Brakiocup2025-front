import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

// src/pages からコンポーネントをインポート
import Home from './pages/home';
import About from './pages/about';

function App() {
  return (
    <Router>
      <div>
        {/* ナビゲーションリンク */}
        <nav>
          <ul>
            <li>
              <Link to="/">ホーム</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        {/* ルートとコンポーネントの設定 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
