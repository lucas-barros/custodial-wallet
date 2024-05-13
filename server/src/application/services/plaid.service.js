export class PlaidService {
  client;
  config;
  constructor(plaidClient, { clientName, countryCodes, ...config }) {
    this.client = plaidClient;
    this.config = {
      client_name: clientName,
      country_codes: countryCodes,
      ...config,
    };
  }

  async createLinkToken(userId) {
    const config = {
      user: {
        client_user_id: String(userId),
      },
      ...this.config,
    };

    const responce = await this.client.linkTokenCreate(config);
    return responce.data;
  }

  async setAccessToken(publicToken) {
    const responce = await this.client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    return responce.data.access_token;
  }

  async getBalance(accessToken) {
    const responce = await this.client.accountsBalanceGet({
      access_token: accessToken,
    });
    return responce.data.accounts.map((account) => ({
      id: account.account_id,
      balance: account.balances.available,
      currency: account.balances.iso_currency_code,
      name: account.name,
    }));
  }
}
