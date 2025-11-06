import axios from 'axios';

const mockGateway = async ({ amount, method }) => {
  return {
    status: 'captured',
    amount,
    reference: `PAY-${Date.now()}`,
    metadata: { method }
  };
};

export const processPayment = async (payload) => {
  if (process.env.PAYMENT_GATEWAY_URL) {
    const { data } = await axios.post(process.env.PAYMENT_GATEWAY_URL, payload);
    return data;
  }
  return mockGateway(payload);
};
