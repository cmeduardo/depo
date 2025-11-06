import axios from 'axios';
import logger from '../utils/logger.js';

export const notifySupplier = async (url, payload) => {
  if (!url) return null;
  const { data } = await axios.post(url, payload);
  return data;
};

export const notifyPOS = async (url, payload) => {
  try {
    if (!url) return null;
    const { data } = await axios.post(url, payload);
    return data;
  } catch (error) {
    logger.error('POS webhook failed', error);
    throw error;
  }
};
