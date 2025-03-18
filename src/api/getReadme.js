export const parseRepoUrl = (url) => {
    try {
        let cleanUrl = url.trim();

        if (cleanUrl.includes('github.com')) {
            cleanUrl = cleanUrl.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '');
        }

        const parts = cleanUrl.split('/');

        if (parts.length >= 2) {
            let owner = parts[0];
            let repo = parts[1].split('#')[0].split('?')[0];

            return { owner, repo };
        }

        throw new Error();
    } catch (error) {
        throw new Error('無効なGitHubリポジトリURLの形式');
    }
};

export const fetchReadmeContent = async (owner, repo) => {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`READMEの取得に失敗: ${response.status}`);
        }

        const data = await response.json();

        const base64Content = data.content.replace(/\n/g, '');
        const binaryString = atob(base64Content);
        const bytes = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const content = new TextDecoder('utf-8').decode(bytes);

        console.log('README取得成功:', content.substring(0, 100) + '...');
        return content;
    } catch (error) {
        console.error('READMEの取得エラー:', error);
        throw error;
    }
};
