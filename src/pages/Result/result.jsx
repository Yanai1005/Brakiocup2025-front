import { useLocation, Link } from 'react-router-dom';
import './result.css';
import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { Radar } from 'react-chartjs-2';
import { getReadmeAdvice } from '../../api/getReadmeAdvice';
import ReadmeAdviceModal from '../../components/ReadmeAdviceModal';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const Result = () => {
    const location = useLocation();
    const threeContainerRef = useRef(null);
    const [advice, setAdvice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
    const [camera, setCamera] = useState(null);
    const [isCameraClose, setIsCameraClose] = useState(false);

    const score = location.state ? location.state.score : 0;
    const evaluation = location.state ? location.state.evaluation : null;
    const repoInfo = location.state && location.state.repoInfo ? location.state.repoInfo : null;
    const textContent = location.state ? location.state.textContent : '';

    let grade = '';
    let imagePath = '';
    let imagePath2 = '/images/leaves2.png';
    let imagePath3 = '/images/grass.jpg';
    let numObjects = '';
    let numObjects2 = '';

    if (score >= 80) {
        grade = 'A';
        imagePath = '/images/geo-a.jpg';
        numObjects = score * 4;
        numObjects2 = score * 30;
    } else if (score >= 70) {
        grade = 'B';
        imagePath = '/images/geo-b.jpg';
        numObjects = score * 3;
        numObjects2 = score * 20;
    } else if (score >= 60) {
        grade = 'C';
        imagePath = '/images/geo-c.jpg';
        numObjects = score * 2;
        numObjects2 = score * 10;
    } else if (score >= 40) {
        grade = 'D';
        imagePath = '/images/geo-d.jpg';
        numObjects = score * 1;
        numObjects2 = score * 10;
    } else {
        grade = 'E';
        imagePath = '/images/geo-e.jpg';
        numObjects = score * 0;
        numObjects2 = score * 5;
    }

    useEffect(() => {
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        camera.position.z = 1;
        setCamera(camera);

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
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animation);

        if (threeContainerRef.current && !threeContainerRef.current.hasChildNodes()) {
            threeContainerRef.current.appendChild(renderer.domElement);
        }

        function animation(time) {
            sphere.rotation.y = time / 20000;
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

    const toggleCameraPosition = () => {
        if (camera) {
            if (isCameraClose) {
                camera.position.z = 1;
                camera.rotation.y = 0;
                camera.rotation.x = 0;
            } else {
                camera.position.z = 0.55;
                camera.rotation.y = Math.PI / 2;
                camera.rotation.x = Math.PI / 2;
            }
            setIsCameraClose(!isCameraClose);
        }
    };

    const getAdvice = async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = repoInfo
                ? { repoInfo }
                : { content: textContent };

            console.log("APIリクエスト送信:", data);

            const adviceResponse = await getReadmeAdvice(data);
            console.log("APIレスポンス受信:", adviceResponse);

            // アドバイスデータの存在確認
            if (!adviceResponse.advice && !adviceResponse.newReadme) {
                console.error("APIレスポンスにアドバイスデータがありません");
                setError("アドバイスデータの取得に失敗しました");
                return;
            }

            setAdvice(adviceResponse);
            setIsAdviceModalOpen(true);
        } catch (error) {
            console.error('アドバイス取得エラー:', error);
            setError(error.message || 'アドバイスの取得に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const closeAdviceModal = () => {
        setIsAdviceModalOpen(false);
    };
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
                backgroundColor: 'rgba(50, 205, 50, 0.2)',
                borderColor: 'rgba(50, 205, 50, 1)',
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
                    color: 'rgba(50, 205, 50, 0.8)',
                },
                pointLabels: {
                    color: 'rgba(50, 205, 50, 1)',
                    font: {
                        weight: 'bold'
                    }
                },
                angleLines: {
                    color: 'rgba(50, 205, 50, 0.3)'
                },
                grid: {
                    color: 'rgba(50, 205, 50, 0.3)'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'rgba(50, 205, 50, 1)'
                }
            }
        }
    };
    return (
        <div className="about-container">
            <div className="three-container" ref={threeContainerRef}></div>
            <div style={{ position: 'relative', zIndex: 10 }}>
                {repoInfo && (
                    <div>
                        <h2>リポジトリ 詳細</h2>
                        <p>Owner: <a href={`https://github.com/${repoInfo.owner}`} target="_blank" rel="noopener noreferrer">{repoInfo.owner}</a></p>
                        <p>Repository: <a href={`https://github.com/${repoInfo.owner}/${repoInfo.repo}`} target="_blank" rel="noopener noreferrer">{repoInfo.repo}</a></p>
                    </div>
                )}
            </div>
            <p style={{ position: 'relative', zIndex: 10 }}>あなたの評価: {grade} (スコア: {score}点)</p>

            {evaluation && (
                <div className="evaluation-details" style={{ position: 'relative', zIndex: 10 }}>
                    <h2>評価詳細</h2>
                    <Radar data={radarData} options={radarOptions} />
                    <div className="advice-button-container">
                        <button
                            className="advice-btn"
                            onClick={getAdvice}
                            disabled={isLoading || !textContent}
                        >
                            {isLoading ? 'アドバイス取得中...' : 'READMEのアドバイスを取得'}
                        </button>
                    </div>
                </div>
            )}
            {error && <p className="error-message" style={{ position: 'relative', zIndex: 10 }}>{error}</p>}
            {advice && (
                <ReadmeAdviceModal
                    isOpen={isAdviceModalOpen}
                    onClose={closeAdviceModal}
                    advice={advice.advice}
                    newReadme={advice.newReadme}
                />
            )}

            <button onClick={toggleCameraPosition} style={{ position: 'relative', zIndex: 10 }}>カメラの位置を切り替え</button>

            <Link to="/">
                <button className="navigate-btn">ホーム画面</button>
            </Link>
        </div>
    );
};

export default Result;
