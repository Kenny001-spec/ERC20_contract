import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DLTokenModule = buildModule("DLTokenModule", (m) => {
  const dltoken = m.contract("dltoken");
 
    return { dltoken };
  
});

export default DLTokenModule;
