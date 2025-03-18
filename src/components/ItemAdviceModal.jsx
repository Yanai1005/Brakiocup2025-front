import React, { useState, useEffect } from 'react';
import './ReadmeAdviceModal.css';

const ItemAdviceModal = ({ isOpen, onClose, advice }) => {
    const [processedAdvice, setProcessedAdvice] = useState('');

    useEffect(() => {
        if (advice) {
            setProcessedAdvice(advice);

            console.log("アドバイス原文:", advice);
        }
    }, [advice]);

    if (!isOpen) return null;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert('コピーしました'))
            .catch(err => console.error('コピーに失敗しました:', err));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>READMEの改善アドバイス</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="advice-content">
                        <pre>{processedAdvice}</pre>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(processedAdvice)}
                    >
                        アドバイスをコピー
                    </button>
                    <button className="close-action-btn" onClick={onClose}>閉じる</button>
                </div>
            </div>
        </div>
    );
};

export default ItemAdviceModal;
