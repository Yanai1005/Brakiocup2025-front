import { useLocation, Link } from 'react-router-dom';
import './about.css';
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { getReadmeAdvice } from '../../api/getReadmeAdvice';
import ReadmeAdviceModal from '../../components/ReadmeAdviceModal';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);
const About = () => {
  const location = useLocation();
  const threeContainerRef = useRef(null);
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const score = location.state ? location.state.score : 0;
  const evaluation = location.state ? location.state.evaluation : null;
  const repoInfo = location.state && location.state.repoInfo ? location.state.repoInfo : null;
  const textContent = location.state ? location.state.textContent : '';

  let grade = '';
  let imagePath = '';
  let imagePath2 = '/images/green-leaves.jpg';
  let imagePath3 = '/images/dd_grass_01.jpg';
  let numObjects = '';
  let numObjects2 = '';

  if (score >= 80) {
    grade = 'A';
    imagePath = '/images/yukiSDIM11451799_TP_V.webp';
    numObjects = score * 4;
    numObjects2 = score * 30;
  } else if (score >= 60) {
    grade = 'B';
    imagePath = '/images/20170513022128.jpg';
    numObjects = score * 3;
    numObjects2 = score * 20;
  } else if (score >= 40) {
    grade = 'C';
    imagePath = '/images/jimen02_01.jpg';
    numObjects = score * 2;
    numObjects2 = score * 15;
  } else if (score >= 20) {
    grade = 'D';
    imagePath = '/images/top-view-soil_23-2148175893.jpg';
    numObjects = score * 1;
    numObjects2 = score * 10;
  } else {
    grade = 'E';
    imagePath = '/images/closeup.jpg';
    numObjects = score * 0;
    numObjects2 = score * 5;
  }

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imagePath);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const texture2 = textureLoader.load(imagePath2);
    const texture3 = textureLoader.load(imagePath3);
    const largeConeMaterial = new THREE.MeshBasicMaterial({ map: texture2 });
    const smallConeMaterial = new THREE.MeshBasicMaterial({ map: texture3 });

    const largeConeGeometry = new THREE.ConeGeometry(0.05, 0.1, 8);
    const smallConeGeometry = new THREE.ConeGeometry(0.02, 0.03, 6);

    for (let i = 0; i < numObjects; i++) {
      const coneMesh = new THREE.Mesh(largeConeGeometry, largeConeMaterial);

      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();

      const radius = 0.5;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      coneMesh.position.set(x, y, z);

      const normal = new THREE.Vector3(x, y, z).normalize();
      coneMesh.lookAt(normal);
      coneMesh.rotateX(Math.PI / 2);

      sphere.add(coneMesh);
    }

    for (let i = 0; i < numObjects2; i++) {
      const coneMesh = new THREE.Mesh(smallConeGeometry, smallConeMaterial);

      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();

      const radius = 0.5;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      coneMesh.position.set(x, y, z);

      const normal = new THREE.Vector3(x, y, z).normalize();
      coneMesh.lookAt(normal);
      coneMesh.rotateX(Math.PI / 2);

      sphere.add(coneMesh);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(1, 1, 1);
    scene.add(pointLight);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setAnimationLoop(animation);

    if (threeContainerRef.current && !threeContainerRef.current.hasChildNodes()) {
      threeContainerRef.current.appendChild(renderer.domElement);
    }

    function animation(time) {
      sphere.rotation.y = time / 10000;
      renderer.render(scene, camera);
    }

    return () => {
      scene.remove(sphere);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      sphere.material.dispose();
      sphere.geometry.dispose();
    };
  }, [imagePath, score]);

  const radarData = {
    labels: ['明確さ', '完全性', '構造化', '例示', '可読性'],
    datasets: [
      {
        label: '評価',
        data: [
          evaluation?.clarity ? Math.floor(evaluation.clarity) * 2 : 0,
          evaluation?.completeness ? Math.floor(evaluation.completeness) * 2 : 0,
          evaluation?.structure ? Math.floor(evaluation.structure) * 2 : 0,
          evaluation?.examples ? Math.floor(evaluation.examples) * 2 : 0,
          evaluation?.readability ? Math.floor(evaluation.readability) * 2 : 0,
        ],
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 1,
      },
    ],
  };
  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 20,
        ticks: {
          stepSize: 5,
        },
      },
    },
  }
  const handleGetAdvice = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = repoInfo
        ? { repoInfo }
        : { content: textContent };

      const adviceResponse = await getReadmeAdvice(data);
      setAdvice(adviceResponse);
      setIsModalOpen(true);
    } catch (error) {
      console.error('アドバイス取得エラー:', error);
      setError(error.message || 'アドバイスの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="about-container">
      <h1 className="app-name">Reader me</h1>
      {repoInfo && (
        <div>
          <h2>リポジトリ 詳細</h2>
          <p>Owner: <a href={`https://github.com/${repoInfo.owner}`} target="_blank" rel="noopener noreferrer">{repoInfo.owner}</a></p>
          <p>Repository: <a href={`https://github.com/${repoInfo.owner}/${repoInfo.repo}`} target="_blank" rel="noopener noreferrer">{repoInfo.repo}</a></p>
        </div>
      )}
      <p>あなたの評価: {grade} (スコア: {score}点)</p>
      {evaluation && (
        <div className="evaluation-details">
          <h2>評価詳細</h2>
          <Radar data={radarData} options={radarOptions} />
          <div className="advice-button-container">
            <button
              className="advice-btn"
              onClick={handleGetAdvice}
              disabled={isLoading || !textContent}
            >
              {isLoading ? '例取得中...' : 'READMEの改善例を取得'}
            </button>
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {advice && (
        <ReadmeAdviceModal
          isOpen={isModalOpen}
          onClose={closeModal}
          newReadme={advice.newReadme}
        />
      )}
      <div className="three-container" ref={threeContainerRef}></div>
      <Link to="/">
        <button className="navigate-btn">Go to Home</button>
      </Link>
    </div>
  );
};

export default About;
