import { Wallet, BigNumber } from 'ethers'
import { ethers, network, waffle } from 'hardhat'
import { Unitroller } from '../typechain/Unitroller'
import { ComptrollerG1 } from '../typechain/ComptrollerG1'
import { SimplePriceOracle } from '../typechain/SimplePriceOracle'
import { WhitePaperInterestRateModel } from '../typechain/WhitePaperInterestRateModel'
import { Comp } from '../typechain/Comp'
import { ERC20Harness } from '../typechain/ERC20Harness'
import { CErc20 } from '../typechain/CErc20'
import { CErc20Delegate } from '../typechain/CErc20Delegate'
import { CErc20Delegator } from '../typechain/CErc20Delegator'
import { CEther } from '../typechain/CEther'
import { expect } from './shared/expect'
import { comptrollerFixture, createToken, createCToken, createCEther, bigNumber18, bigNumber17, bigNumber16 } from './shared/fixtures'

const createFixtureLoader = waffle.createFixtureLoader
let wallet: Wallet,
user1: Wallet,
user2: Wallet,
user3: Wallet,
user4: Wallet;

let comptroller: ComptrollerG1
let priceOracle: SimplePriceOracle
let comp: Comp
let unitroller: Unitroller
let interestRateModel: WhitePaperInterestRateModel
let t1: ERC20Harness
let t2: ERC20Harness
let ct1: CErc20Delegator
let ct2: CErc20Delegator
let ceth: CEther


