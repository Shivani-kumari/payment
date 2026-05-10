export const validateExpiry = (expiry: string) => {
    const [m, y] = expiry.split('/').map(Number);
    if (!m || !y) return false;
  
    const now = new Date();
    const exp = new Date(2000 + y, m - 1);
    return exp > now;
  };
  
  export const validateCVV = (cvv: string, type: string) => {
    return type === 'amex' ? cvv.length === 4 : cvv.length === 3;
  };