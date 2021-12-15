# ECDSA-Exchange

*A simple exchange in which clients communicate with a server to manage their balances.*

The features implemented for the [Exchange Project](https://www.chainshot.com/md/exchange-project) are listed below.
1. Public Key Balances: balances can be looked up given the corresponding public key
2. Digital Signatures: the client must provide both public *and private* key corresponding to the account from which they wish to transfer funds. The private key is used to sign requests, containing the public key, before sending to the server. The server then uses the given public key to look up the corresponding private key, and use that to verify the given signature.

This project involved using the [elliptic library](https://www.npmjs.com/package/elliptic) to generate keys, create signatures, and verify message-signature pairs.

## Host the Server

After cloning the repository, navigate to the `/server` folder and run `node index` to start the server.

## Host the Frontend

In a separate terminal, navigate to the `/client` folder and use [parceljs](https://parceljs.org/) on `index.html`:
```
npx parcel index.html
```
You should now be able to view the webpage at the localhost url printed to the terminal.
