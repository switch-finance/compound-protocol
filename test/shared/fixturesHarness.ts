import { BigNumber, Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { Unitroller } from '../../typechain/Unitroller'
import { ComptrollerHarness } from '../../typechain/ComptrollerHarness'
import { SimplePriceOracle } from '../../typechain/SimplePriceOracle'
import { Comp } from '../../typechain/Comp'
import { CompScenario } from '../../typechain/CompScenario'
import { ERC20Harness } from '../../typechain/ERC20Harness'
import { InterestRateModelHarness } from '../../typechain/InterestRateModelHarness'
import { CErc20Harness } from '../../typechain/CErc20Harness'
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

interface ComptrollerFixture {
    comptroller: ComptrollerHarness
    priceOracle: SimplePriceOracle
    comp: Comp
    unitroller: Unitroller
    interestRateModel: InterestRateModelHarness
}

export const comptrollerFixture: Fixture<ComptrollerFixture> = async function ([wallet, treasuryGuardian, treasuryAddress]: Wallet[]): Promise<ComptrollerFixture> {
    const unitrollerFactory =  await ethers.getContractFactory('Unitroller')
    const unitroller = (await unitrollerFactory.deploy()) as Unitroller
    const comptrollerFactory = await ethers.getContractFactory('ComptrollerHarness');
    const comptroller = (await comptrollerFactory.deploy()) as ComptrollerHarness

    const priceOracleFactory = await ethers.getContractFactory('SimplePriceOracle')
    const priceOracle = (await priceOracleFactory.deploy()) as SimplePriceOracle

    const closeFactor = bigNumber17.mul(6)
    const liquidationIncentive = BigNumber.from('1080000000000000000')

    const compFactory = await ethers.getContractFactory('Comp')
    const comp = (await compFactory.deploy(wallet.address)) as Comp

    const compRate = bigNumber18


    await unitroller._setPendingImplementation(comptroller.address)
    await comptroller._become(unitroller.address)

    await comptroller._setLiquidationIncentive(liquidationIncentive)
    // console.log('=========_setLiquidationIncentive==========')
    await comptroller._setCloseFactor(closeFactor)
    // console.log('=========_setCloseFactor==========')
    await comptroller._setPriceOracle(priceOracle.address)
    // console.log('=========_setPriceOracle==========')
    await comptroller.setCompAddress(comp.address)
    // console.log('=========setCompAddress==========')

    await comptroller.harnessSetCompRate(compRate)
    // console.log('=========harnessSetVenusRate==========')


    const interestRateModelHarnessFactory = await ethers.getContractFactory('InterestRateModelHarness')
    const interestRateModel = (await interestRateModelHarnessFactory.deploy(BigNumber.from(0))) as InterestRateModelHarness

    console.log(`
        comp: ${comp.address},
        comptroller: ${comptroller.address},
        priceOracle: ${priceOracle.address},
        unitroller: ${unitroller.address},
        interestRateModel: ${interestRateModel.address},
    `)
    return { comptroller, priceOracle, comp, unitroller, interestRateModel };
}