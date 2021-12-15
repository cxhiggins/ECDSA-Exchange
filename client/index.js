import "./index.scss";

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;

  let body = JSON.stringify({
    sender, amount, recipient
  });

  // Sign the message
  const senderPrivateKey = document.getElementById("exchange-private-address").value;

  if (sender && amount && recipient && senderPrivateKey) {
    const key = ec.keyFromPrivate(Buffer.from(senderPrivateKey, 'hex').toString('hex'), 'hex');
    const signature = key.sign(body).toDER();
  
    // Add signature to message body
    body = JSON.stringify({
      sender, amount, recipient, signature
    });
  
    const request = new Request(`${server}/send`, { method: 'POST', body });
  
    fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
      return response.json();
    }).then(({ balance }) => {
      document.getElementById("balance").innerHTML = balance;
    });
  } else {
    console.log("Missing field entry");
  }
});
