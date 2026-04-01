export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const payloadBase64Url = token.split('.')[1];
    if (!payloadBase64Url) return true;
    
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(payloadBase64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );

    const decoded = JSON.parse(jsonPayload);
    // exp is usually in seconds
    if (decoded.exp) {
      const expirationTime = decoded.exp * 1000;
      return Date.now() >= expirationTime;
    }

    return false; // If there is no exp field, treat as not expired based on time
  } catch (error) {
    console.error('Lỗi khi kiểm tra token:', error);
    return true; // Assume expired if malformed
  }
};
