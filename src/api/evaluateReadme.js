import { getApiUrl, API_CONFIG } from '../config';

export const evaluateReadme = async (text) => {
    if (!text.trim()) {
        throw new Error('テキストを入力してください');
    }

    console.log('評価リクエスト送信開始...');

    const requestData = {
        content: text
    };

    const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.EVALUATE);
    console.log('リクエストURL:', apiUrl);
    console.log('リクエスト本文:', JSON.stringify(requestData));

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(requestData)
    });

    console.log('レスポンスステータス:', response.status);
    console.log('レスポンスヘッダー:', Object.fromEntries([...response.headers]));

    const responseText = await response.text();
    console.log('レスポンス本文:', responseText);

    if (!response.ok) {
        try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.error || `APIエラー: ${response.status}`);
        } catch (jsonError) {
            throw new Error(`APIエラー: ${response.status} - ${responseText}`);
        }
    }

    let data;
    try {
        data = JSON.parse(responseText);
    } catch (jsonError) {
        console.error('JSONパースエラー:', jsonError);
        throw new Error('レスポンスの解析に失敗');
    }

    const totalScore = data.total_score || 0;
    const normalizedScore = Math.min(100, Math.round((totalScore / 50) * 100));

    console.log('計算されたスコア:', normalizedScore);
    console.log('評価データ:', data);

    return {
        score: normalizedScore,
        evaluation: data
    };
};
