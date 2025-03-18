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
  let imagePath2 = '/images/green-leaves.jpg';
  let imagePath3 = '/images/grass-texture.jpg';
  let numObjects = '';
  let numObjects2 = '';

  if (score >= 90) {
    grade = 'A';
    numObjects = '100';
    numObjects2 = '1000';
    imagePath = '/images/20170513022128.jpg';
  } else if (score >= 80) {
    grade = 'B';
    numObjects = '80';
    numObjects2 = '800';
    imagePath = '/images/20170513022128.jpg';
  } else if (score >= 70) {
    grade = 'C';
    numObjects = '60';
    numObjects2 = '600';
    imagePath = '/images/20170513022128.jpg';
  } else if (score >= 60) {
    grade = 'D';
    numObjects = '40';
    numObjects2 = '400';
    imagePath = '/images/土の枯.jpg';
  } else {
    grade = 'E';
    numObjects = '0';
    numObjects2 = '200';
    imagePath = '/images/top-view-soil_23-2148175893.jpg';
    imagePath2 = '/images/green-leaves.jpg';
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
    const smallConeGeometry = new THREE.ConeGeometry(0.02, 0.05, 6);

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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setAnimationLoop(animation);

    if (threeContainerRef.current && !threeContainerRef.current.hasChildNodes()) {
      threeContainerRef.current.appendChild(renderer.domElement);
    }

    function animation(time) {
      sphere.rotation.x = time / 2000;
      sphere.rotation.y = time / 1000;
      renderer.render(scene, camera);
    }

    return () => {
      scene.remove(sphere);
      renderer.domElement.remove();
      sphere.material.dispose();
      sphere.geometry.dispose();
    };
  }, [imagePath, score]);

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
            {evaluation.clarity !== undefined && <li>明確さ: {Math.floor(evaluation.clarity) * 2}/20</li>}
            {evaluation.completeness !== undefined && <li>完全性: {Math.floor(evaluation.completeness) * 2}/20</li>}
            {evaluation.structure !== undefined && <li>構造化: {Math.floor(evaluation.structure) * 2}/20</li>}
            {evaluation.examples !== undefined && <li>例示: {Math.floor(evaluation.examples) * 2}/20</li>}
            {evaluation.readability !== undefined && <li>可読性: {Math.floor(evaluation.readability) * 2}/20</li>}
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