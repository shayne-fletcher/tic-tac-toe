export const LEDGER_ID: string = 'default-ledgerid';

export const APPLICATION_ID: string = 'tic-tac-toe';

export const SECRET_KEY: string = 'secret';

export function computeToken(party: string): string {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZWRnZXJJZCI6ImRlZmF1bHQtbGVkZ2VyaWQiLCJhcHBsaWNhdGlvbklkIjoiZm9vYmFyIiwicGFydHkiOiJBbGljZSJ9.X19OPSV2YgAsui249oxQqUDDfNXnpxPAnra9qUU6m9s";
  return token;
}

export type Credentials = {
  party: string;
  token: string;
}

export const computeCredentials = (party: string): Credentials => {
  const token = computeToken(party);
  return {party, token};
}

export default Credentials;
