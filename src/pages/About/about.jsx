import { useLocation, Link } from 'react-router-dom';
import './about.css'; // about.css をインポート

const About = () => {
  const location = useLocation();

  // Text.jsx から渡された文字数と文章
  const textLength = location.state ? location.state.textLength : 0;
  const textContent = location.state ? location.state.textContent : '';

  return (
    <div className="about-container">
      {/* アプリ名の表示 */}
      <h1 className="app-name">Reader me</h1>

      {/* 文字数と文章そのものを表示 */}
      <p>Textページで入力された文字数: {textLength}文字</p>
      <p>入力された文章:</p>
      <pre>{textContent}</pre> {/* preタグを使ってそのままの形式で表示 */}

      {/* ホームページに戻るボタン */}
      <Link to="/">
        <button className="navigate-btn">Go to Home</button>
      </Link>
    </div>
  );
};

export default About;
