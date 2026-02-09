import { useMemo, useState } from "react";

const CATEGORIES = ["Web App", "Mobile App", "AI / ML", "IoT", "Game", "DevTools", "EdTech", "HealthTech"];

const MOCK_PROJECTS = [
  { id: "p1", title: "MomSure", category: "Mobile App", university: "NPRU", goal: 120000, raised: 84500, daysLeft: 12, milestone: "Phase 2: MVP Demo", tags: ["Escrow", "Milestone", "Postpartum"] },
  { id: "p2", title: "CondoSwift", category: "Web App", university: "NPRU", goal: 250000, raised: 195000, daysLeft: 6, milestone: "Phase 3: Map + Agent", tags: ["Real Estate", "Search", "Map"] },
  { id: "p3", title: "Flyup (Prototype)", category: "DevTools", university: "Thailand (Nationwide)", goal: 180000, raised: 62000, daysLeft: 20, milestone: "Phase 1: Core Flow", tags: ["Escrow", "Ledger", "Profit Pool"] },
  { id: "p4", title: "Campus AI Tutor", category: "AI / ML", university: "KMUTT", goal: 300000, raised: 228000, daysLeft: 9, milestone: "Phase 2: RAG + Quiz", tags: ["RAG", "Quiz", "Analytics"] },
];

const thb = (n) => new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(n);
const pct = (raised, goal) => (goal ? Math.max(0, Math.min(100, Math.round((raised / goal) * 100))) : 0);

function Badge({ children, tone = "neutral" }) {
  const map = {
    neutral: "bg-white/5 text-white/70 border-white/10",
    primary: "bg-violet-500/15 text-white/85 border-violet-500/30",
    success: "bg-emerald-500/15 text-white/85 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${map[tone]}`}>
      {children}
    </span>
  );
}

