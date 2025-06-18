import { Lucid, Blockfrost, Data, Constr } from "@lucid-evolution/lucid";
import { validatorToAddress, getAddressDetails } from "@lucid-evolution/utils";
import contract from "../sample/plutus.json" assert { type: "json" };

(async function main() {
  const lucid = await Lucid(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "<YOUR_API_KEY>"
    ),
    "Preprod"
  );

  const spendValidator = {
    type: "PlutusV3",
    script: contract.validators[0].compiledCode,
  };

  const scriptAddress = validatorToAddress("Preprod", spendValidator);
  console.log("scriptAddress: ", scriptAddress);

  // Alice address
  const mnemonic = "<ALICE_MNEMONIC>";

  lucid.selectWallet.fromSeed(mnemonic);

  const senderAddress = await lucid.wallet().address();
  console.log("senderAddress: ", senderAddress);

  const publicKeyHash =
    getAddressDetails(senderAddress).paymentCredential?.hash;
  console.log("publicKeyHash: ", publicKeyHash);

  const datum = Data.to(new Constr(0, [publicKeyHash]));
  console.log("datum: ", datum);

  const tx = await lucid
    .newTx()
    .pay.ToContract(
      scriptAddress,
      { kind: "inline", value: datum },
      { lovelace: 5_000_000n }
    )
    .complete();

  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();
  console.log("txHash: ", txHash);
})();
