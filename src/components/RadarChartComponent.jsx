import React from 'react';
import { Radar } from 'react-chartjs-2';

const RadarChartComponent = ({ analysisData }) => {
    // データがない場合は何も表示しない
    if (!analysisData || !analysisData.average_scores) {
        return <div className="no-data">データがありません</div>;
    }

    // レーダーチャートのデータ
    const radarData = {
        labels: ['明確さ', '完全性', '構造化', '例示', '可読性'],
        datasets: [
            {
                label: '平均評価',
                data: [
                    analysisData.average_scores.clarity * 2,
                    analysisData.average_scores.completeness * 2,
                    analysisData.average_scores.structure * 2,
                    analysisData.average_scores.examples * 2,
                    analysisData.average_scores.readability * 2
                ],
                backgroundColor: 'rgba(50, 205, 50, 0.3)',
                borderColor: 'rgba(50, 205, 50, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(50, 205, 50, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(50, 205, 50, 1)',
                pointRadius: 5,
                pointHoverRadius: 7
            },
        ],
    };

    // レーダーチャートのオプション
    const radarOptions = {
        scales: {
            r: {
                min: 0,
                max: 20,
                ticks: {
                    stepSize: 5,
                    color: 'rgba(50, 205, 50, 0.8)',
                    backdropColor: 'transparent',
                    z: 100
                },
                pointLabels: {
                    color: 'rgba(50, 205, 50, 1)',
                    font: {
                        size: 14,
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
                position: 'top',
                labels: {
                    color: 'rgba(50, 205, 50, 1)',
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
        devicePixelRatio: 2,
        maintainAspectRatio: false
    };

    return (
        <div className="chart-wrapper">
            <h3 className="chart-title">READMEの平均評価</h3>
            <div style={{ height: '350px' }}>
                <Radar data={radarData} options={radarOptions} />
            </div>
        </div>
    );
};

export default RadarChartComponent;
