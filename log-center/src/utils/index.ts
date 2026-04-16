export const highlightText = (text: string, keyword: string) => {
  if (!keyword || !text) return text;
  
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
  return text.replace(regex, '<mark style="background-color: #ffeb3b; color: #000; padding: 0 2px; border-radius: 2px;">$1</mark>');
};

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const saveConfig = (config: { authorization: string; sysName: string }) => {
  localStorage.setItem('logCenterConfig', JSON.stringify(config));
};

export const getConfig = () => {
  const config = localStorage.getItem('logCenterConfig');
  return config ? JSON.parse(config) : null;
};

export const clearConfig = () => {
  localStorage.removeItem('logCenterConfig');
};
