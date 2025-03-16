import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

// src/pages からコンポーネントをインポート
import Home from './pages/home';
import About from './pages/about';
import Text from './pages/Text';  // 新しいページ（Text）をインポート

function App() {
  return (
    <Router>
      <div>
        {/* ルートとコンポーネントの設定 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/text" element={<Text />} /> {/* 新しいページのルート */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
