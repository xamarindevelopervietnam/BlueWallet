/* global it, describe, jasmine */
global.net = require('net');

describe('Electrum', () => {
  it('can connect and query', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100 * 1000;
    const ElectrumClient = require('electrum-client');
    let bitcoin = require('bitcoinjs-lib');
    // let bitcoin = require('bitcoinjs-lib');

    const peer = { host: 'electrum.coinucopia.io', ssl: 50002, tcp: 50001, pruning: null, http: null, https: null };
    console.log('begin connection:', JSON.stringify(peer));
    let mainClient = new ElectrumClient(peer.tcp, peer.host, 'tcp');
    // mainClient = new ElectrumClient(peer.ssl, peer.host, 'ssl')
    try {
      await mainClient.connect();
      const ver = await mainClient.server_version('2.7.11', '1.2');
      console.log('connected to ', ver);
    } catch (e) {
      console.log('bad connection:', JSON.stringify(peer));
      throw new Error();
    }

    let addr4elect = 'bc1qwqdg6squsna38e46795at95yu9atm8azzmyvckulcc7kytlcckxswvvzej';
    let script = bitcoin.address.toOutputScript(addr4elect);
    let hash = bitcoin.crypto.sha256(script);
    let reversedHash = Buffer.from(hash.reverse());
    console.log(addr4elect, ' maps to ', reversedHash.toString('hex'));
    console.log(await mainClient.blockchainScripthash_getBalance(reversedHash.toString('hex')));

    addr4elect = '1BWwXJH3q6PRsizBkSGm2Uw4Sz1urZ5sCj';
    script = bitcoin.address.toOutputScript(addr4elect);
    hash = bitcoin.crypto.sha256(script);
    reversedHash = Buffer.from(hash.reverse());
    console.log(addr4elect, ' maps to ', reversedHash.toString('hex'));
    console.log(await mainClient.blockchainScripthash_getBalance(reversedHash.toString('hex')));

    // let peers = await mainClient.serverPeers_subscribe();
    // console.log(peers);
    mainClient.keepAlive = () => {}; // dirty hack to make it stop reconnecting
    mainClient.reconnect = () => {}; // dirty hack to make it stop reconnecting
    mainClient.close();
    // setTimeout(()=>process.exit(), 3000);
  });
});
