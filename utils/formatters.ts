export const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  };