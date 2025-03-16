import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* アプリ名 */}
      <h1 className="app-name">Reader me</h1>

      {/* Textページに遷移するボタン */}
      <Link to="/text">
        <button className="navigate-btn">Go to Text</button>
      </Link>
    </div>
  );
};

export default Home;
