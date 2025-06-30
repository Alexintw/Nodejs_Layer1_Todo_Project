const crypto = require('crypto');
const { default: fetch } = require('node-fetch'); // Node 18+ 也支援 global fetch

class Block {
  constructor(index, timestamp, transactions, previousHash = '', difficulty = 2) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.difficulty = difficulty;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(
        this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
      )
      .digest('hex');
  }

  mineBlock() {
    const target = '0'.repeat(this.difficulty);
    while (this.hash.substring(0, this.difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block #${this.index} mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.targetTime = 30000;
    this.pendingTransactions = [];
    this.nodes = new Set();
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), [], '0', this.difficulty);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(tx) {
    this.pendingTransactions.push(tx);
  }

  minePending() {
    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash,
      this.difficulty
    );
    block.difficulty = this.adjustDifficulty(block);
    block.mineBlock();
    this.chain.push(block);
    this.pendingTransactions = [];
    return block;
  }

  adjustDifficulty(newBlock) {
    const prev = this.getLatestBlock();
    const timeDiff = newBlock.timestamp - prev.timestamp;
    if (timeDiff < this.targetTime / 2) return prev.difficulty + 1;
    if (timeDiff > this.targetTime * 2 && prev.difficulty > 1) return prev.difficulty - 1;
    return prev.difficulty;
  }

  isChainValid(chain = this.chain) {
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];
      if (current.hash !== new Block(
        current.index,
        current.timestamp,
        current.transactions,
        current.previousHash,
        current.difficulty
      ).calculateHash()) {
        return false;
      }
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }

  registerNode(address) {
    this.nodes.add(address);
  }

  async resolveConflicts() {
    const neighbours = this.nodes;
    let newChain = null;
    let maxLength = this.chain.length;

    for (const nodeUrl of neighbours) {
      try {
        const res = await fetch(`${nodeUrl}/chain`);
        const { chain } = await res.json();
        if (chain.length > maxLength && this.isChainValid(chain)) {
          maxLength = chain.length;
          newChain = chain;
        }
      } catch (err) {
        console.error(`Failed to fetch from node ${nodeUrl}:`, err);
      }
    }

    if (newChain) {
      this.chain = newChain;
      return true;
    }
    return false;
  }
}

module.exports = { Block, Blockchain };