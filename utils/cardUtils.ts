export const getCardType = (card: string) => {
    if (/^4/.test(card)) return 'visa';
    if (/^5[1-5]/.test(card)) return 'mastercard';
    if (/^3[47]/.test(card)) return 'amex';
    return 'unknown';
  };