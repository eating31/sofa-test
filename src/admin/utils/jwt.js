
import { jwtDecode } from 'jwt-decode';

// 解析jwt
export const checkJwt = async (token) => {
    const decoded = jwtDecode(token.slice(4,));
    console.log('Token found:', decoded);

    return decoded
};

// 權限錯誤重新登入
export const authError = (response) => {
    alert(response.data?.message)
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    window.location.href = '/admin'
};