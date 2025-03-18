import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './text.css';
import { evaluateReadme } from '../../api/evaluateReadme';

const Text = () => {
  const [text, setText] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleScoreChange = (event) => {
    const value = Math.max(0, Math.min(100, parseInt(event.target.value) || 0));
    setScore(value);
  };

  const handleManualScore = () => {
    const rawScore = Math.round((score / 100) * 50);

    const itemScore = Math.round((score / 100) * 10 * 2);

    navigate('/about', {
      state: {
        textLength: text.length,
        textContent: text,
        score: score,
        evaluation: {
          total_score: rawScore,
          clarity: itemScore,
          completeness: itemScore,
          structure: itemScore,
          examples: itemScore,
          readability: itemScore
        }
      }
    });
  };
  // Readmeの評価
  const handleEvaluate = async () => {
    setIsLoading(true);

    try {
      const result = await evaluateReadme(text);

      navigate('/about', {
        state: {
          textLength: text.length,
          textContent: text,
          score: result.score,
          evaluation: result.evaluation
        }
      });
    } catch (error) {
      console.error('評価エラー:', error);
      alert('評価に失敗しました: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-container">
      <h1 className="app-name">Reader me</h1>

      <div className="text-area-container">
        <textarea
          className="text-area"
          value={text}
          onChange={handleTextChange}
          placeholder="ここにREADME文章を書いてください..."
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
        <button
          className="score-btn"
          onClick={handleManualScore}
        >
          スコアを適用
        </button>
      </div>

      <div className="button-container">
        <button
          className="navigate-btn"
          onClick={handleManualScore}
        >
          Go to About
        </button>

        {/* Geminiでの評価ボタン
        <button
          className="navigate-btn"
          onClick={handleEvaluate}
          disabled={isLoading}
        >
          {isLoading ? '評価中...' : 'READMEを評価する'}
        </button> */}
      </div>
    </div>
  );
};

export default Text;
