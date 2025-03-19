import { getApiUrl, API_CONFIG } from '../config';

export const getReadmeAnalysis = async (username, maxRepos = 10) => {
    if (!username.trim()) {
        throw new Error('ユーザー名を入力してください');
    }

    console.log('ユーザー分析リクエスト送信開始...');

    const requestData = {
        username: username,
        max_repos: maxRepos
    };

    const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.USER_ANALYSIS);
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
    console.log('レスポンス本文の一部:', responseText.substring(0, 200) + '...');

    if (!response.ok) {
        try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.error || `APIエラー: ${response.status}`);
        } catch (jsonError) {
            throw new Error(`APIエラー: ${response.status} - ${responseText.substring(0, 100)}`);
        }
    }

    let data;
    try {
        data = JSON.parse(responseText);
    } catch (jsonError) {
        console.error('JSONパースエラー:', jsonError);
        throw new Error('レスポンスの解析に失敗');
    }

    return data;
};
