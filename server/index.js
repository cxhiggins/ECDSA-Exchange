const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const initialBalances = [100, 50, 75]

// Initialize account and key information
const balances = {}     // Maps public key to balance
const keys = {}         // Maps public key to full key

for (const i in initialBalances) {
  const key = ec.genKeyPair();
  const publicKey = key.getPublic().encode('hex');
  balances[publicKey] = initialBalances[i];
  keys[publicKey] = key;
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, signature} = req.body;

  // Verify user's digital signature to authenticate that they have
  // the private key to an address before making the transfer
  let body = JSON.stringify({
    sender, amount, recipient
  });

  const key = keys[sender];
  if (key) {
    if (key.verify(body, signature)) {
      balances[sender] -= amount;

      if (balances[recipient]) {
        balances[recipient] += +amount;
      } else {  // Create new recipient balance and key
        balances[recipient] = +amount;
        keys[recipient] = ec.keyFromPublic(Buffer.from(recipient, 'hex').toString('hex'), 'hex')
      }
      
      res.send({ balance: balances[sender] });
    } else {
      console.log("Invalid signature");
    }
  } else {
    console.log("Invalid sender public key");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  
  // Log public addresses that contain some balance, with 
  // corresponding private addresses
  for (const publicKey in balances) {
    console.log(`Public: ${publicKey}`);
    console.log(`Private: ${keys[publicKey].getPrivate('hex')}\n`);
  }
});
