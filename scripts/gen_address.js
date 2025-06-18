import { generateSeedPhrase, walletFromSeed } from "@lucid-evolution/lucid";

const mnemonic = generateSeedPhrase();
console.log("mnemonic: ", mnemonic);

const wallet = walletFromSeed(mnemonic, { network: "Preprod" });
console.log("wallet: ", wallet);
