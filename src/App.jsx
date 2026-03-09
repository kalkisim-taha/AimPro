import { useState, useEffect, useRef } from "react";

const PRIORITY_CONFIG = {
  "yüksek": { color: "#ff6b9d", label: "🔴 Yüksek", bg: "rgba(255,107,157,0.15)", glow: "rgba(255,107,157,0.3)" },
  "orta":   { color: "#ffd166", label: "🟡 Orta",   bg: "rgba(255,209,102,0.15)", glow: "rgba(255,209,102,0.3)" },
  "düşük":  { color: "#06d6a0", label: "🟢 Düşük",  bg: "rgba(6,214,160,0.15)",  glow: "rgba(6,214,160,0.3)"  },
};
const CATEGORY_ICONS = { "iş": "💼", "kişisel": "🌿", "okul": "📖", "diğer": "📌" };
const CATEGORIES = ["iş", "kişisel", "okul", "diğer"];
const PRIORITIES = ["yüksek", "orta", "düşük"];

const INITIAL_TASKS = [
  { id: 1, title: "Proje raporunu tamamla", category: "iş", priority: "yüksek", deadline: "10:00", done: false },
  { id: 2, title: "Öğle yemeği hazırla", category: "kişisel", priority: "düşük", deadline: "12:30", done: false },
  { id: 3, title: "Matematik ödevi", category: "okul", priority: "orta", deadline: "15:00", done: false },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #07070f;
    color: #e8e8ff;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  .aimpro-app {
    min-height: 100vh;
    background: #07070f;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(120,60,255,0.15) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0,200,255,0.1) 0%, transparent 60%);
  }

  .aimpro-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 2rem;
    background: rgba(10,10,20,0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: sticky; top: 0; z-index: 100;
  }

  .logo-wrap { display: flex; align-items: center; gap: 0.6rem; }
  .logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #a855f7, #3b82f6);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: white;
    box-shadow: 0 0 20px rgba(168,85,247,0.4);
  }
  .logo-text {
    font-family: 'Clash Display', 'Plus Jakarta Sans', sans-serif;
    font-weight: 700; font-size: 1.25rem;
    background: linear-gradient(90deg, #c084fc, #60a5fa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .logo-date { font-size: 0.75rem; color: rgba(255,255,255,0.3); font-family: monospace; text-transform: capitalize; margin-left: 0.5rem; }

  .tabs-wrap { display: flex; gap: 2px; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 3px; border: 1px solid rgba(255,255,255,0.06); }
  .tab-btn { padding: 0.45rem 1.1rem; border: none; background: transparent; color: rgba(255,255,255,0.4); border-radius: 9px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.4rem; transition: all 0.2s; font-family: inherit; font-weight: 500; }
  .tab-btn.active { background: rgba(255,255,255,0.1); color: #fff; box-shadow: 0 1px 8px rgba(0,0,0,0.3); }
  .ai-pulse { width: 7px; height: 7px; background: #06d6a0; border-radius: 50%; animation: pulse-dot 2s infinite; }

  .add-btn {
    background: linear-gradient(135deg, #a855f7, #3b82f6);
    color: white; border: none; padding: 0.55rem 1.2rem;
    border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.85rem;
    display: flex; align-items: center; gap: 0.35rem; font-family: inherit;
    transition: all 0.2s; box-shadow: 0 4px 20px rgba(168,85,247,0.3);
  }
  .add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(168,85,247,0.5); }

  .main-wrap { max-width: 840px; margin: 0 auto; padding: 2rem; }

  /* PROGRESS CARD */
  .progress-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px; padding: 1.4rem 1.8rem;
    margin-bottom: 1.8rem;
    display: flex; align-items: center; gap: 2rem;
    animation: fadeSlideIn 0.4s ease;
  }
  .prog-numbers { display: flex; align-items: baseline; gap: 0.4rem; }
  .prog-big { font-family: 'Clash Display', sans-serif; font-size: 2.6rem; font-weight: 700; background: linear-gradient(135deg, #c084fc, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .prog-label { color: rgba(255,255,255,0.35); font-size: 0.85rem; }
  .prog-bar-wrap { flex: 1; display: flex; align-items: center; gap: 0.8rem; }
  .prog-bar-bg { flex: 1; height: 8px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
  .prog-bar-fill { height: 100%; background: linear-gradient(90deg, #a855f7, #3b82f6, #06d6a0); border-radius: 99px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
  .prog-pct { font-family: monospace; font-size: 0.82rem; color: rgba(255,255,255,0.3); }

  /* SECTION */
  .section-wrap { margin-bottom: 1.5rem; animation: fadeSlideIn 0.4s ease; }
  .section-head { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.25); margin-bottom: 0.6rem; font-family: monospace; }

  /* TASK CARD */
  .task-card {
    display: flex; align-items: center; gap: 0.8rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 0.85rem 1rem;
    margin-bottom: 0.45rem;
    transition: all 0.25s; cursor: default;
    animation: fadeSlideIn 0.35s ease;
  }
  .task-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.14); transform: translateX(3px); }
  .task-card.done-card { opacity: 0.45; }

  .priority-bar { width: 3px; height: 34px; border-radius: 2px; flex-shrink: 0; }

  .check-btn {
    width: 28px; height: 28px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.15);
    background: transparent; cursor: pointer; color: white; font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    font-weight: 700; transition: all 0.2s;
  }
  .check-btn.checked { background: linear-gradient(135deg, #a855f7, #3b82f6); border-color: transparent; box-shadow: 0 0 14px rgba(168,85,247,0.5); }

  .task-body { flex: 1; display: flex; flex-direction: column; gap: 0.28rem; }
  .task-title { font-weight: 500; font-size: 0.93rem; color: #e8e8ff; transition: all 0.2s; }
  .task-title.crossed { text-decoration: line-through; color: rgba(255,255,255,0.3); }
  .task-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
  .meta-cat { font-size: 0.71rem; color: rgba(255,255,255,0.35); }
  .meta-time { font-size: 0.71rem; color: rgba(255,255,255,0.35); font-family: monospace; }
  .meta-tag { font-size: 0.68rem; padding: 2px 8px; border-radius: 5px; font-weight: 600; }

  .del-btn { background: transparent; border: none; color: rgba(255,255,255,0.18); cursor: pointer; font-size: 0.75rem; padding: 0.3rem; border-radius: 6px; transition: all 0.2s; }
  .del-btn:hover { color: #ff6b9d; background: rgba(255,107,157,0.1); }

  .empty-state { text-align: center; color: rgba(255,255,255,0.25); padding: 3rem; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px dashed rgba(255,255,255,0.08); font-size: 0.9rem; }

  /* MODAL */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 200; animation: fadeIn 0.2s; }
  .modal-box { background: #0f0f1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; width: min(430px, 92vw); animation: slideUp 0.25s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
  .modal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .modal-title { font-family: 'Clash Display', sans-serif; font-size: 1.3rem; background: linear-gradient(90deg, #c084fc, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .modal-close { background: rgba(255,255,255,0.08); border: none; color: rgba(255,255,255,0.5); cursor: pointer; font-size: 0.9rem; padding: 0.4rem 0.55rem; border-radius: 8px; transition: all 0.15s; }
  .modal-close:hover { background: rgba(255,107,157,0.2); color: #ff6b9d; }

  .field-wrap { margin-bottom: 1.2rem; }
  .field-label { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 0.45rem; font-family: monospace; }
  .field-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e8e8ff; padding: 0.7rem 1rem; border-radius: 11px; font-size: 0.92rem; outline: none; font-family: inherit; transition: border-color 0.2s; }
  .field-input:focus { border-color: rgba(168,85,247,0.6); box-shadow: 0 0 0 3px rgba(168,85,247,0.1); }

  .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .chip { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); padding: 0.35rem 0.9rem; border-radius: 20px; cursor: pointer; font-size: 0.82rem; font-family: inherit; transition: all 0.18s; }
  .chip.chip-on { background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; border-color: transparent; }
  .chip-high.chip-on { background: linear-gradient(135deg, #ff6b9d, #ff4d4d); }
  .chip-orta.chip-on { background: linear-gradient(135deg, #ffd166, #ff9f1c); color: #1a1a1a; }
  .chip-dusuk.chip-on { background: linear-gradient(135deg, #06d6a0, #00b4d8); color: #0a0a0a; border-color: transparent; }

  .submit-btn { width: 100%; background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; border: none; padding: 0.9rem; border-radius: 12px; cursor: pointer; font-weight: 700; font-size: 0.95rem; font-family: inherit; transition: all 0.2s; margin-top: 0.5rem; box-shadow: 0 4px 20px rgba(168,85,247,0.3); }
  .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(168,85,247,0.5); }
  .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* AI PANEL */
  .ai-panel { display: flex; flex-direction: column; height: calc(100vh - 130px); }
  .ai-head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
  .ai-avatar { width: 50px; height: 50px; background: linear-gradient(135deg, #a855f7, #3b82f6); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; box-shadow: 0 0 24px rgba(168,85,247,0.4); }
  .ai-title { font-family: 'Clash Display', sans-serif; font-size: 1.2rem; background: linear-gradient(90deg, #c084fc, #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .ai-sub { color: rgba(255,255,255,0.3); font-size: 0.8rem; margin-top: 2px; }
  .analyze-btn { margin-left: auto; background: linear-gradient(135deg, #06d6a0, #00b4d8); color: #0a0a0a; border: none; padding: 0.55rem 1rem; border-radius: 10px; cursor: pointer; font-size: 0.85rem; font-weight: 700; font-family: inherit; white-space: nowrap; transition: all 0.2s; box-shadow: 0 4px 16px rgba(6,214,160,0.3); }
  .analyze-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(6,214,160,0.5); }

  .snapshot { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 0.8rem 1rem; margin-bottom: 0.8rem; max-height: 120px; overflow-y: auto; }
  .snap-row { display: flex; align-items: center; gap: 0.5rem; padding: 2px 0; font-size: 0.8rem; }
  .snap-icon { font-family: monospace; font-size: 0.72rem; width: 14px; }
  .snap-name { flex: 1; }
  .snap-done-text { text-decoration: line-through; color: rgba(255,255,255,0.25); }
  .snap-time { font-family: monospace; color: rgba(255,255,255,0.25); font-size: 0.7rem; }

  .quick-row { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.8rem; }
  .quick-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); color: rgba(255,255,255,0.45); padding: 0.33rem 0.75rem; border-radius: 20px; cursor: pointer; font-size: 0.77rem; font-family: inherit; transition: all 0.18s; }
  .quick-btn:hover { border-color: rgba(168,85,247,0.5); color: #c084fc; background: rgba(168,85,247,0.08); }

  .chat-box { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.85rem; padding: 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; margin-bottom: 0.8rem; }
  .bubble { display: flex; gap: 0.6rem; align-items: flex-start; animation: fadeSlideIn 0.3s ease; }
  .bubble-user { flex-direction: row-reverse; }
  .bubble-icon { font-size: 1rem; flex-shrink: 0; margin-top: 3px; }
  .bubble-text { padding: 0.7rem 1rem; border-radius: 13px; font-size: 0.87rem; line-height: 1.6; max-width: 78%; white-space: pre-wrap; }
  .bubble-ai .bubble-text { background: rgba(255,255,255,0.07); color: #e8e8ff; border-bottom-left-radius: 4px; }
  .bubble-user .bubble-text { background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; border-bottom-right-radius: 4px; }

  .typing-dots { display: flex; gap: 5px; align-items: center; padding: 0.7rem 1rem; background: rgba(255,255,255,0.07); border-radius: 13px; }
  .dot { width: 6px; height: 6px; background: rgba(255,255,255,0.4); border-radius: 50%; animation: bounce 1.2s infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  .input-row { display: flex; gap: 0.6rem; }
  .chat-input { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e8e8ff; padding: 0.8rem 1rem; border-radius: 12px; font-size: 0.9rem; outline: none; font-family: inherit; transition: all 0.2s; }
  .chat-input:focus { border-color: rgba(168,85,247,0.6); box-shadow: 0 0 0 3px rgba(168,85,247,0.1); }
  .chat-input::placeholder { color: rgba(255,255,255,0.2); }
  .send-btn { background: linear-gradient(135deg, #a855f7, #3b82f6); color: white; border: none; padding: 0.8rem 1.2rem; border-radius: 12px; cursor: pointer; font-size: 1rem; transition: all 0.2s; box-shadow: 0 4px 16px rgba(168,85,247,0.3); }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .send-btn:hover:not(:disabled) { transform: scale(1.05); }

  /* ANIMATIONS */
  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bounce { 0%,80%,100%{ transform: translateY(0); } 40%{ transform: translateY(-6px); } }
  @keyframes pulse-dot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.5; transform:scale(0.7); } }
`;

// ── TASK CARD ─────────────────────────────────────────────
function TaskCard({ task, onToggle, onDelete }) {
  const cfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG["orta"];
  const icon = CATEGORY_ICONS[task.category] || "📌";
  return (
    <div className={`task-card ${task.done ? "done-card" : ""}`}>
      <div className="priority-bar" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.glow}` }} />
      <button className={`check-btn ${task.done ? "checked" : ""}`} onClick={() => onToggle(task.id)}>
        {task.done ? "✓" : ""}
      </button>
      <div className="task-body">
        <span className={`task-title ${task.done ? "crossed" : ""}`}>{task.title}</span>
        <div className="task-meta">
          <span className="meta-cat">{icon} {task.category}</span>
          {task.deadline && <span className="meta-time">🕐 {task.deadline}</span>}
          <span className="meta-tag" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
        </div>
      </div>
      <button className="del-btn" onClick={() => onDelete(task.id)}>✕</button>
    </div>
  );
}

// ── PLAN BOARD ────────────────────────────────────────────
function PlanBoard({ tasks, onToggle, onDelete }) {
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return ({ "yüksek": 0, "orta": 1, "düşük": 2 }[a.priority] || 1) - ({ "yüksek": 0, "orta": 1, "düşük": 2 }[b.priority] || 1);
  });

  const groups = [
    { label: "🔴 Yüksek Öncelik", items: sorted.filter(t => !t.done && t.priority === "yüksek") },
    { label: "🟡 Orta Öncelik",   items: sorted.filter(t => !t.done && t.priority === "orta") },
    { label: "🟢 Düşük Öncelik",  items: sorted.filter(t => !t.done && t.priority === "düşük") },
    { label: "✓ Tamamlananlar",   items: sorted.filter(t => t.done) },
  ];

  return (
    <div>
      <div className="progress-card">
        <div className="prog-numbers">
          <span className="prog-big">{done}/{total}</span>
          <span className="prog-label">tamamlandı</span>
        </div>
        <div className="prog-bar-wrap">
          <div className="prog-bar-bg">
            <div className="prog-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="prog-pct">{pct}%</span>
        </div>
      </div>

      {total === 0 && <div className="empty-state">✦ Henüz görev yok — günlük planını oluşturmaya başla!</div>}

      {groups.map(({ label, items }) => items.length > 0 && (
        <div key={label} className="section-wrap">
          <div className="section-head">{label}</div>
          {items.map(t => <TaskCard key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />)}
        </div>
      ))}
    </div>
  );
}

// ── TASK FORM ─────────────────────────────────────────────
function TaskForm({ onSubmit, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("iş");
  const [priority, setPriority] = useState("orta");
  const [deadline, setDeadline] = useState("");

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-top">
          <span className="modal-title">Yeni Görev</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="field-wrap">
          <label className="field-label">Görev</label>
          <input className="field-input" placeholder="Ne yapacaksın?" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        </div>

        <div className="field-wrap">
          <label className="field-label">Kategori</label>
          <div className="chips">
            {CATEGORIES.map(c => (
              <button key={c} className={`chip ${category === c ? "chip-on" : ""}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="field-wrap">
          <label className="field-label">Öncelik</label>
          <div className="chips">
            {PRIORITIES.map(p => (
              <button key={p} className={`chip chip-${p === "yüksek" ? "high" : p === "orta" ? "orta" : "dusuk"} ${priority === p ? "chip-on" : ""}`} onClick={() => setPriority(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div className="field-wrap">
          <label className="field-label">Deadline</label>
          <input type="time" className="field-input" style={{ width: "auto" }} value={deadline} onChange={e => setDeadline(e.target.value)} />
        </div>

        <button className="submit-btn" disabled={!title.trim()} onClick={() => { if (title.trim()) onSubmit({ title: title.trim(), category, priority, deadline }); }}>
          Görevi Ekle ✦
        </button>
      </div>
    </div>
  );
}

// ── AI PANEL ─────────────────────────────────────────────
function AIPanel({ tasks }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Merhaba! Ben AimPro AI asistanın. Günlük planını analiz edebilir, öncelik önerileri sunabilir ve hedeflerine ulaşman için rehberlik yapabilirim. 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const taskSummary = tasks.map(t =>
    `- [${t.done ? "✓" : " "}] ${t.title} | Öncelik: ${t.priority} | Kategori: ${t.category}${t.deadline ? ` | Deadline: ${t.deadline}` : ""}`
  ).join("\n");

  const systemPrompt = `Sen AimPro adlı bir verimlilik ve zaman yönetimi AI asistanısın. Türkçe konuş. Kısa, net, motive edici ve pratik tavsiyeler ver. Emoji kullan.

Kullanıcının bugünkü planı:
${taskSummary || "Henüz görev eklenmemiş."}
Tamamlanan: ${tasks.filter(t => t.done).length}/${tasks.length} görev`;

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.map(c => c.text || "").join("") || "Hata oluştu.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Bağlantı hatası. Lütfen tekrar dene." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = ["Hangi göreve önce başlamalıyım?", "Bugünkü planım gerçekçi mi?", "Beni motive et!", "Zaman yönetimi tavsiyesi ver"];

  return (
    <div className="ai-panel">
      <div className="ai-head">
        <div className="ai-avatar">🤖</div>
        <div style={{ flex: 1 }}>
          <div className="ai-title">AimPro AI Asistan</div>
          <div className="ai-sub">Planını analiz eder, önceliklendirir ve motive eder</div>
        </div>
        {!analyzed && tasks.length > 0 && (
          <button className="analyze-btn" onClick={() => { setAnalyzed(true); sendMessage("Bugünkü planımı analiz et. Öncelikleri değerlendir, zaman yönetimi önerilerini ve motivasyon notunu paylaş."); }}>
            ⚡ Planı Analiz Et
          </button>
        )}
      </div>

      <div className="snapshot">
        {tasks.length === 0
          ? <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.82rem", textAlign: "center" }}>Henüz görev yok — Plan sekmesinden görev ekle.</p>
          : tasks.map(t => {
              const cfg = PRIORITY_CONFIG[t.priority];
              return (
                <div key={t.id} className="snap-row">
                  <span className="snap-icon" style={{ color: t.done ? "#06d6a0" : cfg?.color }}>{t.done ? "✓" : "○"}</span>
                  <span className={`snap-name ${t.done ? "snap-done-text" : ""}`}>{t.title}</span>
                  <span className="snap-time">{t.deadline}</span>
                </div>
              );
            })
        }
      </div>

      <div className="quick-row">
        {quickPrompts.map((p, i) => (
          <button key={i} className="quick-btn" onClick={() => sendMessage(p)}>{p}</button>
        ))}
      </div>

      <div className="chat-box" ref={chatRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}>
            <span className="bubble-icon">{m.role === "assistant" ? "🤖" : "👤"}</span>
            <div className="bubble-text">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="bubble bubble-ai">
            <span className="bubble-icon">🤖</span>
            <div className="typing-dots">
              <div className="dot" /><div className="dot" /><div className="dot" />
            </div>
          </div>
        )}
      </div>

      <div className="input-row">
        <input className="chat-input" placeholder="Planın hakkında bir şey sor..." value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>➤</button>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────
export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("plan");

  const addTask = (task) => { setTasks(prev => [...prev, { ...task, id: Date.now(), done: false }]); setShowForm(false); };
  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const today = new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="aimpro-app">
      <style>{STYLES}</style>

      <header className="aimpro-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="logo-wrap">
            <div className="logo-icon">✦</div>
            <span className="logo-text">AimPro</span>
          </div>
          <span className="logo-date">{today}</span>
        </div>

        <div className="tabs-wrap">
          {[["plan", "Günlük Plan"], ["ai", "AI Analiz"]].map(([id, label]) => (
            <button key={id} className={`tab-btn ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
              {id === "ai" && <span className="ai-pulse" />}
              {label}
            </button>
          ))}
        </div>

        <button className="add-btn" onClick={() => setShowForm(true)}>✦ Görev Ekle</button>
      </header>

      <div className="main-wrap">
        {activeTab === "plan" && <PlanBoard tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />}
        {activeTab === "ai"   && <AIPanel tasks={tasks} />}
      </div>

      {showForm && <TaskForm onSubmit={addTask} onClose={() => setShowForm(false)} />}
    </div>
  );
}
