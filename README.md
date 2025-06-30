# Node.js Layer1 Todo & Blockchain Demo

This repository combines two services:

1. **Todo API** (Express + MongoDB)
2. **Blockchain Node** (Simple PoW blockchain HTTP API)

---

## 📂 Repository Structure

```
Nodejs_Layer1_Todo_Project/
├─ blockchain/                 # Blockchain core and server
│   ├─ blockchain_core.js      # Block & Blockchain classes
│   └─ server.js               # HTTP API for blockchain node
├─ config/
│   └─ db.js                   # MongoDB connection
├─ controllers/
│   └─ todosController.js      # Todo business logic
├─ models/
│   └─ todo.js                 # Mongoose Todo model
├─ routes/
│   └─ todos.js                # Express routes for Todo
├─ server-express.js           # Entry point for Todo API
├─ test_blockchain_api.sh      # curl tests for blockchain API
├─ test_chain_mine.sh          # curl tests for chain & mine
├─ README.md                   # This file
├─ .env                        # Environment variables
└─ package.json                # Dependencies & scripts
```

---

## ⚙️ Prerequisites

* Node.js v18+ (with built-in `fetch`)
* npm
* MongoDB (running locally or via Docker)

---

## 🚀 Installation

1. Clone the repo:

   ```bash
   git clone <your-github-url>
   cd Nodejs_Layer1_Todo_Project
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create `.env` in root with:

   ```env
   MONGODB_URI=mongodb://localhost:27017/todo_app
   PORT=3000
   ```
4. (Optional) Ensure MongoDB is running:

   ```bash
   # If using homebrew service
   brew services start mongodb-community@7.0
   ```

---

## 💻 Running the Services

### 1. Todo API

Starts on port **3000** by default:

```bash
npm start           # or node server-express.js
```

### 2. Blockchain Node

Starts on port **3001** by default:

```bash
node blockchain/server.js
```

---

## 🔗 Git Integration

1. Add the blockchain folder and README:

   ```bash
   git add blockchain README.md
   git commit -m "Add blockchain module and documentation"
   git push origin main
   ```

---

## 📄 API Endpoints

### Todo API (Port 3000)

* `GET /todos`
* `POST /todos` `{ "text": "..." }`
* `GET /todos/:id`
* `PUT /todos/:id` `{ "text": "...", "done": true }`
* `DELETE /todos/:id`

### Blockchain Node (Port 3001)

* `POST /transactions/new` `{ "sender": "...", "recipient": "...", "amount": 123 }`
* `GET /mine`
* `GET /chain`
* `POST /nodes/register` `{ "nodes": ["http://...:3001"] }`
* `GET /nodes/resolve`

---

## 📖 License

MIT
