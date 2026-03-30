/** Sepolia Etherscan URLs for transparency links in the UI */

export function sepoliaTxUrl(hash: `0x${string}` | string): string {
  return `https://sepolia.etherscan.io/tx/${hash}`;
}

export function sepoliaAddressUrl(address: `0x${string}` | string): string {
  return `https://sepolia.etherscan.io/address/${address}`;
}
