export class ExchangeRateService {
  key;
  constructor(key) {
    this.key = key;
  }

  async btcInUsd() {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      {
        method: "get",
        headers: { accept: "application/json", "x-cg-pro-api-key": this.key },
      }
    );

    const responseJson = await response.json();
    return responseJson.bitcoin.usd;
  }
}
