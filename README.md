[![CircleCI](https://circleci.com/gh/compound-finance/compound-protocol.svg?style=svg&circle-token=5ed19932325c559a06f71f87d69012aedd2cf3fb)](https://circleci.com/gh/compound-finance/compound-protocol) [![codecov](https://codecov.io/gh/compound-finance/compound-protocol/branch/master/graph/badge.svg?token=q4UvsvVzOX)](https://codecov.io/gh/compound-finance/compound-protocol)

Compound Protocol
=================

The Compound Protocol is an Ethereum smart contract for supplying or borrowing assets. Through the cToken contracts, accounts on the blockchain *supply* capital (Ether or ERC-20 tokens) to receive cTokens or *borrow* assets from the protocol (holding other assets as collateral). The Compound cToken contracts track these balances and algorithmically set interest rates for borrowers.

Before getting started with this repo, please read:

* The [Compound Whitepaper](https://compound.finance/documents/Compound.Whitepaper.pdf), describing how Compound works
* The [Compound Protocol Specification](https://github.com/compound-finance/compound-protocol/tree/master/docs/CompoundProtocol.pdf), explaining in plain English how the protocol operates

### install 

```sh
yarn 
```

### set hardhat config

```sh
cp ./hardhat.example.json ./.hardhat.data.json
```

### compile

```sh
yarn compile
```

### test
```sh
yarn test
```
