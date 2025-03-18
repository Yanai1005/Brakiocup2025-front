import { useNavigate, Link } from 'react-router-dom';
import './home.css';
import React, { useEffect, useState } from "react";
import * as THREE from 'three';
import { parseRepoUrl, fetchReadmeContent } from '../../api/getReadme';
import { evaluateReadme } from '../../api/evaluateReadme';

const Home = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const imagePath = '/images/geo-e.jpg';
    const texture = textureLoader.load(imagePath);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setAnimationLoop(animation);
    document.body.appendChild(renderer.domElement);

    // animation
    function animation(time) {
      mesh.rotation.y = time / 10000;
      renderer.render(scene, camera);
    }

    return () => {
      scene.remove(mesh);
      renderer.domElement.remove();
      mesh.material.dispose();
      mesh.geometry.dispose();
    }
  }, []);

  const handleRepoUrlChange = (e) => {
    setRepoUrl(e.target.value);
    setError('');
    setShowAlert(false);
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowAlert(false);

    if (!repoUrl.trim()) {
      setAlertMessage('URLを設定してください');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);

    try {
      const { owner, repo } = parseRepoUrl(repoUrl);

      try {
        const readmeContent = await fetchReadmeContent(owner, repo);

        const result = await evaluateReadme(readmeContent);
        const evaluationData = result.evaluation;
        const normalizedScore = result.score;

        navigate('/result', {
          state: {
            repoInfo: { owner, repo },
            textContent: readmeContent,
            score: normalizedScore,
            evaluation: evaluationData
          }
        });
      } catch (fetchError) {
        console.error('Fetch Error:', fetchError);
        if (fetchError.message.includes('404') || fetchError.status === 404) {
          setAlertMessage('README.mdがありません');
          setShowAlert(true);
        } else {
          setError(fetchError.message || 'Failed to fetch README content');
        }
      }
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      setError(parseError.message || 'Invalid repository URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1 className="app-name">Greend me</h1>

      <p>PublicのリポジトリのURLを入力してください</p>
      <p>READMEの内容を評価します</p>
      <p>※リポジトリにREADMEがない場合評価できません</p>
      <p>
        <Link to="/analysis">
          <button className="profile-analysis-btn">ユーザーのREADME傾向分析</button>
        </Link>
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="repo-input"
          value={repoUrl}
          onChange={handleRepoUrlChange}
          placeholder="GitHub repository URL"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="navigate-btn"
        >
          {isLoading ? 'Loading...' : 'README評価'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-box">
            <p className="alert-message">{alertMessage}</p>
            <button className="alert-close-btn" onClick={handleCloseAlert}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
