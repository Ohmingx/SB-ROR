import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export async function runBacktest(payload: any) {
  const res = await axios.post(`${API_BASE}/backtest/run`, payload).catch(e => { throw e.response?.data || e; });
  return res.data;
}

export async function getPortfolio() {
  const res = await axios.get(`${API_BASE}/portfolio`).catch(e => { throw e.response?.data || e; });
  return res.data;
}

export async function executeTrade(order: any) {
  const res = await axios.post(`${API_BASE}/trade/execute`, order).catch(e => { throw e.response?.data || e; });
  return res.data;
}
