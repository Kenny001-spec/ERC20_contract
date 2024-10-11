import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";


describe("DLToken Test", function () {
    //Reusable async method for deployment
    async function deployDLTokenFixure() {
      //Contracts are deployed using the first signer/account by default
  
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const DLToken = await hre.ethers.getContractFactory("DLToken");
      const dltoken = await DLToken.deploy("DLToken", "DLT");
  
      return { dltoken, owner, otherAccount };
    }

    describe("deployment", () => {
        it("Should check if it deployed", async function () {
          const { dltoken, owner } = await loadFixture(deployDLTokenFixure);
    
          expect(await dltoken.owner()).to.equal(owner.address);
        });
    });

    it("Should have correct token name and symbol", async function () {
        const { dltoken } = await loadFixture(deployDLTokenFixure);

        expect(await dltoken.getTokenName()).to.equal("DLToken");
        expect(await dltoken.getSymbol()).to.equal("DLT");
    });

    it("Should assign the total supply to the owner", async function () {
        const { dltoken, owner } = await loadFixture(deployDLTokenFixure);

        const totalSupply = await dltoken.getTotalSupply();

        const ownerBalance = await dltoken.balanceOf(owner.address);

        expect(totalSupply).to.equal(ownerBalance);
    });

    describe("Transfers", function () {
        it("Should transfer tokens successfully between accounts", async function () {
            const { dltoken, owner, otherAccount } = await loadFixture(deployDLTokenFixure);
            const amountToTransfer = 500;

            await dltoken.transfer(otherAccount.address, amountToTransfer);
            
            const ownerBalance = await dltoken.balanceOf(owner.address);
            const otherAccountBalance = await dltoken.balanceOf(otherAccount.address);

            
            expect(otherAccountBalance).to.equal(amountToTransfer);
        })

        it("Should not allow transfer to zero address", async function () {
            const { dltoken, owner } = await loadFixture(deployDLTokenFixure);
            await expect(dltoken.transfer("0x0000000000000000000000000000000000000000", 100)).to.be.revertedWith("Address is not allowed");
        });

        // it("Should burn 5% of the transferred amount", async function () {
        //     const { dltoken, owner, otherAccount } = await loadFixture(deployDLTokenFixure);
        //     const initialSupply = await dltoken.getTotalSupply();
        //     const amountToTransfer = 1000;
        
        //     await dltoken.transfer(otherAccount.address, amountToTransfer);
        
        //     const finalSupply = await dltoken.getTotalSupply();
        //     const expectedBurnAmount = (amountToTransfer * 5) / 100;
        //     const expectedSupply = initialSupply - expectedBurnAmount;
        
        //     expect(finalSupply).to.equal(expectedSupply);
        // });
        
        
    });

    describe("Allowance and Approvals", function () {
        it("Should approve tokens for delegated transfer", async function () {
            const { dltoken, owner, otherAccount } = await loadFixture(deployDLTokenFixure);
            const amountToApprove = 500;

            await dltoken.approve(otherAccount.address, amountToApprove);

            expect(await dltoken.allowance(owner.address, otherAccount.address)).to.equal(amountToApprove);
        });

        it("Should transfer tokens from approved account", async function () {
            const { dltoken, owner, otherAccount } = await loadFixture(deployDLTokenFixure);
            const amountToApprove = 500;
            const amountToTransfer = 200;
            
            await dltoken.approve(otherAccount.address, amountToApprove);
            await dltoken.connect(otherAccount).transferFrom(owner.address, otherAccount.address, amountToTransfer);
            
            expect(await dltoken.balanceOf(otherAccount.address)).to.equal(amountToTransfer);
            expect(await dltoken.allowance(owner.address, otherAccount.address)).to.equal(amountToApprove - amountToTransfer);
        });

        it("Should not allow transfer from zero address", async function () {
         
            
            it("Should not allow transfer exceeding allowance", async function () {
            const { dltoken, owner, otherAccount } = await loadFixture(deployDLTokenFixure);
            await dltoken.approve(otherAccount.address, 200);
            await expect(dltoken.connect(otherAccount).transferFrom(owner.address, otherAccount.address, 300)).to.be.revertedWith("Address is not allowed");
            });
        });

    });
});



