import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

(async function main() {
  const lucid = await Lucid(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "<YOUR_API_KEY>"
    ),
    "Preprod"
  );

  const mnemonic = "<YOUR_MNEMONIC>";

  const receiverAddress = "<RECEIVER_ADDRESS>";

  lucid.selectWallet.fromSeed(mnemonic);

  const senderAddress = await lucid.wallet().address();
  console.log("senderAddress: ", senderAddress);

  const tx = await lucid
    .newTx()
    .pay.ToAddress(receiverAddress, { lovelace: 5000000n })
    .complete();

  const signedTx = await tx.sign.withWallet().complete();
  const txHash = await signedTx.submit();

  console.log("txHash: ", txHash);
})();
