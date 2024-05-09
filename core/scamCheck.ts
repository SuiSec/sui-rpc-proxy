import type { TransactionBlock } from "@mysten/sui.js/transactions";

export const CheckTransaction = (txbdata:TransactionBlock | undefined):boolean => {
    console.log(txbdata?.blockData);
    return true;
}