describe('Comptroller', async () => {
    let loadFixTure: ReturnType<typeof createFixtureLoader>;

    let exchangeRate1 = bigNumber18.mul(100000000)
    let exchangeRate2 = bigNumber18.mul(200000000)
    let price1 = bigNumber18.mul(1)
    let price2 = bigNumber18.mul(2)
    let ethprice = bigNumber18.mul(4000)
    let collateralFactor = bigNumber17.mul(6)

    before('create fixture loader', async () => {
        [wallet, user1, user2, user3, user4] = await (ethers as any).getSigners()
        loadFixTure = createFixtureLoader([wallet])
        ; ({ comp, comptroller, priceOracle, unitroller, interestRateModel } = await loadFixTure(comptrollerFixture));

        t1 = (await createToken(
            bigNumber18.mul(100000000),
            18,
            "T1-Test",
            "T1"
        ))

        t2 = (await createToken(
            bigNumber18.mul(100000000),
            18,
            "T2-Test",
            "T2"
        ))
    })

    beforeEach('deploy Comptroller', async () => {
        ct1 = (await createCToken(
            t1.address,
            comptroller.address,
            interestRateModel.address,
            exchangeRate1,
            "Compound T1-Test",
            "cT1",
            18,
            wallet.address
        ))

        ct2 = (await createCToken(
            t2.address,
            comptroller.address,
            interestRateModel.address,
            exchangeRate2,
            "Compound T2-Test",
            "cT2",
            18,
            wallet.address
        ))

        ceth = (await createCEther(
            comptroller.address,
            interestRateModel.address,
            exchangeRate2,
            "Compound ETH-Test",
            "cETH",
            18,
            wallet.address
        ))

        await priceOracle.setUnderlyingPrice(ct1.address, price1)
        await priceOracle.setUnderlyingPrice(ct2.address, price2)
        await priceOracle.setUnderlyingPrice(ceth.address, ethprice)
        await comptroller._supportMarket(ct1.address)
        await comptroller._supportMarket(ct2.address)
        await comptroller._supportMarket(ceth.address)
        await comptroller._setCollateralFactor(ct1.address, collateralFactor)
        await comptroller._setCollateralFactor(ct2.address, collateralFactor)
        await comptroller._setCollateralFactor(ceth.address, collateralFactor)
    })

    describe('#base', async () => {
        it('oracle', async () => {
            expect(await comptroller.oracle()).to.eq(priceOracle.address)
        })

        it('getAssetsIn', async () => {
            await comptroller.connect(user1).enterMarkets([ct1.address])
            let enteredMarkets = await comptroller.getAssetsIn(user1.address)
            expect(enteredMarkets.length).to.eq(1)
        })

        it('getAccountSnapshot', async () => {
            let res = await ct1.getAccountSnapshot(user1.address)
            expect(res[0]).to.eq(0)
            expect(res[1]).to.eq(BigNumber.from(0))
            expect(res[2]).to.eq(BigNumber.from(0))
            expect(res[3]).to.eq(exchangeRate1)

            res = await ct2.getAccountSnapshot(user1.address)
            expect(res[0]).to.eq(0)
            expect(res[1]).to.eq(BigNumber.from(0))
            expect(res[2]).to.eq(BigNumber.from(0))
            expect(res[3]).to.eq(exchangeRate2)
        })

        it('getUnderlyingPrice', async () => {
            let b1 = await priceOracle.getUnderlyingPrice(ct1.address)
            let b2 = await priceOracle.getUnderlyingPrice(ct2.address)
            expect(await priceOracle.getUnderlyingPrice(ct1.address)).to.eq(price1)
            expect(await priceOracle.getUnderlyingPrice(ct2.address)).to.eq(price2)
        })

        it('getComtroller', async () => {
            expect(await unitroller.admin()).to.eq(wallet.address)
        })

    })

    describe('#mint and redeem for cether', async () => {

        it('success', async () => {
            let balance1 = await ethers.provider.getBalance(user1.address)
            let cbalance1 = await ceth.balanceOf(user1.address)
            let rate = await ceth.exchangeRateStored()
            // console.log('exchage rate:', rate.toString())
            // console.log('balance1, cbalance1:', balance1.toString(), cbalance1.toString())
            await ceth.connect(user1).mint({value:bigNumber18.mul(2)})
            let balance2 = await ethers.provider.getBalance(user1.address)
            let cbalance2 = await ceth.balanceOf(user1.address)
            // console.log('balance2, cbalance2:', balance2.toString(), cbalance2.toString())
            expect(cbalance2).to.eq(bigNumber18.mul(2).mul(bigNumber18).div(rate))
            expect(balance1).to.gt(bigNumber18.mul(2).add(balance2))

            await ceth.connect(user1).redeem(cbalance2)
            let balance3 = await t1.balanceOf(user1.address)
            let cbalance3 = await ceth.balanceOf(user1.address)
            // console.log('balance3, cbalance3:', balance3.toString(), cbalance3.toString())
            expect(cbalance3).to.eq(bigNumber18.mul(0))
        })
    })

    describe('#mint and redeem for ctoken', async () => {
        beforeEach('each', async () => {
            await t1.transfer(user1.address, bigNumber18.mul(1000))
            await t1.approve(ct1.address, bigNumber18.mul(100000000))
            await t1.connect(user1).approve(ct1.address, bigNumber18.mul(100000000))
        })

        it('success', async () => {
            let balance1 = await t1.balanceOf(user1.address)
            let cbalance1 = await ct1.balanceOf(user1.address)
            let rate = await ct1.exchangeRateStored()
            // console.log('exchage rate:', rate.toString())
            // console.log('balance1, cbalance1:', balance1.toString(), cbalance1.toString())
            await ct1.connect(user1).mint(bigNumber18.mul(100))
            let balance2 = await t1.balanceOf(user1.address)
            let cbalance2 = await ct1.balanceOf(user1.address)
            // console.log('balance2, cbalance2:', balance2.toString(), cbalance2.toString())
            expect(cbalance2).to.eq(bigNumber18.mul(100).mul(bigNumber18).div(rate))

            await ct1.connect(user1).redeem(cbalance2)
            let balance3 = await t1.balanceOf(user1.address)
            let cbalance3 = await ct1.balanceOf(user1.address)
            // console.log('balance3, cbalance3:', balance3.toString(), cbalance3.toString())
            expect(balance3).to.eq(balance1)
            expect(cbalance3).to.eq(bigNumber18.mul(0))
        })
    })

    describe('#borrow and repay', async () => {
        beforeEach('each', async () => {
            await t1.transfer(user1.address, bigNumber18.mul(1000))
            await t2.transfer(user2.address, bigNumber18.mul(1000))
            await t1.connect(user1).approve(ct1.address, bigNumber18.mul(100000000))
            await t1.connect(user2).approve(ct1.address, bigNumber18.mul(100000000))
            await t2.connect(user2).approve(ct2.address, bigNumber18.mul(100000000))
            await ct1.connect(user1).approve(ct1.address, ethers.constants.MaxUint256)
            await ct2.connect(user2).approve(ct2.address, ethers.constants.MaxUint256)

            let rate1 = await ct1.exchangeRateStored()
            // console.log('rate1:', rate1.toString())
            await ct1.connect(user1).mint(bigNumber18.mul(100))
            let balance = await ct1.balanceOf(user1.address)
            expect(balance).to.eq(bigNumber18.mul(100).mul(bigNumber18).div(rate1))
            // console.log('ct1 balance:', balance.toString())

            let rate2 = await ct2.exchangeRateStored()
            // console.log('rate2:', rate2.toString())
            await ct2.connect(user2).mint(bigNumber18.mul(100))
            balance = await ct2.balanceOf(user2.address)
            expect(balance).to.eq(bigNumber18.mul(100).mul(bigNumber18).div(rate2))
            // console.log('ct2 balance:', balance.toString())

            await comptroller.connect(user1).enterMarkets([ct1.address,ct2.address])
            await comptroller.connect(user2).enterMarkets([ct1.address,ct2.address])

        })

        it('success', async () => {
            let pbalance1 = await t1.balanceOf(ct1.address)
            let balance1 = await t1.balanceOf(user1.address)
            let cbalance1 = await ct1.balanceOf(user1.address)
            // console.log('pbalance1, balance1, cbalance1:', pbalance1.toString(), balance1.toString(), cbalance1.toString())
            // let rate1 = await ct1.exchangeRateStored()
            // console.log('rate1:', rate1.toString())

            let tx = await ct1.connect(user2).borrow(bigNumber18.mul(10))
            let receipt = await tx.wait()
            for(let e of receipt.events) {
                if(e.event == 'Failure') {
                    console.log(e)
                    expect(e.event).to.equal('Borrow');
                    break;
                }
            }
            // let rate2 = await ct1.exchangeRateStored()
            // console.log('rate2:', rate2.toString())
            
            let pbalance2 = await t1.balanceOf(ct1.address)
            let balance2 = await t1.balanceOf(user1.address)
            let cbalance2 = await ct1.balanceOf(user1.address)
            let user2balance = await t1.balanceOf(user2.address)
            // console.log('pbalance2, balance2, cbalance2, user2balance:', pbalance2.toString(), balance2.toString(), cbalance2.toString(), user2balance.toString())
            expect(pbalance2.add(bigNumber18.mul(10))).to.eq(pbalance1)
            expect(user2balance).to.eq(bigNumber18.mul(10))

            // repay
            tx = await ct1.connect(user2).repayBorrow(bigNumber18.mul(10))
            receipt = await tx.wait()
            for(let e of receipt.events) {
                if(e.event == 'Failure') {
                    console.log(e)
                    expect(e.event).to.equal('RepayBorrow');
                    break;
                }
            }

            let pbalance3 = await t1.balanceOf(ct1.address)
            let balance3 = await t1.balanceOf(user1.address)
            let cbalance3 = await ct1.balanceOf(user1.address)
            user2balance = await t1.balanceOf(user2.address)
            // console.log('pbalance3, balance3, cbalance3, user2balance:', pbalance3.toString(), balance3.toString(), cbalance3.toString(), user2balance.toString())
            expect(pbalance3).to.eq(pbalance1)
            expect(user2balance).to.eq(0)

        })

    })
})