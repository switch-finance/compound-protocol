import { Wallet, BigNumber } from 'ethers'
import { ethers, network, waffle } from 'hardhat'
import { Unitroller } from '../typechain/Unitroller'
import { ComptrollerHarness } from '../typechain/ComptrollerHarness'
import { SimplePriceOracle } from '../typechain/SimplePriceOracle'
import { InterestRateModelHarness } from '../typechain/InterestRateModelHarness'
import { Comp } from '../typechain/Comp'
import { CompScenario } from '../typechain/CompScenario'
import { ERC20Harness } from '../typechain/ERC20Harness'
import { CErc20Harness } from '../typechain/CErc20Harness'
import { expect } from './shared/expect'
import { comptrollerFixture, bigNumber18, bigNumber17, bigNumber16 } from './shared/fixturesHarness'

const createFixtureLoader = waffle.createFixtureLoader

describe('Comptroller', async () => {
    let wallet: Wallet,
        user1: Wallet,
        user2: Wallet,
        user3: Wallet,
        user4: Wallet;

    let comptroller: ComptrollerHarness
    let priceOracle: SimplePriceOracle
    let comp: Comp
    let unitroller: Unitroller
    let interestRateModel: InterestRateModelHarness
    let usdt: ERC20Harness
    let cusdt: CErc20Harness

    let loadFixTure: ReturnType<typeof createFixtureLoader>;

    before('create fixture loader', async () => {
        [wallet, user1, user2, user3, user4] = await (ethers as any).getSigners()
        loadFixTure = createFixtureLoader([wallet])
        ; ({ comp, comptroller, priceOracle, unitroller, interestRateModel } = await loadFixTure(comptrollerFixture));

        let testTokenFactory = await ethers.getContractFactory('ERC20Harness')
        usdt = (await testTokenFactory.deploy(
            bigNumber18.mul(100000000),
            "USDT-Test",
            18,
            "USDT"
        )) as ERC20Harness

    })

    beforeEach('deploy Comptroller', async () => {
        const cTokenFactory = await ethers.getContractFactory('CErc20Harness')
        cusdt = (await cTokenFactory.deploy(
            usdt.address,
            comptroller.address,
            interestRateModel.address,
            bigNumber18,
            "CToken USDT",
            "cUSDT",
            BigNumber.from(18),
            wallet.address
        )) as CErc20Harness

        await priceOracle.setUnderlyingPrice(cusdt.address, bigNumber18)
        await comptroller._supportMarket(cusdt.address)
    })

    describe('#base', async () => {
        it('oracle', async () => {
            expect(await comptroller.oracle()).to.eq(priceOracle.address)
        })

        it('getAssetsIn', async () => {
            await comptroller.connect(user1).enterMarkets([cusdt.address])
            let enteredMarkets = await comptroller.getAssetsIn(user1.address)
            expect(enteredMarkets.length).to.eq(1)
        })

        it('getAccountSnapshot', async () => {
            await cusdt.harnessSetBalance(user1.address, bigNumber18.mul(100))
            let res = await cusdt.getAccountSnapshot(user1.address)
            expect(res[0]).to.eq(0)
            expect(res[1]).to.eq(bigNumber18.mul(100))
            expect(res[2]).to.eq(BigNumber.from(0))
            expect(res[3]).to.eq(bigNumber18)
        })

        it('getUnderlyingPrice', async () => {
            expect(await priceOracle.getUnderlyingPrice(cusdt.address)).to.eq(bigNumber18)
        })

        it('getComtroller', async () => {
            expect(await unitroller.admin()).to.eq(wallet.address)
        })

    })

    describe('#mint and redeem', async () => {
        beforeEach('each', async () => {
            await usdt.transfer(user1.address, bigNumber18.mul(1000))
            await usdt.approve(cusdt.address, bigNumber18.mul(100000000))
            await usdt.connect(user1).approve(cusdt.address, bigNumber18.mul(100000000))
        })

        it('success', async () => {
            let balance1 = await usdt.balanceOf(user1.address)
            let cbalance1 = await cusdt.balanceOf(user1.address)
            console.log('balance1, cbalance1:', balance1.toString(), cbalance1.toString())
            await cusdt.connect(user1).mint(bigNumber18.mul(100))
            let balance2 = await usdt.balanceOf(user1.address)
            let cbalance2 = await cusdt.balanceOf(user1.address)
            console.log('balance2, cbalance2:', balance2.toString(), cbalance2.toString())
            expect(cbalance2).to.eq(bigNumber18.mul(100))

            let rate = await cusdt.exchangeRateStored()
            console.log('exchage rate:', rate.toString())

            await cusdt.connect(user1).redeem(bigNumber18.mul(100))
            let balance3 = await usdt.balanceOf(user1.address)
            let cbalance3 = await cusdt.balanceOf(user1.address)
            console.log('balance3, cbalance3:', balance3.toString(), cbalance3.toString())
            expect(cbalance3).to.eq(bigNumber18.mul(0))
        })
    })

    describe('#borrow and repay', async () => {
        beforeEach('each', async () => {
            await usdt.transfer(user1.address, bigNumber18.mul(1000))
            await usdt.transfer(user2.address, bigNumber18.mul(1000))
            await usdt.approve(cusdt.address, bigNumber18.mul(100000000))
            await usdt.connect(user1).approve(cusdt.address, bigNumber18.mul(100000000))
            await usdt.connect(user2).approve(cusdt.address, bigNumber18.mul(100000000))
            await cusdt.connect(user1).approve(cusdt.address, ethers.constants.MaxUint256)
            await cusdt.connect(user2).approve(cusdt.address, ethers.constants.MaxUint256)

            await cusdt.connect(user1).mint(bigNumber18.mul(100))
            let balance = await cusdt.balanceOf(user1.address)
            expect(balance).to.eq(bigNumber18.mul(100))

            await cusdt.connect(user2).mint(bigNumber18.mul(100))
            balance = await cusdt.balanceOf(user2.address)
            expect(balance).to.eq(bigNumber18.mul(100))
            
            balance = await usdt.balanceOf(cusdt.address)
            console.log('balance:', balance.toString())

            await comptroller.connect(user1).enterMarkets([cusdt.address])
            await comptroller.connect(user2).enterMarkets([cusdt.address])

        })

        it('failure', async () => {
            let pbalance1 = await usdt.balanceOf(cusdt.address)
            let balance1 = await usdt.balanceOf(user1.address)
            let cbalance1 = await cusdt.balanceOf(user1.address)
            console.log('pbalance1, balance1, cbalance1:', pbalance1.toString(), balance1.toString(), cbalance1.toString())
            
            let tx = await cusdt.connect(user1).borrow(bigNumber18.mul(10))
            let receipt = await tx.wait()
            for(let e of receipt.events) {
                if(e.event == 'Failure') {
                    // console.log(e)
                    expect(e.event).to.equal('Failure');
                    break;
                }
            }
            
            let pbalance2 = await usdt.balanceOf(cusdt.address)
            let balance2 = await usdt.balanceOf(user1.address)
            let cbalance2 = await cusdt.balanceOf(user1.address)
            console.log('pbalance1, balance2, cbalance2:', pbalance2.toString(), balance2.toString(), cbalance2.toString())
            // expect(await cusdt.balanceOf(user1.address)).to.eq(BigNumber.from(0))
        })

    })
})