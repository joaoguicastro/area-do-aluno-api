export function normalizarCPF(cpf: string) {
  return (cpf || '').replace(/\D/g, '');
}

export function cpf11(cpf: string) {
  return /^\d{11}$/.test(normalizarCPF(cpf));
}

