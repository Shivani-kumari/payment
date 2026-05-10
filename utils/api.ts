export const pay = async (payload: any) => {
    const controller = new AbortController();
  
    const timeout = setTimeout(() => {
      controller.abort();
    }, 6000);
  
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
  
      clearTimeout(timeout);
      return await res.json();
    } catch (err: any) {
      if (err.name === 'AbortError') throw new Error('TIMEOUT');
      throw new Error('NETWORK');
    }
  };