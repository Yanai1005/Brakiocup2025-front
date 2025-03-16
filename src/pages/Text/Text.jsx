import { useState } from 'react';
import { Link } from 'react-router-dom';
import './text.css';

const Text = () => {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="text-container">
      <h1 className="app-name">Reader me</h1>

      <div className="text-area-container">
        <textarea
          className="text-area"
          value={text}
          onChange={handleChange}
          placeholder="ここに文章を書いてください..."
        ></textarea>
      </div>

      {/* 文字数と文章そのものをstateとして渡す */}
      <Link to="/about" state={{ textLength: text.length, textContent: text }}>
        <button className="navigate-btn">Go to About</button>
      </Link>
    </div>
  );
};

export default Text;
