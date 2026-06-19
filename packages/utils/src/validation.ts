const CPF_LENGTH = 11;
const CNPJ_LENGTH = 14;

export function stripDocument(doc: string): string {
  return doc.replace(/\D/g, '');
}

export function isValidCPF(cpf: string): boolean {
  const digits = stripDocument(cpf);
  if (digits.length !== CPF_LENGTH) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i], 10) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9], 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i], 10) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === parseInt(digits[10], 10);
}

export function isValidCNPJ(cnpj: string): boolean {
  const digits = stripDocument(cnpj);
  if (digits.length !== CNPJ_LENGTH) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(digits[i], 10) * weights1[i];
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(digits[12], 10)) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(digits[i], 10) * weights2[i];
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  return digit2 === parseInt(digits[13], 10);
}

export function isValidDocument(doc: string): boolean {
  const digits = stripDocument(doc);
  return digits.length === CPF_LENGTH ? isValidCPF(doc) : isValidCNPJ(doc);
}
