import { useState } from 'react';
import { Link } from 'react-router-dom';
import './text.css'; // text.css ファイルをインポート

const Text = () => {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="text-container">
      {/* アプリ名 */}
      <h1 className="app-name">Reader me</h1>

      {/* 文章入力エリア */}
      <div className="text-area-container">
        <textarea
          className="text-area"
          value={text}
          onChange={handleChange}
          placeholder="ここに文章を書いてください..."
        ></textarea>
      </div>

      {/* Aboutページに遷移するボタン */}
      <Link to="/about">
        <button className="navigate-btn">Go to About</button>
      </Link>

    </div>
  );
};

export default Text;
