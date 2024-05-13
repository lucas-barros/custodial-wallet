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

    const createTokenResponse = await this.client.linkTokenCreate(config);
    return createTokenResponse.data;
  }

  async setAccessToken(publicToken) {
    const tokenResponse = await this.client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    return tokenResponse.data.access_token;
  }
}
