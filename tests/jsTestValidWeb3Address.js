#!/usr/bin/env node


function getAddressType(address) {
      address = address.trim();
  
      // ✅ Tezos: starts with known prefix, exactly 36 chars
      if (/^(tz1|tz2|tz3|KT1)[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
          return "tezos";
      }
  
      // ✅ EVM: 0x + 40 hex
      if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
          return "evm";
      }
  
      // ✅ Solana: 32–44 Base58, but must NOT start with tz1, tz2, tz3, or KT1
      if (
          /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address) &&
          !/^(tz1|tz2|tz3|KT1)/.test(address)
      ) {
          return "solana";
      }
  
      return null;
  }
  
        
function test(address) {
      const type = getAddressType(address);
      if (type)    console.log(`${type}: ${address}`);
}

test('0x4c3878f9a8751e88a2481ad153763e93d601c727');
test('7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV');
test('tz1R7tXrF5LM783mQFmEPp3qg14ooqakCcJ8');
test('tz1R7tXrF5LM783mQFmEPp3qg14ooqakCcJ81');

