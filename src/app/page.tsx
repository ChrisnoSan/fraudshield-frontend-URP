"use client";

import { useState, useRef, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ============================================================
   LOGIN SCREEN
   ============================================================ */
function LoginScreen() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">🛡️</div>
        <div className="login-badge">🔒 Acceso restringido</div>
        <h1 className="login-title">FraudShield AI</h1>
        <p className="login-subtitle">
          Agente inteligente de detección de fraude en seguros para el mercado
          peruano. Ingresa con tu cuenta institucional para acceder al sistema.
        </p>
        <button className="login-btn" onClick={() => signIn("google")}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Ingresar con Google
        </button>
        <div className="login-footer">
          FraudShield AI — Proyecto Final Agente IA con LangChain | Perú 2026
          <br />
          APIs simuladas: RENIEC · SUNAT · SUNARP · APESEG · INEI/PNP
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TYPES
   ============================================================ */
interface Message {
  role: "user" | "agent";
  content: string;
}

/* ============================================================
   CHAT APP
   ============================================================ */
function ChatApp() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const agentId = session?.user?.email
    ? `fraud-${session.user.email.split("@")[0]}`
    : "default";

  const examples = [
    "Analiza: Siniestro #SIN-2026-04821, DNI 45678912, Placa ABC-123, Robo vehicular S/48,500, 12/02/2026 3:15am en Comas. Taller RUC 20601234567. Relato: Estacioné mi Hilux afuera del grifo a las 3am, ya no estaba.",
    "Analiza: Siniestro #SIN-2026-05100, DNI 11223344, Placa DEF-456, Choque S/8,200, 10/02/2026 8:30am en Jesús María. Relato: Me chocaron por detrás en hora punta, hay cámaras.",
    "Consulta el DNI 78901234 y la placa XYZ-789. ¿Hay inconsistencias?",
    "¿Qué protocolo debo seguir si un caso tiene score de 85 puntos?",
  ];

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/agent?msg=${encodeURIComponent(messageText)}&idagente=${encodeURIComponent(agentId)}`
      );
   const text = await res.text();
      console.log("RAW RESPONSE:", text);
      const data = JSON.parse(text);
      console.log("PARSED DATA:", data);
      const agentResponse =
        data.response || data.error || "Error: Sin respuesta del agente";
      console.log("AGENT RESPONSE:", agentResponse);
      setMessages((prev) => [...prev, { role: "agent", content: agentResponse }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "❌ Error de conexión con el backend. Verifica que el servicio en Cloud Run esté activo.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (status === "loading") {
    return (
      <div className="login-container">
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🛡️</div>
          Cargando FraudShield AI...
        </div>
      </div>
    );
  }

  if (!session) return <LoginScreen />;

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <span className="header-logo">🛡️</span>
          <div>
            <div className="header-title"><span>FraudShield</span> AI</div>
          </div>
          <span className="header-version">Perú 2026</span>
        </div>
        <div className="header-right">
          <a href="/dashboard" style={{ color: "var(--accent-blue)", textDecoration: "none", fontSize: "12px", marginRight: "8px" }}>📊 Dashboard</a>
          <a href="/traces" style={{ color: "var(--accent-purple)", textDecoration: "none", fontSize: "12px", marginRight: "8px" }}>🔍 Traces</a>
          <a href="/panel" style={{ color: "var(--accent-green)", textDecoration: "none", fontSize: "12px", marginRight: "8px" }}>🛡️ Panel</a>
          <span className="header-user">{session.user?.email}</span>
          <button className="header-signout" onClick={() => signOut()}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* TOOLS BAR */}
      <div className="tools-bar">
        <div className="tool-chip"><span className="dot dot-reniec"></span> RENIEC</div>
        <div className="tool-chip"><span className="dot dot-sunat"></span> SUNAT</div>
        <div className="tool-chip"><span className="dot dot-sunarp"></span> SUNARP</div>
        <div className="tool-chip"><span className="dot dot-apeseg"></span> APESEG</div>
        <div className="tool-chip"><span className="dot dot-inei"></span> INEI/PNP</div>
        <div className="tool-chip"><span className="dot dot-historial"></span> Historial</div>
        <div className="tool-chip"><span className="dot dot-rag"></span> Manual RAG</div>
      </div>

      {/* CHAT */}
      <div className="chat-area">
        {messages.length === 0 && !loading ? (
          <div className="chat-welcome">
            <div className="chat-welcome-icon">🔍</div>
            <h2>Bienvenido a <span>FraudShield AI</span></h2>
            <p>
              Agente inteligente de detección de fraude en seguros. Cruza
              información con RENIEC, SUNAT, SUNARP, APESEG e INEI para evaluar
              reclamos sospechosos y generar un Fraud Risk Score.
            </p>
            <div className="examples-grid">
              {examples.map((ex, i) => (
                <button key={i} className="example-btn" onClick={() => sendMessage(ex)}>
                  {ex.length > 120 ? ex.substring(0, 120) + "..." : ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "msg-user" : "msg-agent"}>
                {msg.role === "agent" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}
          </>
        )}

        {loading && (
          <div className="msg-loading">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
            <span className="loading-text">FraudShield AI analizando...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="input-area">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe el siniestro a analizar o haz una consulta..."
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            Analizar ▶
          </button>
        </div>
        <div className="input-footer">
          <strong style={{ color: "var(--accent-red)" }}>FraudShield AI</strong>{" "}
          · Proyecto Final Agente IA con LangChain · Perú 2026 · APIs simuladas:{" "}
          <a href="https://peruapis.com" target="_blank" rel="noreferrer">peruapis.com</a>{" · "}
          <a href="https://quertium.com" target="_blank" rel="noreferrer">quertium.com</a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT WITH SESSION PROVIDER
   ============================================================ */
export default function Home() {
  return (
    <SessionProvider>
      <ChatApp />
    </SessionProvider>
  );
}
