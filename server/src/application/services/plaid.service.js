import { createErr, createOk } from "option-t/PlainResult";

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
    try {
      const config = {
        user: {
          client_user_id: String(userId),
        },
        ...this.config,
      };

      const response = await this.client.linkTokenCreate(config);
      return createOk(response.data);
    } catch {
      return createErr("Plaid API error");
    }
  }

  async setAccessToken(publicToken) {
    const response = await this.client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    return response.data.access_token;
  }

  async getAccounts(accessToken) {
    const response = await this.client.accountsBalanceGet({
      access_token: accessToken,
    });
    return response.data.accounts.map((account) => ({
      id: account.account_id,
      balance: account.balances.available,
      currency: account.balances.iso_currency_code,
      name: account.name,
    }));
  }
}
