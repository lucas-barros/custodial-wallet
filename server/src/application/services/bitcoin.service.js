export class BitcoinService {
  client;
  walletName;
  constructor(bitcoinClient, walletName) {
    this.client = bitcoinClient;
    this.walletName = walletName;
  }

  loadWallet() {
    this.client.command("listwalletdir").then(async ({ wallets }) => {
      const isCreated = wallets[0]?.name === this.walletName;
      if (isCreated) {
        await this.client.command("loadwallet", this.walletName);
        console.log("Wallet loaded!");
      } else {
        await this.client.command("createwallet", this.walletName, false);
        console.log("Wallet created!");
      }
    });
  }

  unloadWallet() {
    return this.client.command("unloadwallet", this.walletName);
  }

  async getExtBalance(extAddress) {
    const balance = await this.client.command("scantxoutset", "start", [
      `addr(${extAddress})`,
    ]);
    return balance.total_amount;
  }
}
