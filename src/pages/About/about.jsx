import { useLocation, Link } from 'react-router-dom';
import './about.css';
import React, { useEffect, useRef } from "react";
import * as THREE from 'three';

const About = () => {
  const location = useLocation();
  const threeContainerRef = useRef(null);

  const score = location.state ? location.state.score : 0;
  const evaluation = location.state ? location.state.evaluation : null;
  const repoInfo = location.state && location.state.repoInfo ? location.state.repoInfo : null;

  let grade = '';
  let imagePath = '';

  if (score >= 90) {
    grade = 'A';
    imagePath = '/images/A.png';
  } else if (score >= 80) {
    grade = 'B';
    imagePath = '/images/B.png';
  } else if (score >= 70) {
    grade = 'C';
    imagePath = '/images/C.png';
  } else if (score >= 60) {
    grade = 'D';
    imagePath = '/images/D.png';
  } else {
    grade = 'E';
    imagePath = '/images/E.png';
  }

  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imagePath);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setAnimationLoop(animation);

    if (threeContainerRef.current && !threeContainerRef.current.hasChildNodes()) {
      threeContainerRef.current.appendChild(renderer.domElement);
    }

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
  }, [imagePath]);

  return (
    <div>
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
          <ul>
            {evaluation.clarity !== undefined && <li>明確さ: {Math.floor(evaluation.clarity)}/20</li>}
            {evaluation.completeness !== undefined && <li>完全性: {Math.floor(evaluation.completeness)}/20</li>}
            {evaluation.structure !== undefined && <li>構造化: {Math.floor(evaluation.structure)}/20</li>}
            {evaluation.examples !== undefined && <li>例示: {Math.floor(evaluation.examples)}/20</li>}
            {evaluation.readability !== undefined && <li>可読性: {Math.floor(evaluation.readability)}/20</li>}
          </ul>
        </div>
      )}
      <div className="three-container" ref={threeContainerRef}></div>
      <Link to="/">
        <button className="navigate-btn">Go to Home</button>
      </Link>
    </div>
  );
};

export default About;
