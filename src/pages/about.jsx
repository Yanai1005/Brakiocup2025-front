import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      <h1>Aboutページ</h1>
      <p>これはAboutページです。</p>
      <Link to="/">ホームページへ</Link>
    </div>
  );
};

export default About;
