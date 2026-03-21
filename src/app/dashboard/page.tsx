"use client";

import { useState, useEffect } from "react";
import "../globals.css";

interface Conversation {
  thread_id: string;
  interactions: number;
  first_checkpoint: string;
  last_checkpoint: string;
}

interface Metrics {
  total_conversations: number;
  total_interactions: number;
  total_data_blobs: number;
  total_writes: number;
}

interface DashboardData {
  status: string;
  metrics: Metrics;
  conversations: Conversation[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND = "https://fraudshield-api-293460116750.us-west4.run.app";

  useEffect(() => {
    fetch(`${BACKEND}/dashboard`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="login-container">
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>📊</div>
        Cargando dashboard...
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
          <span className="header-logo">📊</span>
          <div className="header-title"><span>FraudShield</span> Dashboard</div>
          <span className="header-version">Perú 2026</span>
        </div>
        <div className="header-right">
          <a href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "13px" }}>← Volver al Chat</a>
          <a href="/traces" style={{ color: "var(--accent-red)", textDecoration: "none", fontSize: "13px" }}>Ver Traces →</a>
        </div>
      </header>

      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* METRICS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(230,57,70,0.15), rgba(230,57,70,0.05))", border: "1px solid rgba(230,57,70,0.2)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--accent-red)" }}>{data?.metrics.total_conversations}</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>Conversaciones Totales</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--accent-blue)" }}>{data?.metrics.total_interactions}</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>Interacciones Totales</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.15), rgba(45,212,191,0.05))", border: "1px solid rgba(45,212,191,0.2)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--accent-green)" }}>{data?.metrics.total_data_blobs}</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>Datos Almacenados</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(167,139,250,0.05))", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--accent-purple)" }}>{data?.metrics.total_writes}</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>Escrituras en BD</div>
          </div>
        </div>

        {/* CONVERSATIONS TABLE */}
        <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700 }}>🗂️ Conversaciones Registradas</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Cada thread_id representa una conversación única con un investigador</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "rgba(230,57,70,0.08)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "var(--accent-red)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Thread ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", color: "var(--accent-red)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Interacciones</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "var(--accent-red)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Primer Checkpoint</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", color: "var(--accent-red)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Último Checkpoint</th>
                </tr>
              </thead>
              <tbody>
                {data?.conversations.map((conv, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px", color: "var(--text-primary)" }}>{conv.thread_id}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <span style={{ background: "rgba(230,57,70,0.15)", color: "var(--accent-red)", padding: "2px 10px", borderRadius: "12px", fontWeight: 600 }}>{conv.interactions}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "11px" }}>{conv.first_checkpoint}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "11px" }}>{conv.last_checkpoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
