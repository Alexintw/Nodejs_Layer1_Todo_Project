const crypto = require('crypto');

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
    const target = Array(this.difficulty + 1).join('0');
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
    this.difficulty = 2;              // 初始難度
    this.targetTime = 30000;          // 30 秒為出塊目標時間
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), [], '0', this.difficulty);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.difficulty = this.getAdjustedDifficulty(newBlock);
    newBlock.mineBlock();
    this.chain.push(newBlock);
  }

  getAdjustedDifficulty(block) {
    const prev = this.getLatestBlock();
    const timeDiff = block.timestamp - prev.timestamp;
    if (timeDiff < this.targetTime / 2) {
      return prev.difficulty + 1;
    } else if (timeDiff > this.targetTime * 2 && prev.difficulty > 1) {
      return prev.difficulty - 1;
    }
    return prev.difficulty;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}

// Demo
const myChain = new Blockchain();
console.log('Mining block 1...');
myChain.addBlock(new Block(1, Date.now(), [{ from: 'Alice', to: 'Bob', amount: 50 }]));
console.log('Mining block 2...');
myChain.addBlock(new Block(2, Date.now(), [{ from: 'Bob', to: 'Charlie', amount: 30 }]));

console.log(JSON.stringify(myChain, null, 2));
console.log('Is chain valid?', myChain.isChainValid());

module.exports = { Block, Blockchain };