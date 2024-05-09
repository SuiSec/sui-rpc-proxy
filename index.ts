const mainnet = "https://fullnode.mainnet.sui.io:443";

// let server = Bun.serve({
//   async fetch(req) {
//     const fakeheaders = req.headers;
//     fakeheaders.set("host", "https://fullnode.mainnet.sui.io");
//     console.log(req);
//     const response = await fetch(mainnet, {
//       method: req.method,
//       body: req.body,
//       headers: fakeheaders,
//     });
//     console.log(response);
//     return response;
//   },
// });

import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { TransactionBlock } from '@mysten/sui.js/transactions';

const app = express();
const port = 3000;

const delveMethods = ["sui_dryRunTransactionBlock", "sui_executeTransactionBlock"];

app.use(
  "/",
  createProxyMiddleware({
    target: "https://fullnode.mainnet.sui.io",
    changeOrigin: true,
    secure:false,
    on: {
      proxyReq: (proxyReq, req, res) => {
        /* handle proxyReq */
        let data: Uint8Array[] = [];
        let body = ''
        req.on("data", (chunk) => {
            data.push(chunk); // Accumulate the received data chunks into a Uint8Array array
        });
        req.on("end", () => {
            body = Buffer.concat(data).toString(); // Convert the accumulated data chunks into a string
            // console.log("body:", body);
            // Ensure that body is not empty and ends with a JSON format
            if (body && body.trim().endsWith('}')) {
                try {
                    const parsedBody = JSON.parse(body);
                    // Use parsedBody for subsequent operations
                    if (delveMethods.includes(parsedBody["method"])) {
                        // console.log("Parsed JSON body:", parsedBody);
                        const params = parsedBody["params"][0];
                        const binaryString = atob(params);
                        const uint8Array = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            uint8Array[i] = binaryString.charCodeAt(i);
                        }
                        // console.log(uint8Array);
                        const txb = TransactionBlock.from(uint8Array)

                        const txb_data = txb.blockData;
                        const inputs = txb_data["inputs"]
                        const txs = txb_data["transactions"]
                        const sender = txb_data.sender

                        console.log(txb_data)
                    } else {

                    }
                    // console.log("Parsed JSON body:", parsedBody);
                } catch (error) {
                    console.error("Error parsing JSON body:", error);
                    // Handle JSON parsing error, for example, by sending an error response to the client
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Error: Invalid JSON format');
                }
            } else {
                // If body is empty or the format is incorrect, handle the error
                console.error("Received data is not a valid JSON string");
                // Similarly, you can send an error response to the client here
            }
        });
        proxyReq.setHeader('Access-Control-Allow-Origin','*');
        
        //console.log(req.headers);
      },
      proxyRes: (proxyRes, req, res) => {
        /* handle proxyRes */
        proxyRes.headers["access-control-allow-headers"] = "*";

      },
      error: (err, req, res) => {
        /* handle error */
        console.log(err);
      },
    },
  })
);


app.listen(port);
