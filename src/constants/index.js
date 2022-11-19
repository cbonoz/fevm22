import { formatDate } from "../util";

export const APP_NAME = 'Datamarket'
export const APP_DESC = 'A self-governing data exchange built on FEVM'

const hostname = window.location.hostname
export const IS_LOCAL = hostname.indexOf("localhost") !== -1

export const COVALENT_KEY = process.env.REACT_APP_COVALENT_KEY; // covalent api key

export const EXAMPLE_FORM = {
    'title': 'Boston business phone number dataset',
    'description': 'This dataset contains 500 rows of names and phones that belong to business owners in the Boston area',
    'dataUrl': 'bafybeib2vuqadrzngsawjxpcysyq3u3z7pjzcpv2tl32d6vy5bqw6oi3x4',
    'keywords': 'business, phone numbers, contacts, boston, united states',
    'createdAt': formatDate(),
    'priceEVM': 0.01,
    'files': []
}

export const getExampleResponse = () => ({
  ...EXAMPLE_FORM,
  purchases: 0,
})


export const WEB3_PROJECT_ID = process.env.REACT_APP_WC_ID || 'ec17b7971a950170d6c5710eb878ba9b';

export const CHAIN_OPTIONS = {
    31415: {
      name: "Filecoin Wallaby",
      symbol: "TFIL",
      url: "https://explorer.glif.io/",
      blockExplorers: ["https://explorer.glif.io/"],
      id: 31415,
      rpcUrls: ['https://wallaby.node.glif.io/rpc/v0']
    }
  };
  
  export const ACTIVE_CHAIN = CHAIN_OPTIONS[process.env.REACT_APP_ACTIVE_CHAIN_ID || "31415"];
  
  export const IPFS_BASE_URL = "https://ipfs.io/ipfs"