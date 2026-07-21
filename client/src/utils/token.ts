let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

export const setTokens = (accessToken: string | null, refreshToken: string | null) => {
  memoryAccessToken = accessToken;
  memoryRefreshToken = refreshToken;
};

export const getAccessToken = () => memoryAccessToken;
export const getRefreshToken = () => memoryRefreshToken;

export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};
