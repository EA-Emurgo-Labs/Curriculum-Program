import Blockfrost from "@blockfrost/blockfrost-js";

const API = new Blockfrost.BlockFrostAPI({
  projectId: "<YOUR_API_KEY>",
});

(async function runExample() {
  try {
    const latestBlock = await API.blocksLatest();
    const latestEpoch = await API.epochsLatest();
    const health = await API.health();
    const networkInfo = await API.network();

    console.log("latestBlock: ", latestBlock);
    console.log("latestEpoch: ", latestEpoch);
    console.log("health: ", health);
    console.log("networkInfo: ", networkInfo);

    const addresses = await API.addresses(
      "addr_test1qpclqr4zutq2s2frxp0d50dkc972sd5g99anvdhqs055fgjyypme3kcesvl9mf7cukee6htxeh72zv3uwqhjr07dljeqv322sv"
    );
    console.log("addresses: ", addresses);

    const utxos = await API.addressesUtxos(
      "addr_test1qpclqr4zutq2s2frxp0d50dkc972sd5g99anvdhqs055fgjyypme3kcesvl9mf7cukee6htxeh72zv3uwqhjr07dljeqv322sv"
    );
    console.log("utxos: ", utxos);
  } catch (err) {
    console.log("error: ", err);
  }
})();
