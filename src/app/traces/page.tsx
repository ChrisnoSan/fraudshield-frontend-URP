"use client";

import { useState, useEffect } from "react";
import "../globals.css";

interface Trace {
  id: string;
  name: string;
  status: string;
  start_time: string;
  duration_seconds: number | null;
  total_tokens: number | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  user_message: string;
  agent_response: string;
  error: string | null;
}

interface Step {
  id: string;
  name: string;
  run_type: string;
  status: string;
  start_time: string;
  duration_seconds: number | null;
  tokens: number | null;
  input: string;
  output: string;
  error: string | null;
  parent_run_id: string | null;
}

export default function TracesPage() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND = "https://fraudshield-api-293460116750.us-west4.run.app";

  useEffect(() => {
    fetch(`${BACKEND}/traces?limit=20`)
      .then((r) => r.json())
      .then((d) => { setTraces(d.traces || []); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const loadSteps = (traceId: string) => {
    if (selectedTrace === traceId) {
      setSelectedTrace(null);
      setSteps([]);
      return;
    }
    setSelectedTrace(traceId);
    setStepsLoading(true);
    fetch(`${BACKEND}/trace/${traceId}`)
      .then((r) => r.json())
      .then((d) => { setSteps(d.steps || []); setStepsLoading(false); })
      .catch(() => { setSteps([]); setStepsLoading(false); });
  };

  const getStatusColor = (status: string) => {
    if (status === "success") return "var(--accent-green)";
    if (status === "error") return "var(--accent-red)";
    return "var(--accent-yellow)";
  };

  const getRunTypeEmoji = (runType: string, name: string) => {
    if (runType === "tool") return "🔧";
    if (runType === "llm") return "🧠";
    if (runType === "chain") return "⛓️";
    if (name?.includes("agent")) return "🤖";
    return "📋";
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("es-PE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch { return iso; }
  };

  if (loading) return (
    <div className="login-container">
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
        Cargando traces de LangSmith...
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

  return (
    <div className="app-container" style={{ overflow: "auto" }}>
      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🔍</span>
          <div className="header-title"><span>FraudShield</span> Traces</div>
          <span className="header-version">LangSmith</span>
        </div>
        <div className="header-right">
          <a href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "13px" }}>← Chat</a>
          <a href="/dashboard" style={{ color: "var(--accent-red)", textDecoration: "none", fontSize: "13px" }}>Dashboard</a>
        </div>
      </header>

      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Razonamiento del Agente</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Cada trace muestra una ejecución completa del agente. Haz clic para ver los pasos internos: qué herramientas usó, qué datos recibió y cómo razonó.
          </p>
        </div>

        {traces.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
            No hay traces disponibles. Ejecuta una consulta en el chat primero.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {traces.map((trace) => (
              <div key={trace.id}>
                {/* TRACE CARD */}
                <div
                  onClick={() => loadSteps(trace.id)}
                  style={{
                    background: selectedTrace === trace.id ? "rgba(230,57,70,0.08)" : "var(--bg-card)",
                    border: `1px solid ${selectedTrace === trace.id ? "rgba(230,57,70,0.3)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: selectedTrace === trace.id ? "16px 16px 0 0" : "16px",
                    padding: "16px 20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: getStatusColor(trace.status) }}></span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                          {trace.user_message || trace.name || "Sin mensaje"}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <span>🕐 {formatTime(trace.start_time)}</span>
                        {trace.duration_seconds && <span>⏱️ {trace.duration_seconds}s</span>}
                        {trace.total_tokens && <span>🪙 {trace.total_tokens.toLocaleString()} tokens</span>}
                        <span style={{ color: getStatusColor(trace.status) }}>● {trace.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: "18px", color: "var(--text-muted)", transform: selectedTrace === trace.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</div>
                  </div>
                </div>

                {/* STEPS DETAIL */}
                {selectedTrace === trace.id && (
                  <div style={{
                    background: "rgba(15,18,25,0.8)",
                    border: "1px solid rgba(230,57,70,0.2)",
                    borderTop: "none",
                    borderRadius: "0 0 16px 16px",
                    padding: "20px",
                  }}>
                    {stepsLoading ? (
                      <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>Cargando pasos...</div>
                    ) : steps.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No se encontraron pasos detallados</div>
                    ) : (
                      <div style={{ position: "relative", paddingLeft: "24px" }}>
                        {/* Timeline line */}
                        <div style={{ position: "absolute", left: "7px", top: "8px", bottom: "8px", width: "2px", background: "rgba(230,57,70,0.2)" }}></div>

                        {steps.filter(s => s.name !== "LangGraph").map((step, i) => (
                          <div key={step.id} style={{ position: "relative", marginBottom: "16px" }}>
                            {/* Timeline dot */}
                            <div style={{
                              position: "absolute", left: "-20px", top: "6px",
                              width: "12px", height: "12px", borderRadius: "50%",
                              background: step.status === "success" ? "var(--accent-green)" : step.status === "error" ? "var(--accent-red)" : "var(--accent-yellow)",
                              border: "2px solid var(--bg-primary)"
                            }}></div>

                            <div style={{
                              background: "rgba(26,31,46,0.6)",
                              border: "1px solid rgba(255,255,255,0.04)",
                              borderRadius: "10px",
                              padding: "12px 16px",
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <span>{getRunTypeEmoji(step.run_type, step.name)}</span>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{step.name}</span>
                                <span style={{ fontSize: "10px", color: "var(--text-muted)", background: "rgba(255,255,255,0.06)", padding: "1px 6px", borderRadius: "4px" }}>{step.run_type}</span>
                                {step.duration_seconds && (
                                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{step.duration_seconds}s</span>
                                )}
                                {step.tokens && (
                                  <span style={{ fontSize: "10px", color: "var(--accent-yellow)" }}>{step.tokens} tok</span>
                                )}
                              </div>

                              {step.input && (
                                <div style={{ marginBottom: "4px" }}>
                                  <span style={{ fontSize: "10px", color: "var(--accent-blue)", fontWeight: 600 }}>INPUT: </span>
                                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                                    {step.input.length > 200 ? step.input.substring(0, 200) + "..." : step.input}
                                  </span>
                                </div>
                              )}

                              {step.output && (
                                <div>
                                  <span style={{ fontSize: "10px", color: "var(--accent-green)", fontWeight: 600 }}>OUTPUT: </span>
                                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                                    {step.output.length > 300 ? step.output.substring(0, 300) + "..." : step.output}
                                  </span>
                                </div>
                              )}

                              {step.error && (
                                <div style={{ marginTop: "4px", fontSize: "11px", color: "var(--accent-red)" }}>
                                  ❌ {step.error}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
