import { ethers } from "ethers";

const rpcUrl = "https://api.avax-test.network/ext/bc/C/rpc";

export const getProvider = () => {
    return new ethers.JsonRpcProvider(rpcUrl);
};
