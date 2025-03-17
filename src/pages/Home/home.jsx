import { Link } from 'react-router-dom';
import './home.css';
import React, { useEffect } from "react"
import * as THREE from 'three'

const Home = () => {
  
  //useEffectの3dmodelを右画面だけにしたい
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
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
    <div className="home-container">
      <h1 className="app-name">Reader me</h1>

      <Link to="/text">
        <button className="navigate-btn">Go to Text</button>
      </Link>
    </div>
  );
};

export default Home;
