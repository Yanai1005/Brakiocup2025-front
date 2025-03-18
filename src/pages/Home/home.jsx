import { useNavigate } from 'react-router-dom';
import './home.css';
import React, { useEffect, useState, useRef } from "react";
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
  const meshRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const initialVerticesRef = useRef(null);


  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;
    cameraRef.current = camera;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    initialVerticesRef.current = geometry.attributes.position.array.slice(); // 初期頂点を保存
    const textureLoader = new THREE.TextureLoader();
    const imagePath = '/images/geo-e.jpg';
    const texture = textureLoader.load(imagePath);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setAnimationLoop(animation);
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // animation
    function animation(time) {
      mesh.rotation.y = time / 20000;
      renderer.render(scene, camera);
    }

    return () => {
      scene.remove(mesh);
      renderer.domElement.remove();
      mesh.material.dispose();
      mesh.geometry.dispose();
    }
  }, []);

  const explodeModel = () => {
    const mesh = meshRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (mesh && scene && camera) {
      const vertices = mesh.geometry.attributes.position.array;
      const velocity = new Float32Array(vertices.length);

      for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];

        const length = Math.sqrt(x * x + y * y + z * z);
        const dirX = x / length;
        const dirY = y / length;
        const dirZ = z / length;

        const speed = Math.random() * 0.02 + 0.01;

        velocity[i] = dirX * speed;
        velocity[i + 1] = dirY * speed;
        velocity[i + 2] = dirZ * speed;
      }

      const animateExplosion = () => {
        for (let i = 0; i < vertices.length; i += 3) {
          vertices[i] += velocity[i];
          vertices[i + 1] += velocity[i + 1];
          vertices[i + 2] += velocity[i + 2];
        }
        mesh.geometry.attributes.position.needsUpdate = true;
        mesh.scale.multiplyScalar(0.99);
        rendererRef.current.render(scene, camera);
        if (mesh.scale.x > 0.01) {
          requestAnimationFrame(animateExplosion);
        }
      };

      animateExplosion();
    }
  };
  const resetModel = () => {
    const mesh = meshRef.current;
    const initialVertices = initialVerticesRef.current;
    if (mesh && initialVertices) {
      const vertices = mesh.geometry.attributes.position.array;
      for (let i = 0; i < vertices.length; i++) {
        vertices[i] = initialVertices[i];
      }
      mesh.geometry.attributes.position.needsUpdate = true;
      mesh.scale.set(1, 1, 1);
    }
  };
  const handleRepoUrlChange = (e) => {
    setRepoUrl(e.target.value);
    setError('');
    setShowAlert(false);
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
    resetModel();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowAlert(false);

    if (!repoUrl.trim()) {
      setAlertMessage('URLを設定してください');
      setShowAlert(true);
      explodeModel();
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
        explodeModel();
      }
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      setError(parseError.message || 'Invalid repository URL');
      explodeModel();
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
