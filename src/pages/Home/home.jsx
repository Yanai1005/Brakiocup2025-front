import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import React, { useEffect, useState } from "react";
import * as THREE from 'three';
import { parseRepoUrl, fetchReadmeContent } from '../../api/getReadme';
import { evaluateReadme } from '../../api/evaluateReadme';

const Home = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //useEffectの3dmodelを右画面だけにしたい
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setAnimationLoop(animation);
    document.body.appendChild(renderer.domElement);

    // animation
    function animation(time) {
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { owner, repo } = parseRepoUrl(repoUrl);

      const readmeContent = await fetchReadmeContent(owner, repo);

      const result = await evaluateReadme(readmeContent);

      const evaluationData = result.evaluation;
      const normalizedScore = result.score;

      navigate('/about', {
        state: {
          repoInfo: { owner, repo },
          textContent: readmeContent,
          score: normalizedScore,
          evaluation: evaluationData
        }
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to process repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1 className="app-name">Reader me</h1>

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
        >
          {isLoading ? 'Loading...' : 'README評価'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {/* Original button */}
      <Link to="/text">
        <button className="navigate-btn">Go to Text</button>
      </Link>
    </div >
  );
};

export default Home;
