import { assert } from "chai";

import { workaroundWindowsCiFailures } from "../../../../../../utils/workaround-windows-ci-failures";
import { setCWD } from "../../../../helpers/cwd";
import {
  DEFAULT_ACCOUNTS_ADDRESSES,
  PROVIDERS,
} from "../../../../helpers/providers";

// eslint-disable-next-line  @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention
const { recoverTypedSignature_v4 } = require("eth-sig-util");

describe("Eth module", function () {
  PROVIDERS.forEach(({ name, useProvider, isFork }) => {
    if (isFork) {
      this.timeout(50000);
    }

    workaroundWindowsCiFailures.call(this, { isFork });

    describe(`${name} provider`, function () {
      setCWD();
      useProvider();

      describe("eth_signTypedData_v4", function () {
        // See https://eips.ethereum.org/EIPS/eip-712#parameters
        // There's a json schema and an explanation for each field.
        const typedMessage = {
          domain: {
            chainId: 31337,
            name: "Hardhat Network test suite",
          },
          message: {
            name: "Translation",
            start: {
              x: 200,
              y: 600,
            },
            end: {
              x: 300,
              y: 350,
            },
            cost: 50,
          },
          primaryType: "WeightedVector",
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "chainId", type: "uint256" },
            ],
            WeightedVector: [
              { name: "name", type: "string" },
              { name: "start", type: "Point" },
              { name: "end", type: "Point" },
              { name: "cost", type: "uint256" },
            ],
            Point: [
              { name: "x", type: "uint256" },
              { name: "y", type: "uint256" },
            ],
          },
        };
        const [address] = DEFAULT_ACCOUNTS_ADDRESSES;

        it("should sign a message", async function () {
          const signature = await this.provider.request({
            method: "eth_signTypedData_v4",
            params: [address, typedMessage],
          });
          const signedMessage = {
            data: typedMessage,
            sig: signature,
          };

          const recoveredAddress = recoverTypedSignature_v4(
            signedMessage as any
          );
          assert.equal(address.toLowerCase(), recoveredAddress.toLowerCase());
        });

        it("should sign a message that is JSON stringified", async function () {
          const signature = await this.provider.request({
            method: "eth_signTypedData_v4",
            params: [address, JSON.stringify(typedMessage)],
          });
          const signedMessage = {
            data: typedMessage,
            sig: signature,
          };

          const recoveredAddress = recoverTypedSignature_v4(
            signedMessage as any
          );
          assert.equal(address.toLowerCase(), recoveredAddress.toLowerCase());
        });

        it("should fail with an invalid JSON", async function () {
          try {
            await this.provider.request({
              method: "eth_signTypedData_v4",
              params: [address, "{an invalid JSON"],
            });
          } catch (error) {
            assert.include(error.message, "is an invalid JSON");
            return;
          }
          assert.fail("should have failed with an invalid JSON");
        });
      });
    });
  });
});
