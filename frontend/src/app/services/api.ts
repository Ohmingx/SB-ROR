import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

function authHeaders() {
  const token = localStorage.getItem('sb_ror_token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
}

export async function runBacktest(payload: any) {
  const res = await axios.post(`${API_BASE}/backtest/run`, payload, authHeaders()).catch(e => { throw e.response?.data || e; });
  return res.data;
}

export async function getPortfolio() {
  const res = await axios.get(`${API_BASE}/portfolio`, authHeaders()).catch(e => { throw e.response?.data || e; });
  return res.data;
}

export async function executeTrade(order: any) {
  const res = await axios.post(`${API_BASE}/trade/execute`, order, authHeaders()).catch(e => { throw e.response?.data || e; });
  return res.data;
}

export async function authToken(username: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/token`, null, { params: { username, password } }).catch(e => { throw e.response?.data || e; });
  return res.data;
}
