import { type IRequestBody } from "./parse";
import { safeJsonParse } from "../utils";
import { CheckTransaction } from "./scamCheck";
import { parseHttpRequest } from "./parse";

export const TransactionGuard = (input: string): boolean => {
  let body = safeJsonParse<IRequestBody>(input);
  if (body !== undefined){
    let parsedBody = parseHttpRequest(body);
    return CheckTransaction(parsedBody);
  };
  return false;
};
