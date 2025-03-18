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
  let numObjects = '';

  if (score >= 90) {
    grade = 'A';
    numObjects = '30';
    imagePath = '/images/A.png';
  } else if (score >= 80) {
    grade = 'B';
    numObjects = '25';
    imagePath = '/images/B.png';
  } else if (score >= 70) {
    grade = 'C';
    numObjects = '20';
    imagePath = '/images/C.png';
  } else if (score >= 60) {
    grade = 'D';
    numObjects = '15';
    imagePath = '/images/D.png';
  } else {
    grade = 'E';
    numObjects = '10';
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

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // メモ:ここで物体の大きさや形をscoreに応じて変更したい
    // メモ:同じ物体をいっぱい作って、それぞれの物体に違うスコアに応じた形や大きさを設定してもいいかもしれない
    let attachedGeometry;
    let attachedMaterial = new THREE.MeshBasicMaterial({ map: texture });

    if (score >= 90) {
      attachedGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    } else if (score >= 80) {
      attachedGeometry = new THREE.ConeGeometry(0.1, 0.2, 32);
    } else if (score >= 70) {
      attachedGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
    } else if (score >= 60) {
      attachedGeometry = new THREE.TorusGeometry(0.1, 0.03, 16, 100);
    } else {
      attachedGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    }

    
    for (let i = 0; i < numObjects; i++) {
    const attachedMesh = new THREE.Mesh(attachedGeometry, attachedMaterial);


    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const radius = 0.5; 
    attachedMesh.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );

    sphere.add(attachedMesh);
  }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    renderer.setAnimationLoop(animation);

    if (threeContainerRef.current && !threeContainerRef.current.hasChildNodes()) {
      threeContainerRef.current.appendChild(renderer.domElement);
    }

    // animation
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
      {evaluation && (
        <div className="evaluation-details">
          <h2>評価詳細</h2>
          <ul>
            <p>あなたの評価: {grade} (スコア: {score}点)</p>
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