function Modal({ open, title, onClose, children, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold text-white/90">{title}</h3>
          <button onClick={onClose} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-white/80 hover:bg-white/10">
            ✕
          </button>
        </div>
        <div className="px-5 py-4 text-white/70">{children}</div>
        <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-4">
          {actions}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p, onView }) {
  const progress = pct(p.raised, p.goal);
  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-white/90">{p.title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <span>{p.category}</span><span className="opacity-40">•</span><span>{p.university}</span>
            </div>
          </div>
          <Badge tone={progress >= 80 ? "success" : "primary"}>{progress}%</Badge>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-3">
          <div className="text-xs text-white/50">Milestone ล่าสุด</div>
          <div className="mt-1 text-sm font-medium text-white/85">{p.milestone}</div>
        </div>

        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-white/60">
            <span><span className="font-semibold text-white/85">{thb(p.raised)}</span> / {thb(p.goal)}</span>
            <span>{p.daysLeft} วัน</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags.slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <button
          onClick={() => onView(p)}
          className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10"
        >
          ดูรายละเอียด
        </button>
        <button
          onClick={() => onView(p)}
          className="h-10 rounded-xl bg-gradient-to-r from-violet-500/90 to-emerald-400/70 px-4 text-sm font-semibold text-white hover:opacity-95"
        >
          สนับสนุนโปรเจกต์
        </button>
      </div>
    </article>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PROJECTS.filter((p) => {
      const okCat = category === "ทั้งหมด" ? true : p.category === category;
      const okQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.university.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return okCat && okQ;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[10%] top-[-10%] h-[500px] w-[700px] rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute right-[5%] top-[-5%] h-[420px] w-[620px] rounded-full bg-emerald-400/15 blur-3xl" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <div className="flex items-baseline gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-500/90 to-emerald-400/60 px-3 py-1 font-extrabold shadow-xl">
              Flyup
            </div>
            <span className="hidden text-xs text-white/60 sm:block">Crowdfunding for Student Software</span>
          </div>

          <nav className="hidden items-center gap-5 text-sm text-white/65 md:flex">
            <a className="hover:text-white" href="#projects">โปรเจกต์</a>
            <a className="hover:text-white" href="#how">วิธีทำงาน</a>
            <a className="hover:text-white" href="#roles">บทบาท</a>
            <a className="hover:text-white" href="#faq">FAQ</a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button className="hidden h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10 sm:block">
              เข้าสู่ระบบ
            </button>
            <button className="h-10 rounded-xl bg-gradient-to-r from-violet-500/90 to-emerald-400/70 px-4 text-sm font-semibold hover:opacity-95">
              สมัครใช้งาน
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div>
            <Badge tone="primary">Escrow + Ledger + Milestone</Badge>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              ระดมทุนโปรเจกต์ซอฟต์แวร์นักศึกษา{" "}
              <span className="bg-gradient-to-r from-violet-400 to-emerald-300 bg-clip-text text-transparent">
                โปร่งใส
              </span>{" "}
              และ{" "}
              <span className="bg-gradient-to-r from-violet-400 to-emerald-300 bg-clip-text text-transparent">
                ตรวจสอบได้
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
              Flyup คือแพลตฟอร์มกลางที่ให้ Booster สนับสนุนเงิน และปล่อยเงินให้ Pioneer แบบเป็นขั้นตาม Milestone
              ผ่านแนวคิด Escrow พร้อม Ledger/Audit log เพื่อความน่าเชื่อถือ
            </p>

            <div className="mt-6 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-[1fr_180px_auto]">
              <input
                className="h-11 rounded-xl border border-white/10 bg-slate-950/50 px-3 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาโปรเจกต์ / มหาวิทยาลัย / tag เช่น Escrow, AI..."
              />
              <select
                className="h-11 rounded-xl border border-white/10 bg-slate-950/50 px-3 text-sm text-white/85 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="ทั้งหมด">ทั้งหมด</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <a
                href="#projects"
                className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500/90 to-emerald-400/70 px-5 text-sm font-semibold hover:opacity-95"
              >
                ค้นหา
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="text-lg font-extrabold">99.9%</div>
                <div className="text-xs text-white/55">Uptime (เป้าหมาย)</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="text-lg font-extrabold">Escrow</div>
                <div className="text-xs text-white/55">พักเงินก่อนปล่อย</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="text-lg font-extrabold">Vote</div>
                <div className="text-xs text-white/55">อนุมัติ Milestone</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="h-11 rounded-xl bg-gradient-to-r from-violet-500/90 to-emerald-400/70 px-5 text-sm font-semibold hover:opacity-95">
                เริ่มสนับสนุน
              </button>
              <button className="h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm text-white/80 hover:bg-white/10">
                สร้างโปรเจกต์ (Pioneer)
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <div className="text-sm font-extrabold text-white/90">การปล่อยเงินแบบ Milestone</div>
            <div className="mt-4 space-y-3">
              {[
                { t: "Booster สนับสนุน (เงินต้นเข้า Escrow)", d: "เงินถูกพักไว้ ยังไม่ปล่อยทันที" },
                { t: "Pioneer ส่งหลักฐาน Milestone", d: "อัปโหลดเดโม/รายงาน/ลิงก์" },
                { t: "Booster โหวต + ระบบตรวจสอบ", d: "เกินครึ่ง → ปล่อยเงิน" },
                { t: "Ledger/Audit Log บันทึกทุกธุรกรรม", d: "ตรวจสอบย้อนหลังได้" },
              ].map((s) => (
                <div key={s.t} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-violet-500 to-emerald-400" />
                  <div>
                    <div className="text-sm font-semibold text-white/85">{s.t}</div>
                    <div className="mt-1 text-xs text-white/55">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>Verification นักศึกษา</Badge>
              <Badge>Admin Compliance</Badge>
              <Badge>Profit Pool</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">โปรเจกต์แนะนำ</h2>
            <p className="mt-1 text-sm text-white/60">ค้นหาและสนับสนุนโปรเจกต์ที่กำลังระดมทุนอยู่</p>
          </div>
          <div className="text-sm text-white/50">
            ผลลัพธ์: <span className="text-white/80 font-semibold">{filtered.length}</span> รายการ
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {filtered.map((p) => (
            <ProjectCard key={p.id} p={p} onView={setSelected} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/60">
            ไม่พบโปรเจกต์ที่ตรงกับคำค้น <span className="font-semibold text-white/85">{query}</span>
          </div>
        )}
      </section>

      {/* HOW */}
      <section id="how" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">ระบบทำงานยังไง</h2>
              <p className="mt-1 text-sm text-white/60">Escrow + Milestone + Vote + Ledger เพื่อความโปร่งใส</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🧾", title: "Escrow (พักเงินไว้ก่อน)", desc: "เงินสนับสนุนของ Booster จะถูกพักไว้จนผ่านเงื่อนไข Milestone เพื่อลดความเสี่ยงโปรเจกต์ไม่ทำต่อ" },
              { icon: "🏁", title: "Milestone (แบ่งงานเป็น Phase)", desc: "Pioneer ตั้งเป้าหมายย่อย และส่งหลักฐานความคืบหน้า เช่น เดโม ลิงก์ Git รายงาน หรือวิดีโอ" },
              { icon: "🗳️", title: "Vote (อนุมัติการปล่อยเงิน)", desc: "Booster โหวตให้ milestone แต่ละ phase เมื่อคะแนนเกินครึ่ง ระบบจึงปล่อยเงิน (Disbursement)" },
              { icon: "📒", title: "Ledger / Audit Log", desc: "ทุกธุรกรรมและเหตุผลถูกบันทึก ตรวจสอบย้อนหลังได้ เพิ่มความเชื่อมั่นและความโปร่งใส" },
            ].map((x) => (
              <div key={x.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-2xl">{x.icon}</div>
                <div className="mt-2 text-sm font-semibold text-white/90">{x.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="mx-auto max-w-6xl px-4 py-10">
        <div>
          <h2 className="text-xl font-extrabold">บทบาทในระบบ</h2>
          <p className="mt-1 text-sm text-white/60">Booster / Pioneer / Admin Support / Admin Compliance</p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Booster",
              items: ["ค้นหาและดูรายละเอียดโปรเจกต์", "สนับสนุนเงิน (Principal) เข้าสู่ Escrow", "โหวต milestone เพื่อปล่อยเงิน", "ดูประวัติการลงทุน/กำไร/คืนเงิน"],
              cta: "สมัครเป็น Booster",
              primary: true,
            },
            {
              title: "Pioneer",
              items: ["สร้าง/แก้ไขโปรเจกต์ และจัดการ milestone", "อัปเดตความคืบหน้า (Progress Update)", "ส่งหลักฐาน milestone เพื่อขอปล่อยเงิน", "โอนกำไรเข้ามา (Profit Pool) เพื่อกระจายคืน"],
              cta: "เริ่มสร้างโปรเจกต์",
              primary: false,
            },
            {
              title: "Admin",
              items: ["อนุมัติ Pioneer / โปรเจกต์", "ตรวจสอบความถูกต้องตามกติกา", "ระงับการปล่อยเงิน milestone ได้", "จัดการข้อร้องเรียน/ระงับบัญชี"],
              cta: "ดูเครื่องมือ Admin",
              primary: false,
            },
          ].map((r) => (
            <div key={r.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-base font-extrabold text-white/90">{r.title}</div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/60">
                {r.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <button
                className={
                  r.primary
                    ? "mt-4 h-11 w-full rounded-xl bg-gradient-to-r from-violet-500/90 to-emerald-400/70 text-sm font-semibold hover:opacity-95"
                    : "mt-4 h-11 w-full rounded-xl border border-white/10 bg-white/5 text-sm text-white/80 hover:bg-white/10"
                }
              >
                {r.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + CTA */}
      <section id="faq" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div>
            <h2 className="text-xl font-extrabold">คำถามที่พบบ่อย</h2>
            <p className="mt-1 text-sm text-white/60">FAQ เกี่ยวกับ Escrow, การโหวต, และการคืนเงิน</p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { q: "ทำไมต้องมี Escrow?", a: "เพื่อให้เงินสนับสนุนถูกพักไว้จนกว่า Pioneer จะส่งงานตาม Milestone ช่วยลดความเสี่ยงโปรเจกต์ไม่ทำต่อ" },
              { q: "ปล่อยเงินได้เมื่อไหร่?", a: "เมื่อ Pioneer ส่งหลักฐานครบ และ Booster โหวตให้ milestone เกินครึ่ง ตามเงื่อนไขระบบ" },
              { q: "ถ้าโปรเจกต์ล้มเหลว จะคืนเงินได้ไหม?", a: "ได้ ตามเงื่อนไข Refund ที่กำหนด และมีบันทึก Ledger ตรวจสอบได้" },
            ].map((x) => (
              <details key={x.q} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <summary className="cursor-pointer text-sm font-semibold text-white/85">{x.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{x.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-500/15 to-emerald-400/10 p-5 sm:flex-row sm:items-center">
            <div>
              <div className="text-base font-extrabold text-white/90">พร้อมเริ่มระดมทุนแบบโปร่งใสแล้วหรือยัง?</div>
              <div className="mt-1 text-sm text-white/60">สมัครเป็น Booster เพื่อสนับสนุน หรือสมัคร Pioneer เพื่อสร้างโปรเจกต์</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="h-11 rounded-xl bg-gradient-to-r from-violet-500/90 to-emerald-400/70 px-5 text-sm font-semibold hover:opacity-95">
                เริ่มสนับสนุน
              </button>
              <button className="h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm text-white/80 hover:bg-white/10">
                สร้างโปรเจกต์
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <div>
            <div className="text-sm font-extrabold text-white/90">Flyup</div>
            <div className="mt-1 text-sm text-white/60">แพลตฟอร์มระดมทุนโปรเจกต์ซอฟต์แวร์ของนักศึกษาทั่วประเทศ</div>
          </div>
          <div className="flex gap-8 text-sm text-white/60">
            <div className="space-y-2">
              <div className="font-semibold text-white/80">ลิงก์</div>
              <a className="block hover:text-white" href="#projects">โปรเจกต์</a>
              <a className="block hover:text-white" href="#how">วิธีทำงาน</a>
              <a className="block hover:text-white" href="#roles">บทบาท</a>
              <a className="block hover:text-white" href="#faq">FAQ</a>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-white/80">นโยบาย</div>
              <span className="block">Terms & Conditions</span>
              <span className="block">Privacy</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-white/45">© {new Date().getFullYear()} Flyup — Prototype UI</div>
      </footer>

      {/* MODAL */}
      <Modal
        open={!!selected}
        title={selected?.title || ""}
        onClose={() => setSelected(null)}
        actions={
          <>
            <button className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10" onClick={() => setSelected(null)}>
              ปิด
            </button>
            <button className="h-10 rounded-xl bg-gradient-to-r from-violet-500/90 to-emerald-400/70 px-4 text-sm font-semibold hover:opacity-95" onClick={() => setSelected(null)}>
              ไปหน้าระดมทุน
            </button>
          </>
        }
      >
        {selected && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4 border-b border-white/10 py-2">
              <span className="text-white/50">หมวดหมู่</span><span className="text-white/85">{selected.category}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/10 py-2">
              <span className="text-white/50">มหาวิทยาลัย</span><span className="text-white/85">{selected.university}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/10 py-2">
              <span className="text-white/50">Milestone</span><span className="text-white/85">{selected.milestone}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/10 py-2">
              <span className="text-white/50">เป้าหมาย</span><span className="text-white/85">{thb(selected.goal)}</span>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <span className="text-white/50">ระดมทุนแล้ว</span>
              <span className="text-white/85">{thb(selected.raised)} ({pct(selected.raised, selected.goal)}%)</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
