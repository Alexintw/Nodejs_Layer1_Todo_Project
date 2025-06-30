const express = require('express');
const { Blockchain } = require('./blockchain_core');
const app = express();
const PORT = process.env.PORT || 3001;

const bc = new Blockchain();

app.use(express.json());

app.post('/transactions/new', (req, res) => {
  const { sender, recipient, amount } = req.body;
  if (!sender || !recipient || !amount) {
    return res.status(400).json({ error: 'Missing transaction fields' });
  }
  bc.addTransaction({ sender, recipient, amount });
  res.json({ message: 'Transaction added', index: bc.chain.length });
});

app.get('/mine', (req, res) => {
  const block = bc.minePending();
  res.json({ message: 'New block mined', block });
});

app.get('/chain', (req, res) => {
  res.json({ chain: bc.chain, length: bc.chain.length });
});

app.post('/nodes/register', (req, res) => {
  const { nodes } = req.body;
  if (!nodes) return res.status(400).json({ error: 'Please supply node addresses' });
  nodes.forEach(url => bc.registerNode(url));
  res.json({ message: 'New nodes added', totalNodes: Array.from(bc.nodes) });
});

app.get('/nodes/resolve', async (req, res) => {
  const replaced = await bc.resolveConflicts();
  res.json({ message: replaced ? 'Chain was replaced' : 'Chain is authoritative', chain: bc.chain });
});

app.listen(PORT, () => console.log(`Blockchain HTTP API running on http://localhost:${PORT}`));
