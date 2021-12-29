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

## BSC Testnet
```
USDT : "0x79484D7d5b44C7f87536787D46A4b495983AAb9B",
USDC : "0xE4780F8a22659e2Fa3dD4281613ED48325ead5C0",
Unitroller : "0x86Ba028B78Ba18A4Fcb623b0c51F9628D3Ae5e29",
ComptrollerG1 : "0xccd5419530FaCb05842807f6402A0010546AD9c5",
SimplePriceOracle : "0xD7aC3D215C11f77F615dfAF5250d54cFb7F1a3D1",
WhitePaperInterestRateModel : "0x9B237C9Fa15e715518B4a979969aB50dd4655a2c",
cUSDTDelegate : "0xe09A0EaDF737b5Cf6946ac184d6bF19B376190aB",
cUSDT : "0xa52bbBc4839509a34cd64Cb9EF9639c854B2555d",
cUSDC : "0x02b25ecb7BC667551Ea0972355033e0D88a3CcA9",
```