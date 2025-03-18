import { getApiUrl, API_CONFIG } from '../config';

export const getReadmeAdvice = async (inputData) => {
    if (!inputData) {
        throw new Error('データが必要です');
    }

    console.log('アドバイスリクエスト送信開始...');

    const requestData = {};

    if (inputData.repoInfo && inputData.repoInfo.owner && inputData.repoInfo.repo) {
        requestData.owner = inputData.repoInfo.owner;
        requestData.repo = inputData.repoInfo.repo;
    } else if (inputData.content) {
        requestData.content = inputData.content;
    } else {
        throw new Error('リポジトリ情報またはREADMEコンテンツが必要です');
    }

    const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.README_ADVICE);
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

    let responseData;
    try {
        responseData = JSON.parse(responseText);
    } catch (jsonError) {
        console.error('JSONパースエラー:', jsonError);
        throw new Error('レスポンスの解析に失敗');
    }

    return {
        advice: responseData.advice,
        newReadme: responseData.new_readme
    };
};
