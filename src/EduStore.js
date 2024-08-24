import { ethers } from "ethers";
import contractConfig from "./config/contractConfig.json"; // JSON dosyasını import ediyoruz

const address = contractConfig.contractAddress; // Sözleşme adresini JSON'dan alıyoruz
const abi = contractConfig.abi; // ABI'yi JSON'dan alıyoruz

export function getEduStoreContract(signer) {
  return new ethers.Contract(address, abi, signer);
}
