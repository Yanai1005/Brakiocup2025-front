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
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);

        if (!response.ok) {
            throw new Error(`READMEの取得に失敗: ${response.status}`);
        }

        const data = await response.json();

        const content = atob(data.content.replace(/\n/g, ''));
        return content;
    } catch (error) {
        console.error('READMEの取得エラー:', error);
        throw error;
    }
};
