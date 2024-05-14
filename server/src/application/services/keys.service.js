import bip38 from "bip38";
import bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import { ECPairFactory } from "ecpair";

export class KeysService {
  ECPair;
  constructor() {
    this.ECPair = ECPairFactory(ecc);
  }
  createKeys() {
    const keyPair = this.ECPair.makeRandom();
    const p2wpkh = bitcoin.payments.p2wpkh({
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.regtest,
    });
    const encryptedKey = bip38.encrypt(
      keyPair.privateKey,
      keyPair.compressed,
      process.env.BITCOIN_ENCRYPTION_PASS
    );

    return {
      publicAddress: p2wpkh.address,
      encryptedPrivateKey: encryptedKey,
    };
  }
}
