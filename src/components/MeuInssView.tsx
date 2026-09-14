import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  UploadCloud,
  Calculator,
  ExternalLink,
  Search,
  Check,
} from 'lucide-react';
import { InssRequirement } from '../types';

interface MeuInssViewProps {
  requirements: InssRequirement[];
  onResolveRequirement: (id: string) => void;
}

export const MeuInssView: React.FC<MeuInssViewProps> = ({
  requirements,
  onResolveRequirement,
}) => {
  const [activeTab, setActiveTab] = useState<'exigencias' | 'simulador' | 'cnis'>(
    'exigencias'
  );

  // Simulation state
  const [age, setAge] = useState<number>(62);
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [yearsContributed, setYearsContributed] = useState<number>(14);
  const [simResult, setSimResult] = useState<string | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const minYears = gender === 'F' ? 15 : 20;
    const minAge = gender === 'F' ? 62 : 65;

    if (age >= minAge && yearsContributed >= minYears) {
      setSimResult(
        `Direito Adquirido! O segurado preenche os requisitos da Aposentadoria por Idade Urbana (Mínimo de ${minAge} anos de idade e ${minYears} anos de carência).`
      );
    } else {
      const remainingYears = Math.max(0, minYears - yearsContributed);
      const remainingAge = Math.max(0, minAge - age);
      setSimResult(
        `Requisitos em andamento: Faltam ${remainingYears} anos de contribuição e ${remainingAge} anos de idade para atingir a Regra Geral de Aposentadoria por Idade.`
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#091426] text-white">
              <ShieldAlert className="w-5 h-5 text-[#D97706]" />
            </span>
            <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">
              Portal INSS Digital & Prazos
            </h1>
          </div>
          <p className="text-sm text-[#45474c] mt-1">
            Central de controle de cumprimentos de exigência, protocolos e análises de benefícios.
          </p>
        </div>

        <a
          href="https://meu.inss.gov.br"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#f2f4f6] hover:bg-[#eceef0] text-[#091426] font-semibold text-xs rounded-xl border border-[#E2E8F0] shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>Abrir Portal Oficial INSS</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#D97706]" />
        </a>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#E2E8F0] gap-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('exigencias')}
          className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'exigencias'
              ? 'border-[#D97706] text-[#D97706] font-semibold'
              : 'border-transparent text-[#75777d] hover:text-[#191c1e]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Exigências Pendentes ({requirements.filter((r) => r.status === 'Pendente').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'simulador'
              ? 'border-[#D97706] text-[#D97706] font-semibold'
              : 'border-transparent text-[#75777d] hover:text-[#191c1e]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Simulador Previdenciário</span>
        </button>

        <button
          onClick={() => setActiveTab('cnis')}
          className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'cnis'
              ? 'border-[#D97706] text-[#D97706] font-semibold'
              : 'border-transparent text-[#75777d] hover:text-[#191c1e]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Checklist CNIS</span>
        </button>
      </div>

      {/* Tab 1: Exigências */}
      {activeTab === 'exigencias' && (
        <div className="space-y-4 pb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-amber-900">
              <span className="font-bold">Atenção ao prazo regulamentar:</span> O prazo do INSS
              para cumprimento de exigência é de até 30 dias a partir da notificação, sob pena de
              indeferimento administrativo sumário.
            </div>
          </div>

          <div className="space-y-3">
            {requirements.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E2E8F0] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-80" />
                <p className="text-sm font-semibold text-[#191c1e]">
                  Nenhuma exigência do Meu INSS pendente
                </p>
                <p className="text-xs text-[#75777d]">
                  Todos os requerimentos administrativos estão em conformidade e sem pendências no momento.
                </p>
              </div>
            ) : (
              requirements.map((req) => {
              const isResolved = req.status === 'Respondida';

              return (
                <div
                  key={req.id}
                  id={`req-card-${req.id}`}
                  className={`bg-white rounded-2xl p-4 md:p-5 border transition-all space-y-3 ${
                    isResolved
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-[#E2E8F0] shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#091426] text-white">
                        Protocolo #{req.protocolNumber}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {isResolved ? 'Respondida com Sucesso' : `Prazo fatal: ${req.deadlineDays} dias`}
                      </span>
                    </div>

                    <span className="text-xs text-[#75777d]">
                      Vencimento: <strong className="text-[#191c1e]">{req.deadlineDate}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#191c1e]">{req.clientName}</h3>
                    <p className="text-xs font-medium text-[#D97706]">{req.serviceName}</p>
                  </div>

                  <div className="bg-[#f7f9fb] p-3 rounded-xl border border-[#E2E8F0] text-xs text-[#45474c] space-y-1">
                    <span className="font-semibold text-[#191c1e]">Despacho da Agência:</span>
                    <p>{req.requirementDetails}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-xs text-[#75777d]">
                      Status: <strong className="text-[#191c1e]">{req.status}</strong>
                    </span>

                    {!isResolved ? (
                      <button
                        onClick={() => onResolveRequirement(req.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D97706] hover:bg-[#b45309] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Cumprir Exigência / Protocolar</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" /> Protocolo Enviado
                      </span>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      )}

      {/* Tab 2: Simulador */}
      {activeTab === 'simulador' && (
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-2xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#191c1e]">
              Simulador Rápido de Aposentadoria por Idade
            </h2>
            <p className="text-xs text-[#45474c]">
              Parâmetros pós-Reforma da Previdência (EC 103/2019).
            </p>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                  Sexo do Segurado(a)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#191c1e]"
                >
                  <option value="F">Feminino (62 anos / 15 anos contrib.)</option>
                  <option value="M">Masculino (65 anos / 20 anos contrib.)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                  Idade Atual (Anos)
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#191c1e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#191c1e] mb-1">
                  Tempo de Contribuição (Anos)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={yearsContributed}
                  onChange={(e) => setYearsContributed(Number(e.target.value))}
                  className="w-full bg-[#f7f9fb] border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#191c1e]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#091426] hover:bg-[#1e293b] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Calcular Requisitos
            </button>
          </form>

          {simResult && (
            <div className="p-4 rounded-xl bg-[#f2f4f6] border border-[#E2E8F0] text-sm text-[#191c1e]">
              <span className="font-bold text-[#D97706] block mb-1">Resultado do Parecer:</span>
              <p>{simResult}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: CNIS Checklist */}
      {activeTab === 'cnis' && (
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-[#191c1e]">
            Principais Indicadores de Pendência no CNIS
          </h2>
          <p className="text-xs text-[#45474c]">
            Verifique as siglas mais comuns no extrato do INSS que exigem comprovação ou ratificação:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
              <span className="font-bold text-[#ba1a1a] block">PREM-EXT</span>
              <p className="text-[#45474c] mt-0.5">
                Remuneração informada após o prazo regulamentar. Requer apresentação de holerites ou livro de registro.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
              <span className="font-bold text-[#ba1a1a] block">PEXT</span>
              <p className="text-[#45474c] mt-0.5">
                Vínculo extemporâneo não validado automaticamente pelo INSS. Exige Carteira de Trabalho física.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
              <span className="font-bold text-[#904d00] block">PREC-MENOR-MIN</span>
              <p className="text-[#45474c] mt-0.5">
                Recolhimento abaixo do salário mínimo nacional. Não conta para carência sem complementação.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
              <span className="font-bold text-emerald-800 block">IREC-INDPEND</span>
              <p className="text-[#45474c] mt-0.5">
                Recolhimentos com pendências sanáveis mediante peticionamento de Acerto de Vínculos e Remunerações.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
