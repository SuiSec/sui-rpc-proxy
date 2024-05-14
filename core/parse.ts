import { TransactionBlock } from "@mysten/sui.js/transactions";

export interface IRequestBody {
  jsonrpc: string;
  id: number;
  method: string;
  params: string[];
}
const delveMethods = [
  "sui_dryRunTransactionBlock",
  "sui_executeTransactionBlock",
];
export const parseHttpRequest = (
  body: IRequestBody
): TransactionBlock | undefined => {
  if (delveMethods.includes(body.method)) {
    const params = body.params[0];
    const binaryString = atob(params);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    const txb = TransactionBlock.from(uint8Array);
    const txb_data = txb.blockData;
    console.log(txb_data);
    // const inputs = txb_data["inputs"];
    // const txs = txb_data["transactions"];
    // const sender = txb_data.sender;
    return txb;
  }
};
