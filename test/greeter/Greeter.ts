import { artifacts, ethers, waffle } from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { Greeter } from "../../typechain/Greeter";
import { Signers } from "../types";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";
import { Greeter__factory } from "../../typechain/factories/Greeter__factory";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("Greeter", function () {
    beforeEach(async function () {
      const greeting: string = "Hello, world!";
      const greeterArtifact: Artifact = await artifacts.readArtifact("Greeter");
      const greeter: Greeter = <Greeter>await waffle.deployContract(this.signers.admin, greeterArtifact, [greeting]);

      // Get the runtime bytecode.
      const runtimeBytecode: string = await ethers.provider.getCode(greeter.address);

      // Deploy the token at a custom address.
      const customAddress: string = "0x0000000000000000000000000000000000001000";
      await ethers.provider.send("hardhat_setCode", [customAddress, runtimeBytecode]);

      // Load the Greeter contract at the new address.
      this.greeter = Greeter__factory.connect(customAddress, this.signers.admin);

      // Uncomment this line to make the tests pass again.
      // this.greeter = greeter;
    });

    shouldBehaveLikeGreeter();
  });
});
