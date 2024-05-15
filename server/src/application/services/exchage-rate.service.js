export class ExchangeRateService {
  key;
  _cacheTtl = 10_000;
  constructor(key) {
    this.key = key;
    this.btcInUsd = null;
  }

  _cacheRate(btcInUsd) {
    this.btcInUsd = btcInUsd;
    console.log("btcInUsd cache set");
    setTimeout(() => {
      console.log("btcInUsd cache cleared");
      this.btcInUsd = undefined;
    }, this._cacheTtl);
  }

  async getBtcInUsd() {
    try {
      if (this.btcInUsd) {
        console.log("btcInUsd cache hit");
        return this.btcInUsd;
      }

      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        {
          method: "get",
          headers: { accept: "application/json", "x-cg-pro-api-key": this.key },
        }
      );

      const responseJson = await response.json();
      const btcInUsd = responseJson.bitcoin.usd;
      this._cacheRate(btcInUsd);

      return responseJson.bitcoin.usd;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
