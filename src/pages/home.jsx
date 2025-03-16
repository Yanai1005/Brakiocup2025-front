import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>ホームページ</h1>
      <p>これはホームページです。</p>
      <Link to="/about">Aboutページへ</Link>
    </div>
  );
};

export default Home;
