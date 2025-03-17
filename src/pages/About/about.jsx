import { useLocation, Link } from 'react-router-dom';
import './about.css';
import React, { useEffect, useRef } from "react"
import * as THREE from 'three'

const About = () => {
  const location = useLocation();
  const threeContainerRef = useRef(null);

  const textLength = location.state ? location.state.textLength : 0;
  const textContent = location.state ? location.state.textContent : '';
  const score = location.state ? location.state.score : 0;

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
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imagePath);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
    renderer.setAnimationLoop( animation );

    if (threeContainerRef.current && !threeContainerRef.current.hasChildNodes()) {
      threeContainerRef.current.appendChild( renderer.domElement );
    }

    // animation
    function animation(time) {
      mesh.rotation.x = time / 2000;
      mesh.rotation.y = time / 1000;
      renderer.render( scene, camera );
    }

    return () => {
      scene.remove(mesh);
      renderer.domElement.remove();
      mesh.material.dispose();
      mesh.geometry.dispose();
    }
  }, [imagePath])

  return (
    <div className="about-container">
      <h1 className="app-name">Reader me</h1>

      <p>Textページで入力された文字数: {textLength}文字</p>
      <p>入力された文章:</p>
      <pre>{textContent}</pre>

      <p>あなたの評価: {grade}</p>
    
      <div className="three-container" ref={threeContainerRef}></div>

      <Link to="/">
        <button className="navigate-btn">Go to Home</button>
      </Link>

      
    </div>
  );
};

export default About;