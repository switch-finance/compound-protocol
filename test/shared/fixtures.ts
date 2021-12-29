import { BigNumber, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { Unitroller } from '../../typechain/Unitroller'
import { ComptrollerG1 } from '../../typechain/ComptrollerG1'
import { SimplePriceOracle } from '../../typechain/SimplePriceOracle'
import { Comp } from '../../typechain/Comp'
import { ERC20Harness } from '../../typechain/ERC20Harness'
import { CErc20Delegate } from '../../typechain/CErc20Delegate'
import { CErc20Delegator } from '../../typechain/CErc20Delegator'
import { WhitePaperInterestRateModel } from '../../typechain/WhitePaperInterestRateModel'
import { Fixture, deployMockContract, MockContract } from 'ethereum-waffle'

export const bigNumber18 = BigNumber.from("1000000000000000000")  // 1e18
export const bigNumber17 = BigNumber.from("100000000000000000")  //1e17
export const bigNumber16 = BigNumber.from("10000000000000000")  //1e16
export const bigNumber15 = BigNumber.from("1000000000000000")  //1e15
export const bigNumber8 = BigNumber.from("100000000") // 1e8

export async function getBlockNumber() {
    const blockNumber = await ethers.provider.getBlockNumber()
    // console.debug("Current block number: " + blockNumber);
    return blockNumber;
}

export async function createToken(_initialAmount:BigNumber, _decimalUnits:number, _tokenName:string, _tokenSymbol:string) {
    let testTokenFactory = await ethers.getContractFactory('ERC20Harness')
    let res = (await testTokenFactory.deploy(
        _initialAmount,
        _tokenName,
        _decimalUnits,
        _tokenSymbol
        )) as ERC20Harness
    return res
}

export async function createCToken(
    underlying:string,
    comptroller:string,
    interestRateModel:string,
    initialExchangeRateMantissa:BigNumber,
    name:string,
    symbol:string,
    decimals:number,
    admin:string
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
    
    await cToken._setImplementation(cDelegate.address, false, data);
    await cToken._setReserveFactor(reserveFactor);
    return cToken
}

interface ComptrollerFixture {
    comp: Comp
    comptroller: ComptrollerG1
    priceOracle: SimplePriceOracle
    unitroller: Unitroller
    interestRateModel: WhitePaperInterestRateModel
}

export const comptrollerFixture: Fixture<ComptrollerFixture> = async function ([wallet, treasuryGuardian, treasuryAddress]: Wallet[]): Promise<ComptrollerFixture> {
    const unitrollerFactory =  await ethers.getContractFactory('Unitroller')
    const unitroller = (await unitrollerFactory.deploy()) as Unitroller
    const comptrollerFactory = await ethers.getContractFactory('ComptrollerG1');
    const comptroller = (await comptrollerFactory.deploy()) as ComptrollerG1

    const priceOracleFactory = await ethers.getContractFactory('SimplePriceOracle')
    const priceOracle = (await priceOracleFactory.deploy()) as SimplePriceOracle

    const closeFactor = bigNumber17.mul(6)
    const liquidationIncentive = BigNumber.from('1080000000000000000')
    const interestBaseRate = bigNumber16.mul(5)
    const interestPerYearRate = bigNumber16.mul(12)
    const maxAssets = 20

    const compFactory = await ethers.getContractFactory('Comp')
    const comp = (await compFactory.deploy(wallet.address)) as Comp

    await unitroller._setPendingImplementation(comptroller.address)
    await comptroller._become(unitroller.address, priceOracle.address, closeFactor, maxAssets, true)

    await comptroller._setLiquidationIncentive(liquidationIncentive)
    // console.log('=========_setLiquidationIncentive==========')
    await comptroller._setCloseFactor(closeFactor)
    // console.log('=========_setCloseFactor==========')
    await comptroller._setPriceOracle(priceOracle.address)
    // console.log('=========_setPriceOracle==========')
    await comptroller._setMaxAssets(maxAssets)
    // console.log('=========setMaxAssets==========')


    const interestRateModelFactory = await ethers.getContractFactory('WhitePaperInterestRateModel')
    const interestRateModel = (await interestRateModelFactory.deploy(2102400, interestBaseRate, interestPerYearRate)) as WhitePaperInterestRateModel

    console.log(`
        comp: ${comp.address},
        comptroller: ${comptroller.address},
        priceOracle: ${priceOracle.address},
        unitroller: ${unitroller.address},
        interestRateModel: ${interestRateModel.address},
    `)
    return { comptroller, priceOracle, comp, unitroller, interestRateModel };
}