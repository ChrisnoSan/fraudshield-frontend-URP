"use client";

import { useState, useEffect } from "react";
import "../globals.css";

interface Metricas {
  total_casos: number;
  casos_criticos: number;
  casos_revision: number;
  casos_bajo: number;
  score_promedio: number;
  monto_en_riesgo: number;
}

interface Distrito {
  distrito: string;
  casos: number;
  score_promedio: number;
}

interface Caso {
  siniestro_id: string | null;
  fecha: string | null;
  dni: string | null;
  placa: string | null;
  distrito: string | null;
  monto: number | null;
  score: number | null;
  nivel: string | null;
  thread_id: string | null;
}

interface PanelData {
  metricas: Metricas;
  por_distrito: Distrito[];
  ultimos_casos: Caso[];
}

export default function PanelPage() {
  const [data, setData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND = "https://fraudshieldai-api-293460116750.us-west4.run.app";

  useEffect(() => {
    fetch(`${BACKEND}/panel`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const getNivelColor = (nivel: string | null) => {
    if (nivel === "CRITICO") return "#e63946";
    if (nivel === "REVISION") return "#f59e0b";
    if (nivel === "BAJO") return "#2dd4bf";
    return "#6b7280";
  };

  const getNivelBg = (nivel: string | null) => {
    if (nivel === "CRITICO") return "rgba(230,57,70,0.15)";
    if (nivel === "REVISION") return "rgba(245,158,11,0.15)";
    if (nivel === "BAJO") return "rgba(45,212,191,0.15)";
    return "rgba(107,114,128,0.15)";
  };

  const getNivelLabel = (nivel: string | null) => {
    if (nivel === "CRITICO") return "🔴 CRÍTICO";
    if (nivel === "REVISION") return "🟡 REVISIÓN";
    if (nivel === "BAJO") return "🟢 BAJO";
    return "⚪ -";
  };

  const formatMonto = (monto: number) => {
    if (monto >= 1000000) return `S/ ${(monto / 1000000).toFixed(1)}M`;
    if (monto >= 1000) return `S/ ${(monto / 1000).toFixed(1)}K`;
    return `S/ ${monto.toFixed(0)}`;
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };

  if (loading) return (
    <div className="login-container">
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🛡️</div>
        Cargando panel de control...
      </div>
    </div>
  );

  if (error) return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ color: "var(--accent-red)" }}>Error</h2>
        <p style={{ color: "var(--text-secondary)" }}>{error}</p>
      </div>
    </div>
  );

  const m = data?.metricas;
  const totalProcesado = (m?.total_casos || 0);
  const pctLimpios = totalProcesado > 0 ? (((m?.casos_bajo || 0) / totalProcesado) * 100).toFixed(1) : "0";

  return (
    <div className="app-container" style={{ overflow: "auto" }}>
      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🛡️</span>
          <div className="header-title"><span>FraudShield AI</span> — Panel de Control</div>
          <span className="header-version">Investigadores</span>
        </div>
        <div className="header-right">
          <a href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "13px" }}>← Chat</a>
          <a href="/dashboard" style={{ color: "var(--accent-blue)", textDecoration: "none", fontSize: "13px" }}>Sesiones</a>
          <a href="/traces" style={{ color: "var(--accent-purple)", textDecoration: "none", fontSize: "13px" }}>Traces</a>
        </div>
      </header>

      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* MÉTRICAS PRINCIPALES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "28px" }}>

          {/* Casos Críticos */}
          <div style={{ background: "linear-gradient(135deg, rgba(230,57,70,0.2), rgba(230,57,70,0.05))", border: "1px solid rgba(230,57,70,0.3)", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontSize: "38px", fontWeight: 800, color: "#e63946" }}>{m?.casos_criticos || 0}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Casos Críticos (Score 80+)</div>
          </div>

          {/* Casos Revisión */}
          <div style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontSize: "38px", fontWeight: 800, color: "#f59e0b" }}>{m?.casos_revision || 0}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Casos en Revisión (Score 50-79)</div>
          </div>

          {/* Casos Limpios */}
          <div style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.2), rgba(45,212,191,0.05))", border: "1px solid rgba(45,212,191,0.3)", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontSize: "38px", fontWeight: 800, color: "#2dd4bf" }}>{m?.casos_bajo || 0}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Casos Limpios (Score 0-49)</div>
            <div style={{ fontSize: "11px", color: "#2dd4bf", marginTop: "2px" }}>{pctLimpios}% del total procesado</div>
          </div>

          {/* Monto en Riesgo */}
          <div style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.05))", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontSize: "38px", fontWeight: 800, color: "#a78bfa" }}>{formatMonto(m?.monto_en_riesgo || 0)}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Fraude Potencial Detectado</div>
          </div>

          {/* Score Promedio */}
          <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "16px", padding: "22px" }}>
            <div style={{ fontSize: "38px", fontWeight: 800, color: "#3b82f6" }}>{m?.score_promedio || 0}</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Score Promedio</div>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: Distritos + Últimos Casos */}
        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "16px" }}>

          {/* Casos por Distrito */}
          <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700 }}>📍 Casos por Distrito</h3>
            </div>
            <div style={{ padding: "12px 20px" }}>
              {data?.por_distrito && data.por_distrito.length > 0 ? (
                data.por_distrito.map((d, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < data.por_distrito.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{d.distrito}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Score prom: {d.score_promedio}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px", fontWeight: 700, color: d.score_promedio >= 70 ? "#e63946" : d.score_promedio >= 40 ? "#f59e0b" : "#2dd4bf" }}>{d.casos}</span>
                      <div style={{ width: "60px", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(d.score_promedio, 100)}%`, height: "100%", background: d.score_promedio >= 70 ? "#e63946" : d.score_promedio >= 40 ? "#f59e0b" : "#2dd4bf", borderRadius: "3px" }}></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "13px" }}>Sin datos de distritos</div>
              )}
            </div>
          </div>

          {/* Últimos Casos Analizados */}
          <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700 }}>🕐 Últimos Casos Analizados</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                <thead>
                  <tr style={{ background: "rgba(230,57,70,0.06)" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--accent-red)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Siniestro</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--accent-red)", fontSize: "10px", textTransform: "uppercase" }}>Fecha</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", color: "var(--accent-red)", fontSize: "10px", textTransform: "uppercase" }}>Distrito</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", color: "var(--accent-red)", fontSize: "10px", textTransform: "uppercase" }}>Monto</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--accent-red)", fontSize: "10px", textTransform: "uppercase" }}>Score</th>
                    <th style={{ padding: "10px 12px", textAlign: "center", color: "var(--accent-red)", fontSize: "10px", textTransform: "uppercase" }}>Alerta</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.ultimos_casos && data.ultimos_casos.length > 0 ? (
                    data.ultimos_casos.map((caso, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "10px 12px", color: "var(--text-primary)", fontWeight: 600 }}>{caso.siniestro_id || "-"}</td>
                        <td style={{ padding: "10px 12px", color: "var(--text-muted)", fontSize: "11px" }}>{formatDate(caso.fecha)}</td>
                        <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{caso.distrito || "-"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: "var(--text-primary)" }}>{caso.monto ? `S/ ${caso.monto.toLocaleString()}` : "-"}</td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span style={{ fontWeight: 700, fontSize: "14px", color: (caso.score || 0) >= 70 ? "#e63946" : (caso.score || 0) >= 40 ? "#f59e0b" : "#2dd4bf" }}>{caso.score ?? "-"}</span>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span style={{ background: getNivelBg(caso.nivel), color: getNivelColor(caso.nivel), padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" }}>
                            {getNivelLabel(caso.nivel)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>Sin casos analizados aún</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
