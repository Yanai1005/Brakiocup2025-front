import React from 'react';
import './ReadmeAdviceModal.css';

const ReadmeAdviceModal = ({ isOpen, onClose, newReadme }) => {
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
                    <h2>READMEの改善例</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="readme-content">
                        <pre>{newReadme}</pre>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(newReadme)}
                    >
                        READMEをコピー
                    </button>
                    <button className="close-action-btn" onClick={onClose}>閉じる</button>
                </div>
            </div>
        </div>
    );
};

export default ReadmeAdviceModal;
