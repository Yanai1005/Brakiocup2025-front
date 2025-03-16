import { Link } from 'react-router-dom';
import './home.css';  // home.cssを共通で使う

const About = () => {
  return (
    <div className="home-container">
      {/* アプリ名 */}
      <h1 className="app-name">Reader me</h1>

      {/* Homeページに遷移するボタン */}
      <Link to="/">
        <button className="navigate-btn">Go to Home</button>
      </Link>
    </div>
  );
};

export default About;
