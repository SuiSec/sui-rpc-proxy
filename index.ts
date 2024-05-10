const mainnet = "https://fullnode.mainnet.sui.io:443";

import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { type IRequestBody } from "./core/parse";
import { safeJsonParse } from "./utils";
import { TransactionGuard } from "./core";

const app = express();
const port = 3000;

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
            TransactionGuard(body);
          });
          
          proxyReq.setHeader('Access-Control-Allow-Origin','*');
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
