import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="app-name">Reader me</h1>

      <Link to="/text">
        <button className="navigate-btn">Go to Text</button>
      </Link>
    </div>
  );
};

export default Home;
