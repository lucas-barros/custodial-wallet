import bip39 from "bip39";
import bip38 from "bip38";
import HDKey from "hdkey";
import bitcoin from "bitcoinjs-lib";
import CoinKey from "coinkey";

export class KeysService {
  createKeys() {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdkey = HDKey.fromMasterSeed(Buffer.from(seed, "hex"));
    const child = hdkey.derive("m/44'/0'/0'/0/0");
    const coinKey = new CoinKey(child.privateKey, bitcoin.networks.bitcoin);
    const encryptedKey = bip38.encrypt(
      coinKey.privateKey,
      coinKey.compressed,
      process.env.BITCOIN_ENCRYPTION_PASS
    );

    return {
      publicAddress: coinKey.publicAddress,
      encryptedPrivateKey: encryptedKey,
    };
  }
}
