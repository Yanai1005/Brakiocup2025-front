import { useState } from 'react';
import { Link } from 'react-router-dom';
import './text.css';

const Text = () => {
  const [text, setText] = useState('');
  const [score, setScore] = useState(0);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleScoreChange = (event) => {
    const value = Math.max(0, Math.min(100, event.target.value));
    setScore(value);
  };

  return (
    <div className="text-container">
      <h1 className="app-name">Reader me</h1>

      <div className="text-area-container">
        <textarea
          className="text-area"
          value={text}
          onChange={handleTextChange}
          placeholder="ここに文章を書いてください..."
        ></textarea>
      </div>


      <div className="score-container">
        <label htmlFor="score">点数 (0〜100): </label>
        <input
          id="score"
          type="number"
          value={score}
          onChange={handleScoreChange}
          min="0"
          max="100"
        />
      </div>

      <Link to="/about" state={{ textLength: text.length, textContent: text, score: score }}>
        <button className="navigate-btn">Go to About</button>
      </Link>
    </div>
  );
};

export default Text;
