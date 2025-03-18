export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',

    ENDPOINTS: {
        EVALUATE: '/evaluate',
        README_ADVICE: '/github/advice',
        USER_ANALYSIS: '/github/analysis'
    }
};

export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};
