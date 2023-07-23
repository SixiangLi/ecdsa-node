import express from "express";
import cors from "cors";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02c32216f7718268f64fa31fd0990a1ea7d50c235f371f5357bf6a45afd8ddbb94": 100,
  "030bda5a8a7330ae290a009db13cfdb6e86324f8242f356dd97fa27c96fda67078": 50,
  "0209b6426c66a3f5b22b5530e11119b2bd87bf919ca35c4e5826735db1f02744ee": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
