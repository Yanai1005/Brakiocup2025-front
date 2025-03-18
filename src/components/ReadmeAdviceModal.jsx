import React, { useState, useEffect } from 'react';
import './ReadmeAdviceModal.css';

const ReadmeAdviceModal = ({ isOpen, onClose, advice, newReadme }) => {
    // 表示モード: 'advice' または 'readme'
    const [displayMode, setDisplayMode] = useState('advice');
    const [processedAdvice, setProcessedAdvice] = useState('');

    useEffect(() => {
        if (advice) {
            try {
                // 「## 改善アドバイス」から「## 改善されたREADMEの例」の前までを抽出
                const advicePattern = /## 改善アドバイス\s+([\s\S]*?)(?=## 改善されたREADMEの例|\Z)/;
                const matches = advice.match(advicePattern);

                if (matches && matches[1]) {
                    setProcessedAdvice(matches[1].trim());
                } else {
                    // 抽出できなかった場合は元のテキストをそのまま表示
                    console.log("アドバイス部分の抽出に失敗。元のテキストを表示します。");
                    setProcessedAdvice(advice);
                }
            } catch (error) {
                console.error("アドバイステキストの処理中にエラー:", error);
                setProcessedAdvice(advice);
            }
        }
    }, [advice]);

    if (!isOpen) return null;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert('コピーしました'))
            .catch(err => console.error('コピーに失敗しました:', err));
    };

    const toggleDisplayMode = () => {
        setDisplayMode(displayMode === 'advice' ? 'readme' : 'advice');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{displayMode === 'advice' ? 'READMEの改善アドバイス' : '改善されたREADME'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {displayMode === 'advice' ? (
                        <div className="advice-content">
                            <pre>{processedAdvice}</pre>
                            {newReadme && (
                                <div className="view-improved-btn-container">
                                    <button
                                        className="view-improved-btn"
                                        onClick={toggleDisplayMode}
                                    >
                                        改善されたREADMEを表示
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="readme-content">
                            <pre>{newReadme}</pre>
                            <div className="view-improved-btn-container">
                                <button
                                    className="view-improved-btn back-to-advice"
                                    onClick={toggleDisplayMode}
                                >
                                    アドバイスに戻る
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(displayMode === 'advice' ? processedAdvice : newReadme)}
                    >
                        {displayMode === 'advice' ? 'アドバイスをコピー' : 'READMEをコピー'}
                    </button>
                    <button className="close-action-btn" onClick={onClose}>閉じる</button>
                </div>
            </div>
        </div>
    );
};

export default ReadmeAdviceModal;
