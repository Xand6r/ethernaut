import * as constants from "../constants";
import { getWeb3, setWeb3 } from "./ethutil";

// -- storage
export function cacheContract(data, chainId) {
  const key = constants.STORAGE_CONTRACT_DATA_KEY + chainId;
  // console.log(`CACHE CONTRACT`, key, data)
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function restoreContract(chainId) {
  const key = constants.STORAGE_CONTRACT_DATA_KEY + chainId;
  const data = JSON.parse(window.localStorage.getItem(key));
  // console.log(`RESTORE CONTRACT`, key, data)
  return data || {};
}

export function updateCachedContract(key, value, chainId) {
  const data = restoreContract(chainId);
  data[key] = value;
  cacheContract(data, chainId);
}

export function isLevelDeployed(levelDeployId, chainId) {
  const gamedata = restoreContract(chainId);
  return Boolean(gamedata[levelDeployId]);
}
// -- storage

export function getInjectedProvider() {
  let web3Instance = window.web3;
  if (window.ethereum) {
    web3Instance = new constants.Web3(window.ethereum);
  }
  if (!getWeb3()) setWeb3(web3Instance);
  return web3Instance;
}

// check the localstorage of the object containing address saved in localstorage
// contains all the core contracts
export function isLocalDeployed(chainId) {
  return constants.CORE_CONTRACT_NAMES.every(
    (contractName) => restoreContract(chainId)[contractName]
  );
}

// -- Utils

// return the right key to use to query the level object
// use address if factory is deployed
// use deployId otherwise
export function getLevelKey(levelAddress) {
  return constants.Web3.utils.isAddress(levelAddress)
    ? "deployedAddress"
    : "deployId";
}

export function fetchLevelABI(level) {
  const contractName = level.levelContract.split(".")[0];
  return require(`contracts/build/contracts/levels/${level.levelContract}/${contractName}.json`);
}

// -- Utils
