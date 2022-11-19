import { BigNumber, ethers } from "ethers";
import { DATAMARKET_CONTRACT } from "./metadata";

// const getSigner = async () => {
//     await window.ethereum.enable();
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     return signer;
// };

// https://dapp-world.com/smartbook/how-to-use-ethers-with-fevm-k5Hn
export async function deployContract(signer, title, description, dataUrl, priceEth) {

  //   https://dev.to/yosi/deploy-a-smart-contract-with-ethersjs-28no

  // Create an instance of a Contract Factory
  const factory = new ethers.ContractFactory(
    DATAMARKET_CONTRACT.abi,
    DATAMARKET_CONTRACT.bytecode,
    signer
  );

  // const validatedAddress = ethers.utils.getAddress(signerAddress);
  const priceWei = ethers.utils.parseUnits(priceEth.toString(), "ether");

  // Start deployment, returning a promise that resolves to a contract object
  const contract = await factory.deploy(title, description, dataUrl, priceWei, new Date().toISOString())
  await contract.deployed();
  console.log("Contract deployed to address:", contract.address, title, description, dataUrl, priceWei);
  return contract;
}

export const validAddress = (addr) => {
  try {
    ethers.utils.getAddress(addr);
    return true;
  } catch (e) {
    return false;
  }
};

export const purchaseDataset = async (signer, contractAddress, price) => {
  if (!contractAddress) {
    throw Error('No contract address provided')
  }
  const dataContract = new ethers.Contract(
    contractAddress,
    DATAMARKET_CONTRACT.abi,
    signer
  );

  let priceWei = price
  if (price < 1) {
    priceWei = ethers.utils.parseUnits(price.toString(), "ether");
 
  }
  console.log('purchase', priceWei)

  const result = await dataContract.purchaseData({
      gasLimit: 250000, value: priceWei
  });
  return result;
};

export const getMetadata = async (signer, contractAddress) => {
  if (!contractAddress) {
    throw Error('No contract address provided')
  }

  const dataContract = new ethers.Contract(
    contractAddress,
    DATAMARKET_CONTRACT.abi,
    signer
  );
  console.log('getMetadata', contractAddress)
  const result = await dataContract.getMetadataString();
  return result;
};


export const flagDataset = async (signer, contractAddress, reason) => {
  if (!contractAddress) {
    throw Error('No contract address provided')
  }

  if (!reason) {
    throw Error('reason is required')
  }

  const dataContract = new ethers.Contract(
    contractAddress,
    DATAMARKET_CONTRACT.abi,
    signer
  );
  const result = await dataContract.flagDataset(reason);
  return result;
}
