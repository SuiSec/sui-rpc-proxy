import { Transaction } from "@mysten/sui/transactions";

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
): Transaction | undefined => {
  if (delveMethods.includes(body.method)) {
    const params = body.params[0];
    const binaryString = atob(params);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    const tx = Transaction.from(uint8Array);
    const tx_data = tx.getData();
    console.log(tx_data);
    // const inputs = tx_data["inputs"];
    // const txs = tx_data["transactions"];
    // const sender = tx_data.sender;
    return tx;
  }
};
