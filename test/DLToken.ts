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
    });
});