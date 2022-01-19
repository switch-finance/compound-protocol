import { BigNumber, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { Unitroller } from '../../typechain/Unitroller'
import { ComptrollerHarness } from '../../typechain/ComptrollerHarness'
import { SimplePriceOracle } from '../../typechain/SimplePriceOracle'
import { EscrowCompound } from '../../typechain/EscrowCompound'
import { Comp } from '../../typechain/Comp'
import { ERC20Harness } from '../../typechain/ERC20Harness'
import { CErc20Delegate } from '../../typechain/CErc20Delegate'
import { CErc20Delegator } from '../../typechain/CErc20Delegator'
import { CEther } from '../../typechain/CEther'
import { WhitePaperInterestRateModel } from '../../typechain/WhitePaperInterestRateModel'
import { Fixture, deployMockContract, MockContract } from 'ethereum-waffle'

export const bigNumber18 = BigNumber.from("1000000000000000000")  // 1e18
export const bigNumber17 = BigNumber.from("100000000000000000")  //1e17
export const bigNumber16 = BigNumber.from("10000000000000000")  //1e16
export const bigNumber15 = BigNumber.from("1000000000000000")  //1e15
export const bigNumber8 = BigNumber.from("100000000") // 1e8
export const exchangeRate1 = bigNumber18.mul(100000000)
export const exchangeRate2 = bigNumber18.mul(200000000)

export async function getBlockNumber() {
    const blockNumber = await ethers.provider.getBlockNumber()
    // console.debug("Current block number: " + blockNumber);
    return blockNumber;
}

export async function getBalance(user: string) {
    return await ethers.provider.getBalance(user);
}

export async function createToken(_initialAmount: BigNumber, _decimalUnits: number, _tokenName: string, _tokenSymbol: string) {
    let testTokenFactory = await ethers.getContractFactory('ERC20Harness')
    let res = (await testTokenFactory.deploy(
        _initialAmount,
        _tokenName,
        _decimalUnits,
        _tokenSymbol
    )) as ERC20Harness

    // console.log(_tokenSymbol+':', res.address)
    return res
}

export async function createCToken(
    underlying: string,
    comptroller: string,
    interestRateModel: string,
    initialExchangeRateMantissa: BigNumber,
    name: string,
    symbol: string,
    decimals: number,
    admin: string
) {
    let delegateFactory = await ethers.getContractFactory('CErc20Delegate')
    let cDelegate = (await delegateFactory.deploy())
    let delegatorFactory = await ethers.getContractFactory('CErc20Delegator')
    let data = "0x"
    let reserveFactor = bigNumber16.mul(25)
    let cToken = (await delegatorFactory.deploy(
        underlying,
        comptroller,
        interestRateModel,
        initialExchangeRateMantissa,
        name,
        symbol,
        decimals,
        admin,
        cDelegate.address,
        data
    )) as CErc20Delegator
    // console.log(symbol+':', cToken.address)
    await cToken._setImplementation(cDelegate.address, false, data);
    await cToken._setReserveFactor(reserveFactor);
    return cToken
}

export async function createCEther(
    comptroller: string,
    interestRateModel: string,
    initialExchangeRateMantissa: BigNumber,
    name: string,
    symbol: string,
    decimals: number,
    admin: string
) {
    let delegatorFactory = await ethers.getContractFactory('CEther')
    let reserveFactor = bigNumber16.mul(25)
    let cToken = (await delegatorFactory.deploy(
        comptroller,
        interestRateModel,
        initialExchangeRateMantissa,
        name,
        symbol,
        decimals,
        admin
    )) as CEther
    // console.log(symbol+':', cToken.address)
    await cToken._setReserveFactor(reserveFactor);
    return cToken
}

interface ComptrollerFixture {
    t1: ERC20Harness
    t2: ERC20Harness
    ct1: CErc20Delegator
    ct2: CErc20Delegator
    ceth: CEther
    comp: Comp
    comptroller: ComptrollerHarness
    priceOracle: SimplePriceOracle
    unitroller: Unitroller
    interestRateModel: WhitePaperInterestRateModel
    escrowCompound: EscrowCompound
}

export const comptrollerFixture: Fixture<ComptrollerFixture> = async function ([wallet, treasuryGuardian, treasuryAddress]: Wallet[]): Promise<ComptrollerFixture> {
    const unitrollerFactory = await ethers.getContractFactory('Unitroller')
    const unitroller = (await unitrollerFactory.deploy()) as Unitroller
    const comptrollerFactory = await ethers.getContractFactory('ComptrollerHarness');
    const comptroller = (await comptrollerFactory.deploy()) as ComptrollerHarness

    const priceOracleFactory = await ethers.getContractFactory('SimplePriceOracle')
    const priceOracle = (await priceOracleFactory.deploy()) as SimplePriceOracle

    const closeFactor = bigNumber17.mul(6)
    const liquidationIncentive = bigNumber17.mul(108)
    const interestBaseRate = bigNumber16.mul(5)
    const interestPerYearRate = bigNumber16.mul(12)
    const maxAssets = 20

    const interestRateModelFactory = await ethers.getContractFactory('WhitePaperInterestRateModel')
    const interestRateModel = (await interestRateModelFactory.deploy(2102400, interestBaseRate, interestPerYearRate)) as WhitePaperInterestRateModel

    const compFactory = await ethers.getContractFactory('Comp')
    const comp = (await compFactory.deploy(wallet.address)) as Comp

    await unitroller._setPendingImplementation(comptroller.address)
    await comptroller._become(unitroller.address)

    await comptroller._setLiquidationIncentive(liquidationIncentive)
    // console.log('=========_setLiquidationIncentive==========')
    await comptroller._setCloseFactor(closeFactor)
    // console.log('=========_setCloseFactor==========')
    await comptroller._setPriceOracle(priceOracle.address)
    // console.log('=========_setPriceOracle==========')
    // await comptroller._setMaxAssets(maxAssets)
    // console.log('=========setMaxAssets==========')

    // console.log(`
    //     comp: ${comp.address},
    //     comptroller: ${comptroller.address},
    //     priceOracle: ${priceOracle.address},
    //     unitroller: ${unitroller.address},
    //     interestRateModel: ${interestRateModel.address},
    // `)

    let t1 = await createToken(bigNumber18.mul(100000000), 18, "T1-Test", "T1")
    let t2 = await createToken(bigNumber18.mul(100000000), 18, "T2-Test", "T2")
    let ct1 = await createCToken(
        t1.address,
        comptroller.address,
        interestRateModel.address,
        exchangeRate1,
        "Compound T1-Test",
        "cT1",
        18,
        wallet.address
    )
    let ct2 = await createCToken(
        t2.address,
        comptroller.address,
        interestRateModel.address,
        exchangeRate2,
        "Compound T2-Test",
        "cT2",
        18,
        wallet.address
    )
    let ceth = await createCEther(
        comptroller.address,
        interestRateModel.address,
        exchangeRate2,
        "Compound ETH-Test",
        "cETH",
        8,
        wallet.address
    )

    let escrowCompoundFactory = await ethers.getContractFactory('EscrowCompound')
    let escrowCompound = (await escrowCompoundFactory.deploy()) as EscrowCompound

    return { t1, t2, ct1, ct2, ceth, comptroller, priceOracle, comp, unitroller, interestRateModel, escrowCompound};
}