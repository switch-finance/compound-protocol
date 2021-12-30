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


### Rinkeby
```
USDT : "0x357eB57DBF2110819A9574C86BD3e4bcf34261BC",
USDC : "0x6d5Ad445e956796F31c4562E7Cc011948ECa9055",
Unitroller : "0xbF7301b7704469A469015CE9365adB0C8FBcee5c",
ComptrollerG1 : "0x23e2ae6E662a572700CD3bd49b65A7A00e516d4e",
SimplePriceOracle : "0x2A2bfE75Bd114E8Bad1c6D89EF9a59176ecB4dE9",
WhitePaperInterestRateModel : "0x9cBe602964329907C2d3602CC84FD8662d62dd7b",
cUSDTDelegate : "0x883ed1B4dE3c0a2e59F75B685F51E80B03D11e13",
cUSDCDelegate : "0x76937Bb965362077C94A7d8DD89fb634AF6ef41A",
cUSDT : "0xDbF6F7b40733F41846C63A3Db9c7464bAD57C926",
cUSDC : "0xD9761883BE56EDBEa469862b222148b55971d84E",
```

## BSC Testnet
```
USDT : "0x79484D7d5b44C7f87536787D46A4b495983AAb9B",
USDC : "0xE4780F8a22659e2Fa3dD4281613ED48325ead5C0",
Unitroller : "0x86Ba028B78Ba18A4Fcb623b0c51F9628D3Ae5e29",
ComptrollerG1 : "0xccd5419530FaCb05842807f6402A0010546AD9c5",
SimplePriceOracle : "0xD7aC3D215C11f77F615dfAF5250d54cFb7F1a3D1",
WhitePaperInterestRateModel : "0x6419dbA8E58Aea2Bec34F6d727c61748c3696ccC",
cUSDTDelegate : "0xe09A0EaDF737b5Cf6946ac184d6bF19B376190aB",
cUSDT : "0xa52bbBc4839509a34cd64Cb9EF9639c854B2555d",
cUSDC : "0x02b25ecb7BC667551Ea0972355033e0D88a3CcA9",
```