import { checkInadimplencia } from '../financeiro/check-inadimplencia.js';

export async function computeFinanceLock(alunoId: string) {
  const r = await checkInadimplencia(alunoId);
  return {
    // se deve bloquear a navegação normal
    active: r.requireFinance,         // true quando há inadimplência segundo sua regra
    // dados auxiliares para o front
    limite: r.diasMaxAtraso,          // “limite” de atraso configurado/regra
    maiorAtraso: r.maiorAtrasoDias,   // maior atraso encontrado
    vencidas: r.vencidas,             // quantidade de parcelas vencidas
    totalVencido: r.totalVencido,     // somatório em R$
  };
}
