import React from 'react';
import { Bar } from 'react-chartjs-2';

const DetailedBarChartComponent = ({ analysisData }) => {
    // データがない場合は何も表示しない
    if (!analysisData || !analysisData.repo_analyses) {
        return <div className="no-data">データがありません</div>;
    }

    // READMEがあるリポジトリのみをフィルタリング
    const reposWithReadme = analysisData.repo_analyses.filter(repo => repo.has_readme);

    // READMEがあるリポジトリがない場合は何も表示しない
    if (reposWithReadme.length === 0) {
        return <div className="no-data">分析可能なREADMEがありません</div>;
    }

    // 詳細なスコアの棒グラフデータ
    const detailedBarData = {
        labels: reposWithReadme.map(repo => repo.repo_name),
        datasets: [
            {
                label: '明確さ',
                data: reposWithReadme.map(repo => repo.scores.clarity),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)',
            },
            {
                label: '完全性',
                data: reposWithReadme.map(repo => repo.scores.completeness),
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: 'rgba(255, 99, 132, 0.9)',
            },
            {
                label: '構造化',
                data: reposWithReadme.map(repo => repo.scores.structure),
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: 'rgba(255, 206, 86, 0.9)',
            },
            {
                label: '例示',
                data: reposWithReadme.map(repo => repo.scores.examples),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.9)',
            },
            {
                label: '可読性',
                data: reposWithReadme.map(repo => repo.scores.readability),
                backgroundColor: 'rgba(153, 102, 255, 0.7)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                borderRadius: 5,
                hoverBackgroundColor: 'rgba(153, 102, 255, 0.9)',
            }
        ]
    };

    // 詳細な棒グラフのオプション
    const detailedBarOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                border: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            x: {
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12
                    },
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: false
                },
                border: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        size: 14
                    },
                    boxWidth: 15,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 16
                },
                bodyFont: {
                    size: 14
                },
                padding: 10
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        barThickness: 12,
        maxBarThickness: 15,
        categoryPercentage: 0.8,
        barPercentage: 0.9
    };

    return (
        <div className="chart-wrapper">
            <h3 className="chart-title">詳細評価項目比較</h3>
            <div style={{ height: '350px' }}>
                <Bar data={detailedBarData} options={detailedBarOptions} />
            </div>
        </div>
    );
};

export default DetailedBarChartComponent;
