import {
  Lucid,
  Blockfrost,
  Data,
  Constr,
  fromText,
} from "@lucid-evolution/lucid";
import { validatorToAddress, getAddressDetails } from "@lucid-evolution/utils";
import contract from "../sample/plutus.json" assert { type: "json" };

(async function main() {
  try {
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

    // Right mnemonic from Alice
    const mnemonic = "<ALICE_MNEMONIC>";

    // Wrong mnemonic from Bob
    // const mnemonic = "<BOB_MNEMONIC>";

    const message = "Hello World";

    lucid.selectWallet.fromSeed(mnemonic);

    const senderAddress = await lucid.wallet().address();
    console.log("senderAddress: ", senderAddress);

    const publicKeyHash =
      getAddressDetails(senderAddress).paymentCredential?.hash;
    console.log("publicKeyHash: ", publicKeyHash);

    const allUTxOs = await lucid.utxosAt(scriptAddress);
    const ownerUTxO = allUTxOs.find(
      (utxo) => utxo.txHash == "<TX_HASH_TO_UNLOCK>"
    );
    console.log("ownerUTxO: ", ownerUTxO);

    const redeemer = Data.to(new Constr(0, [fromText(message)]));
    console.log("redeemer: ", redeemer);

    const tx = await lucid
      .newTx()
      .collectFrom([ownerUTxO], redeemer)
      .attach.SpendingValidator(spendValidator)
      .addSigner(senderAddress)
      .complete();

    const signedTx = await tx.sign.withWallet().complete();
    const txHash = await signedTx.submit();
    console.log("txHash: ", txHash);
  } catch (err) {
    console.log("err: ", err.toJSON());
  }
})();
