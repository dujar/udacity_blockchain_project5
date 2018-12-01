const StarNotary = artifacts.require('StarNotary')


// createStar(), putStarUpForSale(), buyStar(), 
// checkIfStarExist(), mint(), 
//  approve(), safeTransferFrom(),
//    SetApprovalForAll(), getApproved(),
//     isApprovedForAll(), ownerOf(), starsForSale(), tokenIdToStarInfo()
contract('StarNotary', accounts => { 

    let user1 = accounts[1]
    let user2 = accounts[2]
    let randomMaliciousUser = accounts[3]

    let name = 'awesome star!'
    let starStory = "this star was bought for my wife's birthday"
    let ra = "1"
    let dec = "1"
    let mag = "1"
    let starId = 1
    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })

    

    describe('buying and selling stars', async function(){ 

        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function(){ 
            await this.contract.createStar(name, starStory, ra, dec, mag, starId, {from: user1})

        })

        it('user1 can put up their star for sale', async function(){ 
            // Add your logic here

            await this.contract.putStarUpForSale(starId,starPrice,{from: user1})
            assert.equal(await this.contract.starsForSale(starId),starPrice)
        })
        it('user1 gets the funds after selling a star', async function () { 
            let starPrice = web3.toWei(.05, 'ether')

            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})

            let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
            await this.contract.buyStar(starId, {from: user2, value: starPrice})
            let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)

            assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), 
                        balanceOfUser1AfterTransaction.toNumber())
        })

        describe('user2 can buy a star that was put up for sale', async function() { 
            beforeEach(async function(){ 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function(){ 
                // Add your logic here
                await this.contract.buyStar(starId,{from: user2,value: starPrice})
                assert.equal(await this.contract.ownerOf(starId),user2)
            })

            it('user2 ether balance changed correctly', async  function(){ 
                // Add your logic here
                let overpaidAmount = web3.toWei(.05, 'ether')

                const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice:0})
                const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

                assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice)
         

            })
            
        })
    })

    describe('can create a star', () => { 
        it('can create a star and get its star data', async function () { 
             // Add your logic here
             await this.contract.createStar(name, starStory,dec,mag,ra,starId, {from: user1});
             assert.deepEqual(await this.contract.tokenIdToStarInfo(starId),[name,starStory,dec,mag,ra])
        })
       
    })

    describe('star uniqueness',  function() { 
        // beforeEach('no idea',async function(){

        // })
            
            it('mints starId to the right owner', async function() {
                await this.contract.mint(starId, {from: user1})
                let owner = await this.contract.ownerOf(starId, {from: user1})
                assert.equal(owner, user1)
            })
            // then we try to mint the same star, and we expect an error
            it('cannot mint starId with different owner', async function(){
                //need to check the require function
                await this.contract.mint(starId, {from: user1})
                //it throws error as starId  is owned by user 1
                expectThrow(this.contract.mint(starId,{from: user2}))
            })
 
            it('minting unique stars does not fail', async function() { 
                for(let i = 1; i < 10; i ++) { 
                    let id = i
                    let newRa = i.toString()
                    let newDec = i.toString()
                    let newMag = i.toString()
    
                    await this.contract.createStar(name, starStory, newDec, newMag,newRa,  id, {from: user1})
    
                    let starInfo = await this.contract.tokenIdToStarInfo(id)
    
                    assert.deepEqual(starInfo, [name,starStory,newDec,newMag,newRa])
                }
            })

            //there is a problem here to be fixed
        it('only unique stars can be minted even if their ID is different', async function() { 
            // first we mint our first star
            let starId2 = 2
             await this.contract.createStar(name, starStory,dec,mag,ra,starId, {from: user1});
            // then we try to mint the same star, and we expect an error
            // should work!
            expectThrow(this.contract.createStar(name, starStory,dec,mag,ra,starId2, {from: user1}))
        })

     
    })
})

var expectThrow = async function(promise){ 
    try { 
        await promise
    } catch (error) { 
        assert.exists(error)
        return 
    }

    assert.fail('expected an error, but none was found')
}