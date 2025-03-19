import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import * as THREE from 'three';
import { getReadmeAnalysis } from '../../api/getReadmeAnalysis';
import './analysis.css';
import RadarChartComponent from '../../components/RadarChartComponent';
import DetailedBarChartComponent from '../../components/DetailedBarChartComponent';

// Chart.jsを登録
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const ProfileAnalysis = () => {
    const [username, setUsername] = useState('');
    const [analysisData, setAnalysisData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const threeContainerRef = useRef(null);

    // 3Dアニメーション
    useEffect(() => {
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        camera.position.z = 1;

        const scene = new THREE.Scene();

        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const imagePath = '/images/geo-b.jpg';  // デフォルト画像
        const texture = textureLoader.load(imagePath);
        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);  // 背景を透明に
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop(animation);

        if (threeContainerRef.current) {
            if (threeContainerRef.current.hasChildNodes()) {
                threeContainerRef.current.removeChild(threeContainerRef.current.firstChild);
            }
            threeContainerRef.current.appendChild(renderer.domElement);
        }

        function animation(time) {
            mesh.rotation.y = time / 20000;
            renderer.render(scene, camera);
        }

        return () => {
            scene.remove(mesh);
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
            mesh.material.dispose();
            mesh.geometry.dispose();
            renderer.dispose();
        };
    }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('ユーザー名を入力してください');
            return;
        }

        setIsLoading(true);
        setError('');
        setAnalysisData(null);

        try {
            const data = await getReadmeAnalysis(username, 10);
            setAnalysisData(data);
        } catch (error) {
            console.error('分析エラー:', error);
            setError(error.message || 'ユーザー分析に失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    // 総合評価を計算
    const getGrade = (score) => {
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 40) return 'D';
        return 'E';
    };

    // 平均総合スコアを計算（100点満点に正規化）
    const getNormalizedScore = () => {
        if (!analysisData || !analysisData.average_scores) return 0;

        const totalScore = analysisData.average_scores.total_score || 0;
        return Math.min(100, Math.round((totalScore / 50) * 100));
    };

    return (
        <div className="profile-analysis-container">
            <div className="three-container" ref={threeContainerRef}></div>

            {!analysisData && !isLoading && (
                <>
                    <h1 className="app-name">GitHub README傾向分析</h1>

                    <form className="profile-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="username-input"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="GitHubユーザー名"
                        />
                        <button
                            type="submit"
                            className="analyze-btn"
                            disabled={isLoading || !username.trim()}
                        >
                            {isLoading ? '分析中...' : 'プロフィール分析'}
                        </button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </>
            )}

            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>ユーザーのリポジトリを分析中...</p>
                </div>
            )}

            {analysisData && !isLoading && (
                <div className="results-container">
                    <div className="header-section">
                        <h2 className="section-title">{analysisData.username}のREADME傾向分析</h2>

                        <div className="stats-summary">
                            <div className="stats-badge">
                                <span>評価: {getGrade(getNormalizedScore())}</span>
                                <span>スコア: {getNormalizedScore()}点/100点</span>
                                <span>リポジトリ: {analysisData.analyzed_count}/{analysisData.repository_count}</span>
                            </div>
                            <button className="new-search-btn" onClick={() => setAnalysisData(null)}>新しい検索</button>
                        </div>
                    </div>

                    {analysisData.analyzed_count > 0 && (
                        <div className="charts-container">
                            {/* レーダーチャートコンポーネント */}
                            <RadarChartComponent analysisData={analysisData} />

                            {/* 詳細評価項目比較コンポーネント */}
                            <DetailedBarChartComponent analysisData={analysisData} />
                        </div>
                    )}
                </div>
            )}
            <div className="action-buttons">
                <Link to="/">
                    <button className="navigate-btn">ホーム画面</button>
                </Link>
            </div>
        </div>
    );
};

export default ProfileAnalysis;
