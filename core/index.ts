import { type IRequestBody } from "./parse";
import { safeJsonParse } from "../utils";
import { parseHttpRequest } from "./parse";

export const TransactionGuard = (input: string): void => {
  let body = safeJsonParse<IRequestBody>(input);
  if (body !== undefined){
    console.log(body);
    let parsedBody = parseHttpRequest(body);
  };
};
