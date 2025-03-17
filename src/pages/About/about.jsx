import { useLocation, Link } from 'react-router-dom';
import './about.css';
import React, { useEffect } from "react"
import * as THREE from 'three'

const About = () => {

  
  const location = useLocation();

  const textLength = location.state ? location.state.textLength : 0;
  const textContent = location.state ? location.state.textContent : '';
  const score = location.state ? location.state.score : 0;

  let grade = '';
  let imagePath = ''; 

  if (score >= 90) {
    grade = 'A';
    imagePath = '/images/tree5.png';
  } else if (score >= 80) {
    grade = 'B';
    imagePath = '/images/tree4.png';
  } else if (score >= 70) {
    grade = 'C';
    imagePath = '/images/tree3.png';
  } else if (score >= 60) {
    grade = 'D';
    imagePath = '/images/tree2.png';
  } else {
    grade = 'E';
    imagePath = '/images/tree1.png';
  }
  useEffect(() => {
      const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
      camera.position.z = 1;
  
      const scene = new THREE.Scene();
  
      const geometry = new THREE.SphereGeometry(0.3, 32, 64);
      const material = new THREE.MeshNormalMaterial();
  
      const mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );
  
      const renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setSize( window.innerWidth / 2, window.innerHeight / 2);
      renderer.setAnimationLoop( animation );
      document.body.appendChild( renderer.domElement );
  
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
    }, [])

  return (
    <div className="about-container">
      <h1 className="app-name">Reader me</h1>

      <p>Textページで入力された文字数: {textLength}文字</p>
      <p>入力された文章:</p>
      <pre>{textContent}</pre>

      <p>あなたの評価: {grade}</p>

      <div className="image-container">
        <img src={imagePath} alt="評価に基づく画像" className="tree-image" />
      </div>

      <Link to="/">
        <button className="navigate-btn">Go to Home</button>
      </Link>
    </div>
  );
};

export default About;
