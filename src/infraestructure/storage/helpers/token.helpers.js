 export const tokenHelper = {
   getAccessToken: () => localStorage.getItem('accessToken'),
   getRefreshToken: () => localStorage.getItem('refreshToken'),

   setTokens: (accessToken, refreshToken) => {
     if (accessToken) {
       localStorage.setItem("accessToken", accessToken);
     }
     if (refreshToken) {
       localStorage.setItem("refreshToken", refreshToken);
     }
   },
  
   removeTokens: () => {
     localStorage.removeItem('accessToken');
     localStorage.removeItem('refreshToken');
   },
  
   removeTokensAndRedirect: () => {
    localStorage.removeItem('accessToken'); // ✅ Corregido
    localStorage.removeItem('refreshToken'); // ✅ Corregido
     window.location.href = '/login';
   }
 };