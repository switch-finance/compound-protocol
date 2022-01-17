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
BNB : "0x788f51C7fB44F358136f1fFc6151DA0459d6896d",
Unitroller : "0xbF7301b7704469A469015CE9365adB0C8FBcee5c",
Comp : "0x13f6e4Ad74d60284EcF172da168Ee3D32904b46B",
ComptrollerG1 : "0x23e2ae6E662a572700CD3bd49b65A7A00e516d4e",
ComptrollerTest : "0xd94E8bD136790cDDf60cE3c917D1B99E2f9b446c",
SimplePriceOracle : "0x2A2bfE75Bd114E8Bad1c6D89EF9a59176ecB4dE9",
WhitePaperInterestRateModel : "0x9cBe602964329907C2d3602CC84FD8662d62dd7b",
cUSDTDelegate : "0x883ed1B4dE3c0a2e59F75B685F51E80B03D11e13",
cUSDCDelegate : "0x76937Bb965362077C94A7d8DD89fb634AF6ef41A",
cUSDT : "0xDbF6F7b40733F41846C63A3Db9c7464bAD57C926",
cUSDC : "0xD9761883BE56EDBEa469862b222148b55971d84E",
cETH : "0xC73B34d6Fd72C5Af53258eA626371529238Bef4e",
```

## BSC Testnet
```
USDT : "0x79484D7d5b44C7f87536787D46A4b495983AAb9B",
USDC : "0xE4780F8a22659e2Fa3dD4281613ED48325ead5C0",
ETH : "0x60E7167a3d8681aaA8FdD325b9901AD307647d7f",
Unitroller : "0x86Ba028B78Ba18A4Fcb623b0c51F9628D3Ae5e29",
Comp : "0x37183B051Ef5f32aDB7064292ca84952a7f16Fb4",
ComptrollerG1 : "0xccd5419530FaCb05842807f6402A0010546AD9c5",
ComptrollerTest : "0x27Ade87Bce8885c157a6193fBD1bBF07E63B7A26",
SimplePriceOracle : "0xD7aC3D215C11f77F615dfAF5250d54cFb7F1a3D1",
WhitePaperInterestRateModel : "0x6419dbA8E58Aea2Bec34F6d727c61748c3696ccC",
cUSDTDelegate : "0xe09A0EaDF737b5Cf6946ac184d6bF19B376190aB",
cUSDCDelegate : "0xfD202FFBE93ABc430753e3963BE77863d21d2804",
cUSDT : "0xa52bbBc4839509a34cd64Cb9EF9639c854B2555d",
cUSDC : "0x02b25ecb7BC667551Ea0972355033e0D88a3CcA9",
cETH : "0x890302B120d25f0fcd81fDB3df340EB84Ac84835",
vBNB : "0xFCbB8b198242D9BbD07441053F6Cb0A68787A39F",
```

## Kovan
```
USDT : "0x89f2887b991F40C44C42E2acF5564DE4a8EDAaCA",
USDC : "0x7e67C1a649Bf5BEC58F433f3dB2c0E2B350e354A",
Unitroller : "0x36746986db3bBB4460184396df4c88F3267b8dc1",
ComptrollerG1 : "0x5c917873A397973963E4c43f4FDDe142C8cCab2A",
SimplePriceOracle : "0x634AD2323B6ada19a6F23E82D7ECdeE8e7D7338B",
WhitePaperInterestRateModel : "0x8E500795e74B5D9Ed5C674dB26fedd10bAadF6C8",
cUSDTDelegate : "0xc10d52939d4be7D3Dfe31FdaAEe93D9ca88f863b",
cUSDCDelegate : "0x00A377631D488a5d9Cc9a374C9A85ccf6b9CdF8A",
cUSDT : "0x0270B8FCD3ceB1E44Dd08C365Ad77A22877ac4FC",
cUSDC : "0xFF0A47C2Ef2515D7CAfc3839542A27d8Cb15a385",
cETH : "0xA24166a8dbcC52b9C132585A27f2B53AcE1C5ad2",
```