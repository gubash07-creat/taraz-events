import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bell, CalendarHeart, Check, ChevronRight, Clock3, Compass,
  Drama, Dumbbell, Heart, Landmark, MapPin, Moon, Music2, Palette, PartyPopper, Search, Sparkles,
  Sun, Ticket, Trophy, Users, Wallet, X, Zap,
} from 'lucide-react';
import Magnetic from './components/Magnetic';
import LivingCity from './components/LivingCity';
import Phone, { ArchLogo, SCREEN_TITLES } from './components/Phone';
import type { EventItem } from './lib/types';

const LAUNCH_DATE = new Date('2027-03-21T10:00:00+06:00');
const CATEGORIES = ['Все', 'Концерты', 'Фестивали', 'Выставки', 'Спорт', 'Бесплатно'];

const CAT_ICON: Record<string, typeof Music2> = {
  'Концерты': Music2, 'Фестивали': PartyPopper, 'Выставки': Palette, 'Спорт': Dumbbell, 'Театр': Drama, 'Город': Landmark,
};

const STORY = [
  { screen: 0, tag: '01 · АФИША', title: 'Весь город — на одном экране', text: 'Никаких десяти чатов и разрозненных афиш. Taraz Events собирает концерты, выставки, спорт и городские праздники в одну живую ленту — с датами, местами и ценами.', icon: Compass },
  { screen: 1, tag: '02 · ПОИСК', title: 'Поиск, который понимает с полуслова', text: '«Куда сходить в пятницу недалеко от центра?» Фильтры по району, бюджету, дате и настроению находят ответ быстрее, чем город успевает проснуться.', icon: Search },
  { screen: 2, tag: '03 · AI-ГИД', title: 'Личный гид, а не просто каталог', text: 'AI-гид запоминает твой вкус: любимые жанры, открытые площадки, тихие вечера или большие компании — и собирает маршрут именно под тебя.', icon: Sparkles },
  { screen: 3, tag: '04 · ИЗБРАННОЕ', title: 'Сохраняй. Город напомнит', text: 'Сердечко на событии — и Taraz Events предупредит за день до начала, подскажет дорогу и не даст пропустить вход. Твой личный ритм города.', icon: CalendarHeart },
  { screen: 4, tag: '05 · БИЛЕТЫ', title: 'Билет с QR — уже в кармане', text: 'Покупка в два касания, билет хранится офлайн и открывается без интернета. Покажи QR на входе — и ты внутри события.', icon: Ticket },
];

const INTERESTS = [
  { id: 'music', label: 'Живая музыка', icon: Music2, keys: ['музык', 'концерт', 'джаз', 'рок', 'акустик'], persona: 'охотник за живым звуком' },
  { id: 'art', label: 'Искусство и выставки', icon: Palette, keys: ['искусств', 'выстав', 'керамик', 'фото', 'галере'], persona: 'коллекционер впечатлений' },
  { id: 'sport', label: 'Спорт и движение', icon: Trophy, keys: ['спорт', 'футбол', 'забег', 'бокс', 'матч'], persona: 'заряжен на движение' },
  { id: 'family', label: 'С семьёй и детьми', icon: Users, keys: ['сем', 'дет', 'семейн'], persona: 'хранитель семейных выходных' },
  { id: 'night', label: 'Вечер и ночь города', icon: Moon, keys: ['ноч', 'вечер', 'закат', 'маркет'], persona: 'ночной исследователь' },
  { id: 'history', label: 'История и наследие', icon: Landmark, keys: ['истор', 'мавзолей', 'наследи', 'экскурс', 'древн'], persona: 'путешественник во времени' },
];

const MAP_POS = [
  { x: 24, y: 34 }, { x: 46, y: 22 }, { x: 62, y: 44 }, { x: 38, y: 62 }, { x: 72, y: 68 }, { x: 84, y: 30 },
];

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t); }, []);
  const diff = Math.max(0, LAUNCH_DATE.getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function Intro({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { onDone(); return; }
    const start = Date.now();
    const t = window.setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - start) / 2400) * 100));
      setProgress(p);
      if (p >= 100) window.clearInterval(t);
    }, 40);
    const done = window.setTimeout(onDone, 2750);
    return () => { window.clearInterval(t); window.clearTimeout(done); };
  }, [onDone, reduce]);

  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#14060B] text-[#FFF6E8] overflow-hidden"
      exit={{ y: '-100%', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }} role="dialog" aria-label="Taraz Events — город, который не стоит на месте">
      <div className="absolute inset-0 opacity-[0.13] ornament" />
      <motion.svg width="86" height="86" viewBox="0 0 24 24" fill="none" className="mb-6">
        <motion.path d="M5 21v-8.2C5 8.4 8.1 5 12 5s7 3.4 7 7.8V21" stroke="#E8C98A" strokeWidth="1.7" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeInOut' }} />
        <motion.path d="M9.2 21v-6.4c0-2 1.2-3.4 2.8-3.4s2.8 1.4 2.8 3.4V21" stroke="#FFF6E8" strokeWidth="1.7" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.35, ease: 'easeInOut' }} />
      </motion.svg>
      <div className="overflow-hidden">
        <h1 className="font-display text-[13vw] sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none flex">
          {'TARAZ'.split('').map((ch, i) => (
            <motion.span key={i} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>{ch}</motion.span>
          ))}
        </h1>
      </div>
      <div className="overflow-hidden mt-2">
        <motion.p initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="font-display text-[6vw] sm:text-3xl font-semibold tracking-[0.42em] text-[#E8C98A] pl-2">EVENTS</motion.p>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45 }} className="mt-5 font-serif2 italic text-xl sm:text-2xl text-[#FFF6E8]/85">город, который не стоит на месте</motion.p>
      <div className="mt-9 w-56">
        <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] text-[#FFF6E8]/60"><span>ТАРАЗ ПРОСЫПАЕТСЯ</span><span>{progress}%</span></div>
        <div className="mt-2 h-[3px] rounded-full bg-white/15 overflow-hidden"><motion.div className="h-full bg-[#E8C98A]" style={{ width: `${progress}%` }} /></div>
      </div>
      <button type="button" onClick={onDone} className="absolute bottom-8 rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold tracking-wider text-[#FFF6E8]/80 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C98A]">Пропустить интро</button>
    </motion.div>
  );
}

function EventModal({ ev, isFav, onFav, onClose, onWaitlist }: { ev: EventItem; isFav: boolean; onFav: () => void; onClose: () => void; onWaitlist: () => void }) {
  const Icon = CAT_ICON[ev.category] || Compass;
  return (
    <motion.div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button aria-label="Закрыть" className="absolute inset-0 bg-[#14060B]/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ y: 60, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative w-full max-w-lg overflow-hidden rounded-t-[28px] sm:rounded-[28px] bg-[#FFFDF8] text-[#2A1418] shadow-2xl" role="dialog" aria-modal="true" aria-label={ev.title}>
        <div className="relative h-40 p-6 text-[#FFF6E8] ornament" style={{ background: ev.color }}>
          <button onClick={onClose} aria-label="Закрыть детали события" className="absolute right-4 top-4 grid place-items-center w-9 h-9 rounded-full bg-black/25 text-white transition hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><X size={17} /></button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-[11px] font-extrabold"><Icon size={13} />{ev.category}</span>
          <p className="absolute bottom-5 left-6 font-display text-5xl">{ev.day_num}<span className="ml-2 text-lg uppercase">{ev.month_label}</span></p>
        </div>
        <div className="p-6">
          <h3 className="font-display text-xl leading-snug">{ev.title}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <p className="flex gap-2"><Clock3 size={16} className="text-[#7A1E2B] shrink-0 mt-0.5" /><span><b>Когда</b><br /><span className="text-[#2A1418]/60">{ev.date_label}, {ev.time_label}</span></span></p>
            <p className="flex gap-2"><MapPin size={16} className="text-[#7A1E2B] shrink-0 mt-0.5" /><span><b>Где</b><br /><span className="text-[#2A1418]/60">{ev.venue} · {ev.district}</span></span></p>
            <p className="flex gap-2"><Wallet size={16} className="text-[#7A1E2B] shrink-0 mt-0.5" /><span><b>Билеты</b><br /><span className="text-[#2A1418]/60">{ev.is_free ? 'Вход бесплатный' : `от ${ev.price.toLocaleString('ru-RU')} ₸`}</span></span></p>
            <p className="flex gap-2"><Bell size={16} className="text-[#7A1E2B] shrink-0 mt-0.5" /><span><b>Напоминание</b><br /><span className="text-[#2A1418]/60">Появится в приложении</span></span></p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onFav} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7A1E2B]/30 ${isFav ? 'bg-[#7A1E2B] text-white' : 'bg-[#7A1E2B]/8 text-[#7A1E2B] hover:bg-[#7A1E2B]/15'}`}>
              <Heart size={16} className={isFav ? 'fill-white' : ''} />{isFav ? 'В избранном' : 'В избранное'}
            </button>
            <button onClick={onWaitlist} className="inline-flex items-center gap-2 rounded-full bg-[#2A1418] px-5 py-3 text-sm font-extrabold text-[#FFF6E8] transition hover:bg-[#7A1E2B] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7A1E2B]/30">Узнать о запуске <ArrowUpRight size={16} /></button>
          </div>
          <p className="mt-4 text-xs text-[#2A1418]/50">Продажа билетов и напоминания откроются в день запуска приложения. Это событие уже есть в первой афише города.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  const [intro, setIntro] = useState(true);
  const [night, setNight] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('Все');
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [screen, setScreen] = useState(0);
  const [interests, setInterests] = useState<Set<string>>(new Set(['music']));
  const [waitCount, setWaitCount] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState<{ email: string; position: number; already: boolean } | null>(null);
  const [refOpen, setRefOpen] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const phoneTilt = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const reduce = useReducedMotion();
  const cd = useCountdown();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  const fetchEvents = async () => {
    setLoading(true); setLoadError('');
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Афиша временно недоступна');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch { setLoadError('Не удалось загрузить афишу города. Проверьте соединение и попробуйте ещё раз.'); }
    finally { setLoading(false); }
  };
  const fetchCount = async () => {
    try { const res = await fetch('/api/waitlist'); if (res.ok) { const d = await res.json(); setWaitCount(d.count ?? 0); } } catch { /* счётчик не критичен */ }
  };
  useEffect(() => { fetchEvents(); fetchCount(); }, []);

  const filtered = useMemo(() => {
    if (filter === 'Все') return events;
    if (filter === 'Бесплатно') return events.filter(e => e.is_free);
    return events.filter(e => e.category === filter);
  }, [events, filter]);

  const toggleFav = (id: number) => setFavs(prev => { const n = new Set(prev); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; });
  const toggleInterest = (id: string) => setInterests(prev => { const n = new Set(prev); if (n.has(id)) { n.delete(id); } else { n.add(id); } return n; });

  const matched = useMemo(() => {
    const chosen = INTERESTS.filter(i => interests.has(i.id));
    const scored = events.map(ev => {
      const hay = `${ev.title} ${ev.category} ${ev.tags} ${ev.venue}`.toLowerCase();
      const score = chosen.reduce((acc, c) => acc + c.keys.filter(k => hay.includes(k)).length, 0);
      return { ev, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map(x => x.ev);
  }, [events, interests]);
  const persona = INTERESTS.filter(i => interests.has(i.id)).map(i => i.persona);

  const pins = useMemo(() => events.slice(0, 5).map((ev, i) => ({
    id: ev.id, title: ev.title, venue: ev.venue,
    x: [17, 36, 59, 78, 90][i], y: [57, 48, 40, 52, 58][i],
  })), [events]);

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });

  const submitWaitlist = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) { setFormError('Проверьте e-mail: нужен адрес вида name@example.com'); return; }
    setFormError(''); setSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: value, interest: persona.join(', ') }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Не удалось отправить заявку');
      setTicket({ email: value, position: data.position || 1, already: !!data.already });
      fetchCount();
    } catch (err) { setFormError(err instanceof Error ? err.message : 'Что-то пошло не так. Попробуйте ещё раз.'); }
    finally { setSubmitting(false); }
  };

  const onPhoneMove = (e: React.MouseEvent) => {
    if (reduce || window.matchMedia('(hover: none)').matches) return;
    const r = phoneTilt.current?.getBoundingClientRect(); if (!r) return;
    setTilt({ rx: -((e.clientY - r.top) / r.height - 0.5) * 10, ry: ((e.clientX - r.left) / r.width - 0.5) * 14 });
  };

  return (
    <div className={`city-app noise min-h-screen overflow-x-clip antialiased ${night ? 'is-night' : ''}`}>
      <motion.div className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-[#7A1E2B]" style={{ scaleX: progress }} />
      <AnimatePresence>{intro && <Intro onDone={() => setIntro(false)} />}</AnimatePresence>

      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-[60] glass border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] rounded-full" aria-label="Taraz Events — наверх">
            <ArchLogo size={36} />
            <span className="text-left leading-none"><span className="font-display text-[13px] font-bold tracking-tight">TARAZ<span className="text-[#7A1E2B]">EVENTS</span></span><span className="mt-1 block text-[9px] font-bold tracking-[0.22em] muted">ГОРОД · СОБЫТИЯ · ЛЮДИ</span></span>
          </button>
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-bold" aria-label="Основная навигация">
            {[['Афиша', '#discover'], ['Приложение', '#app'], ['Твой Тараз', '#experience'], ['Карта', '#map']].map(([label, href]) => (
              <button key={href} onClick={() => scrollTo(href)} className="muted transition hover:text-[#7A1E2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] rounded">{label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <button onClick={() => setNight(n => !n)} aria-label={night ? 'Включить дневную атмосферу' : 'Включить ночную атмосферу'} className="grid place-items-center w-10 h-10 rounded-full border border-[var(--line)] card-bg transition hover:scale-105 hover:border-[#7A1E2B]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B]">
              {night ? <Sun size={17} className="text-[#E8C98A]" /> : <Moon size={17} className="text-[#7A1E2B]" />}
            </button>
            <Magnetic strength={0.25}>
              <button onClick={() => scrollTo('#waitlist')} className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#7A1E2B] px-5 py-2.5 text-[13px] font-extrabold text-[#FFF6E8] shadow-lg shadow-[#7A1E2B]/25 transition hover:bg-[#8E2436] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E8C98A]">Ранний доступ <ArrowRight size={15} /></button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-28 sm:pt-36 pb-10">
        <div className="pointer-events-none absolute -top-10 right-0 font-display text-[22vw] font-extrabold leading-none text-outline opacity-[0.07] select-none" aria-hidden>ТАРАЗ</div>
        <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={!intro ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] card-bg px-4 py-2 text-[11px] font-extrabold tracking-[0.16em]">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7A1E2B] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#7A1E2B]" /></span>
              СКОРО · ВЕРСИЯ 2.0 · ТАРАЗ, КАЗАХСТАН
            </motion.div>
            <h2 className="mt-6 font-display font-extrabold leading-[0.98] tracking-tight text-[11.5vw] sm:text-6xl xl:text-[76px]">
              {['ТАРАЗ.', 'ТВОЙ ГОРОД.', 'ТВОИ СОБЫТИЯ.'].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span className={`block ${i === 2 ? 'text-[#7A1E2B]' : ''}`} initial={{ y: '105%' }} animate={!intro ? { y: 0 } : {}} transition={{ delay: 0.15 + i * 0.13, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>{line}</motion.span>
                </span>
              ))}
            </h2>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={!intro ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, duration: 0.6 }} className="mt-5 max-w-xl text-lg sm:text-xl leading-relaxed muted">
              Все интересные события города — в одном приложении. <span className="font-serif2 italic text-[1.25em]" style={{ color: 'var(--ink)' }}>Древний город. Новая энергия.</span>
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={!intro ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.75, duration: 0.6 }} className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <button onClick={() => scrollTo('#waitlist')} className="group inline-flex items-center gap-3 rounded-full bg-[#7A1E2B] px-7 py-4 text-[15px] font-extrabold text-[#FFF6E8] shadow-[0_22px_40px_-12px_rgba(122,30,43,0.65)] transition hover:bg-[#8E2436] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E8C98A]">
                  Хочу первым узнать о запуске <ArrowRight size={18} className="transition-transform group-hover:translate-x-1.5" />
                </button>
              </Magnetic>
              <button onClick={() => scrollTo('#discover')} className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] card-bg px-6 py-4 text-[15px] font-extrabold transition hover:border-[#7A1E2B]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B]">
                Смотреть афишу <ArrowDown size={17} className="text-[#7A1E2B] transition-transform group-hover:translate-y-1" />
              </button>
            </motion.div>
            <motion.dl initial={{ opacity: 0 }} animate={!intro ? { opacity: 1 } : {}} transition={{ delay: 0.95, duration: 0.7 }} className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[[events.length ? `${events.length}` : '—', 'событий в первой афише'], ['5', 'сценариев внутри приложения'], [waitCount !== null ? `${waitCount}` : '—', 'уже ждут запуск']].map(([num, label]) => (
                <div key={label} className="border-l-2 border-[#7A1E2B]/50 pl-3"><dt className="sr-only">{label}</dt><dd className="font-display text-2xl sm:text-3xl">{num}</dd><dd className="mt-1 text-[11px] font-semibold leading-tight muted">{label}</dd></div>
              ))}
            </motion.dl>
          </div>

          <motion.div initial={{ opacity: 0, y: 40, rotate: 4 }} animate={!intro ? { opacity: 1, y: 0, rotate: 0 } : {}} transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-fit" style={{ perspective: 1100 }}>
            <div className="absolute -left-8 top-16 z-20 hidden sm:block animate-floaty" style={{ '--r': '-6deg' } as React.CSSProperties}>
              <span className="flex items-center gap-2 rounded-2xl card-bg px-3.5 py-2.5 text-xs font-extrabold shadow-xl border border-[var(--line)]"><Music2 size={15} className="text-[#7A1E2B]" /> Джаз на закате · сегодня</span>
            </div>
            <div className="absolute -right-6 bottom-32 z-20 hidden sm:block animate-floaty" style={{ '--r': '5deg', animationDelay: '1.2s' } as React.CSSProperties}>
              <span className="flex items-center gap-2 rounded-2xl bg-[#7A1E2B] px-3.5 py-2.5 text-xs font-extrabold text-[#FFF6E8] shadow-xl"><Ticket size={15} /> QR-билет готов</span>
            </div>
            <div ref={phoneTilt} onMouseMove={onPhoneMove} onMouseLeave={() => setTilt({ rx: 0, ry: 0 })} style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transition: 'transform .35s cubic-bezier(.22,1,.36,1)', transformStyle: 'preserve-3d' }}>
              <Phone screen={0} events={events} />
            </div>
            <p className="mt-4 text-center text-xs font-bold muted">Экран приложения, собранный по настоящим референсам Taraz Events</p>
          </motion.div>
        </div>

        {/* LIVING CITY */}
        <motion.div initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8 }} className="mt-14">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
            <div><p className="text-[11px] font-black tracking-[0.24em] text-[#7A1E2B]">LIVING CITY · ИНТЕРАКТИВНАЯ СЦЕНА</p><h3 className="mt-1 font-display text-2xl sm:text-3xl">Город просыпается от твоего касания</h3></div>
            <p className="max-w-sm text-sm muted">Мавзолей Айша-Биби, центральная арка и беседка из приложения. Нажимай на панораму и пины — город отвечает светом.{pulseCount > 0 ? ` Ты будил город уже ${pulseCount} раз.` : ''}</p>
          </div>
          <LivingCity night={night} pins={pins} onPulse={() => setPulseCount(c => c + 1)} />
        </motion.div>
      </section>

      {/* KINETIC MARQUEE */}
      <div className="relative -rotate-1 border-y border-[#7A1E2B]/25 bg-[#7A1E2B] py-3.5 text-[#FFF6E8] overflow-hidden" aria-hidden>
        <div className="animate-marquee flex w-max whitespace-nowrap font-display text-sm sm:text-base font-bold tracking-[0.14em]">
          {[0, 1].map(n => <span key={n} className="pr-2">{'КОНЦЕРТЫ ✦ ФЕСТИВАЛИ ✦ ВЫСТАВКИ ✦ СПОРТ ✦ ТЕАТР ✦ БЕСПЛАТНО ✦ НОЧНОЙ ГОРОД ✦ '.repeat(2)}</span>)}
        </div>
      </div>

      {/* DISCOVER */}
      <section id="discover" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black tracking-[0.24em] text-[#7A1E2B]">DISCOVER THE CITY</p>
            <h3 className="mt-3 font-display text-4xl sm:text-5xl leading-[1.04]">Один город —<br /><span className="font-serif2 italic font-semibold normal-case text-[#7A1E2B]">тысяча поводов выйти</span></h3>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed muted">Это живая первая афиша Taraz Events: данные подгружаются из базы приложения. Выбирай настроение, сохраняй сердечком, открывай детали.</p>
        </div>

        <div className="no-scrollbar mt-9 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Категории событий">
          {CATEGORIES.map(cat => (
            <button key={cat} role="tab" aria-selected={filter === cat} onClick={() => setFilter(cat)} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] ${filter === cat ? 'bg-[#7A1E2B] text-[#FFF6E8] shadow-lg shadow-[#7A1E2B]/30 scale-[1.03]' : 'border border-[var(--line)] card-bg muted hover:border-[#7A1E2B]/50'}`}>{cat}</button>
          ))}
          {favs.size > 0 && <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#7A1E2B]/10 px-4 py-2.5 text-sm font-extrabold text-[#7A1E2B]"><Heart size={14} className="fill-[#7A1E2B]" /> В избранном: {favs.size}</span>}
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Загружаем афишу">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 animate-pulse rounded-[26px] border border-[var(--line)] card-bg" />)}
          </div>
        ) : loadError ? (
          <div className="mt-8 rounded-[26px] border border-[#7A1E2B]/30 card-bg p-8 text-center">
            <p className="font-display text-lg">Афиша на минутку замолчала</p><p className="mt-2 text-sm muted">{loadError}</p>
            <button onClick={fetchEvents} className="mt-5 rounded-full bg-[#7A1E2B] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#8E2436] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E8C98A]">Попробовать снова</button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-8 rounded-[26px] border border-dashed border-[var(--line)] p-10 text-center muted">В этой категории пока тихо. Загляни в «Все» — город уже шумит.</p>
        ) : (
          <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((ev, idx) => {
                const Icon = CAT_ICON[ev.category] || Compass;
                const isFav = favs.has(ev.id);
                return (
                  <motion.article key={ev.id} layout initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.45, delay: Math.min(idx * 0.05, 0.3) }}
                    whileHover={reduce ? undefined : { y: -8, rotate: idx % 2 ? 0.5 : -0.5 }} className="group relative overflow-hidden rounded-[26px] border border-[var(--line)] card-bg shadow-[0_18px_44px_-22px_rgba(60,10,20,0.35)]">
                    <button onClick={() => setSelected(ev)} className="block w-full text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#E8C98A]" aria-label={`Подробнее: ${ev.title}`}>
                      <div className="relative h-36 p-5 text-[#FFF6E8] ornament" style={{ background: ev.color }}>
                        <div className="flex items-start justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-[11px] font-extrabold"><Icon size={13} />{ev.category}</span>
                          <span className="rounded-2xl bg-[#FFFDF8] px-3 py-1.5 text-center text-[#2A1418] shadow"><span className="block font-display text-lg leading-none">{ev.day_num}</span><span className="text-[9px] font-black uppercase tracking-wider">{ev.month_label}</span></span>
                        </div>
                        <p className="absolute bottom-4 left-5 right-5 flex items-center gap-2 text-[12px] font-bold opacity-95"><MapPin size={14} />{ev.venue}<span className="opacity-70">· {ev.district}</span></p>
                      </div>
                      <div className="p-5 pb-4">
                        <h4 className="font-display text-[17px] leading-snug min-h-[52px]">{ev.title}</h4>
                        <p className="mt-2 flex items-center gap-4 text-[13px] muted"><span className="inline-flex items-center gap-1.5"><Clock3 size={14} />{ev.time_label}</span><span className="font-extrabold" style={{ color: ev.is_free ? '#4C7A45' : 'var(--ink)' }}>{ev.is_free ? 'Бесплатно' : `от ${ev.price.toLocaleString('ru-RU')} ₸`}</span></p>
                      </div>
                    </button>
                    <div className="flex items-center justify-between px-5 pb-5">
                      <span className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#7A1E2B]">Подробнее <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
                      <button onClick={() => toggleFav(ev.id)} aria-pressed={isFav} aria-label={isFav ? `Убрать «${ev.title}» из избранного` : `Добавить «${ev.title}» в избранное`} className={`grid place-items-center w-10 h-10 rounded-full transition active:scale-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] ${isFav ? 'bg-[#7A1E2B] text-white shadow-lg shadow-[#7A1E2B]/35' : 'border border-[var(--line)] muted hover:text-[#7A1E2B] hover:border-[#7A1E2B]/50'}`}>
                        <Heart size={17} className={isFav ? 'fill-white' : ''} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* MEET THE APP — SCROLL STORY */}
      <section id="app" className="scroll-mt-16 border-y border-[var(--line)]" style={{ background: 'var(--bg2)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black tracking-[0.24em] text-[#7A1E2B]">MEET THE APP · SCROLL STORY</p>
            <h3 className="mt-3 font-display text-4xl sm:text-5xl leading-[1.05]">Листай — и телефон <span className="font-serif2 italic font-semibold text-[#7A1E2B]">оживёт</span></h3>
            <p className="mt-4 max-w-xl muted leading-relaxed">Пять глав одной истории: от первой афиши до QR на входе. Экраны справа повторяют настоящую идентичность приложения — кремовый фон, бордовые кнопки и арку-логотип.</p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div className="relative order-1">
              <div className="sticky top-24">
                <div className="relative mx-auto w-fit">
                  <motion.div key={screen} className="absolute -inset-8 rounded-full blur-3xl" style={{ background: ['#E9B44C', '#7A1E2B', '#C19A5B', '#8E2436', '#4C7A45'][screen], opacity: 0.22 }} initial={{ opacity: 0 }} animate={{ opacity: 0.22 }} aria-hidden />
                  <Phone screen={screen} events={events} />
                </div>
                <div className="mt-6 flex items-center justify-center gap-2" aria-label={`Экран: ${SCREEN_TITLES[screen]}`}>
                  {SCREEN_TITLES.map((t, i) => <button key={t} onClick={() => setScreen(i)} aria-label={`Показать экран «${t}»`} className={`h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] ${i === screen ? 'w-9 bg-[#7A1E2B]' : 'w-2.5 bg-[#7A1E2B]/25 hover:bg-[#7A1E2B]/50'}`} />)}
                </div>
                <p className="mt-3 text-center font-display text-sm">{SCREEN_TITLES[screen]}</p>
                <button onClick={() => setRefOpen(true)} className="mx-auto mt-5 flex items-center gap-3 rounded-2xl border border-[var(--line)] card-bg p-2.5 pr-5 text-left shadow-sm transition hover:border-[#7A1E2B]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B]">
                  <img src="/app-reference.png" alt="Настоящие экраны приложения Taraz Events" className="h-12 w-20 rounded-xl object-cover object-top" />
                  <span className="text-xs font-extrabold leading-snug">Настоящие экраны приложения<br /><span className="muted font-semibold">нажми, чтобы рассмотреть референс</span></span>
                </button>
              </div>
            </div>
            <div className="order-2">
              {STORY.map((step, i) => (
                <motion.div key={step.tag} onViewportEnter={() => setScreen(step.screen)} viewport={{ amount: 0.55 }}
                  className={`flex min-h-[62vh] lg:min-h-[78vh] flex-col justify-center border-b border-[var(--line)] py-10 transition-opacity duration-500 ${screen === step.screen ? 'opacity-100' : 'opacity-45'}`}>
                  <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-black tracking-[0.16em] ${screen === step.screen ? 'bg-[#7A1E2B] text-[#FFF6E8]' : 'border border-[var(--line)] muted'}`}><step.icon size={13} />{step.tag}</span>
                  <h4 className="mt-5 font-display text-3xl sm:text-4xl leading-tight max-w-md">{step.title}</h4>
                  <p className="mt-4 max-w-md text-[16px] leading-relaxed muted">{step.text}</p>
                  {i === STORY.length - 1 && <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#7A1E2B]/10 px-4 py-2 text-sm font-extrabold text-[#7A1E2B]"><Zap size={15} /> Дальше — только в день запуска</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* YOUR CITY, YOUR EXPERIENCE */}
      <section id="experience" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-black tracking-[0.24em] text-[#7A1E2B]">YOUR CITY, YOUR EXPERIENCE</p>
            <h3 className="mt-3 font-display text-4xl sm:text-5xl leading-[1.05]">Какой Тараз — <span className="font-serif2 italic font-semibold text-[#7A1E2B]">твой?</span></h3>
            <p className="mt-4 max-w-md muted leading-relaxed">Отметь, что откликается. Мини-гид справа мгновенно пересоберёт афишу под твой характер — так же будет работать AI внутри приложения.</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {INTERESTS.map(({ id, label, icon: Icon }) => {
                const active = interests.has(id);
                return (
                  <button key={id} onClick={() => toggleInterest(id)} aria-pressed={active} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] ${active ? 'bg-[#7A1E2B] text-[#FFF6E8] shadow-lg shadow-[#7A1E2B]/30' : 'border border-[var(--line)] card-bg muted hover:border-[#7A1E2B]/55'}`}>
                    <Icon size={16} />{label}{active && <Check size={14} />}
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={persona.join()} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-8 rounded-[22px] border border-[#7A1E2B]/25 bg-[#7A1E2B]/6 p-5 max-w-md">
                <span className="text-[11px] font-black tracking-[0.18em] text-[#7A1E2B]">ТВОЙ ПОРТРЕТ ГОРОЖАНИНА</span>
                <span className="mt-1.5 block font-serif2 italic text-[26px] leading-tight">{persona.length ? `Ты — ${persona.join(' и ')}` : 'Выбери хотя бы один интерес — и город подмигнёт в ответ'}</span>
              </motion.p>
            </AnimatePresence>
          </div>
          <div>
            <p className="flex items-center gap-2 text-[11px] font-black tracking-[0.2em] muted"><Sparkles size={14} className="text-[#7A1E2B]" /> ПОДБОРКА ПО ТВОИМ ИНТЕРЕСАМ</p>
            {loading ? <div className="mt-4 space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-24 animate-pulse rounded-[22px] border border-[var(--line)] card-bg" />)}</div>
              : interests.size === 0 ? <p className="mt-4 rounded-[22px] border border-dashed border-[var(--line)] p-8 muted">Пока пусто: город ждёт, что ты расскажешь о себе слева.</p>
              : matched.length === 0 ? <p className="mt-4 rounded-[22px] border border-dashed border-[var(--line)] p-8 muted">В первой афише под это настроение пока тихо — но в день запуска город зазвучит громче.</p>
              : (
                <div className="mt-4 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {matched.map((ev, i) => (
                      <motion.button key={ev.id} layout initial={{ opacity: 0, x: 44 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, delay: i * 0.07 }} onClick={() => setSelected(ev)}
                        className="group flex w-full items-center gap-4 rounded-[22px] border border-[var(--line)] card-bg p-4 text-left shadow-[0_14px_34px_-20px_rgba(60,10,20,0.4)] transition hover:border-[#7A1E2B]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B]">
                        <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-[#FFF6E8]" style={{ background: ev.color }}><span className="font-display text-lg leading-none">{ev.day_num}</span><span className="text-[9px] font-black uppercase">{ev.month_label}</span></span>
                        <span className="min-w-0 flex-1"><span className="block truncate font-display text-[15px]">{ev.title}</span><span className="mt-1 block text-[13px] muted">{ev.venue} · {ev.time_label}</span></span>
                        <span className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-extrabold" style={{ background: `${ev.color}1f`, color: ev.color }}>{ev.is_free ? 'Бесплатно' : `${ev.price.toLocaleString('ru-RU')} ₸`}</span>
                        <ArrowUpRight size={18} className="shrink-0 text-[#7A1E2B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            <p className="mt-4 text-xs muted">Подборка считается честно: по тегам и названиям реальных событий из базы афиши, без случайных карточек.</p>
          </div>
        </div>
      </section>

      {/* ANIMATED MAP */}
      <section id="map" className="mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 pb-20 sm:pb-28">
        <div className="overflow-hidden rounded-[32px] border border-[var(--line)] card-bg shadow-[0_30px_70px_-30px_rgba(60,10,20,0.4)]">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="p-7 sm:p-10">
              <p className="text-[11px] font-black tracking-[0.24em] text-[#7A1E2B]">ГОРОД НА ЛАДОНИ</p>
              <h3 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">Река Талас, старый город и <span className="font-serif2 italic font-semibold text-[#7A1E2B]">шесть точек притяжения</span></h3>
              <p className="mt-4 muted leading-relaxed">Нажимай на пины stylized-карты: каждое место — настоящее событие из афиши. В приложении карта будет живой: с маршрутами, временем в пути и событиями рядом с тобой.</p>
              <div className="mt-7 space-y-2.5">
                {events.slice(0, 6).map((ev, i) => (
                  <button key={ev.id} onClick={() => setSelected(ev)} className="flex w-full items-center gap-3 rounded-2xl border border-[var(--line)] px-4 py-3 text-left transition hover:border-[#7A1E2B]/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B]">
                    <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full text-white font-display text-[12px]" style={{ background: ev.color }}>{i + 1}</span>
                    <span className="min-w-0"><span className="block truncate text-sm font-extrabold">{ev.title}</span><span className="block text-xs muted">{ev.district} · {ev.date_label}</span></span>
                  </button>
                ))}
                {!events.length && <p className="text-sm muted">Точки появятся, как только загрузится афиша.</p>}
              </div>
            </div>
            <div className="relative min-h-[420px]" style={{ background: night ? '#1D0B15' : '#F1E5CF' }}>
              <svg viewBox="0 0 600 460" className="absolute inset-0 h-full w-full" aria-hidden>
                <path d="M-20 330 C120 290 180 350 300 300 C420 250 480 300 630 240 L630 500 L-20 500Z" fill={night ? '#2A6E8E' : '#9CC3D8'} opacity="0.65" />
                <path d="M60 0 C90 120 60 260 130 460M240 0 C230 150 280 300 250 460M420 0 C400 140 460 280 430 460M0 110 C180 90 380 140 600 100M0 250 C200 230 400 270 600 240" stroke={night ? 'rgba(248,237,222,0.22)' : 'rgba(122,30,43,0.18)'} strokeWidth="10" fill="none" strokeLinecap="round" />
                <path d="M300 40 h120M120 180h150M330 330h140" stroke={night ? 'rgba(232,201,138,0.5)' : 'rgba(193,154,91,0.65)'} strokeWidth="4" strokeDasharray="12 9" fill="none" />
                <text x="70" y="150" fontSize="13" fontWeight="800" fill={night ? '#F8EDDE' : '#7A1E2B'} opacity="0.75">СТАРЫЙ ГОРОД</text>
                <text x="330" y="90" fontSize="13" fontWeight="800" fill={night ? '#F8EDDE' : '#7A1E2B'} opacity="0.75">ЦЕНТР</text>
                <text x="360" y="400" fontSize="13" fontWeight="800" fill={night ? '#F8EDDE' : '#7A1E2B'} opacity="0.75">РЕКА ТАЛАС</text>
                <text x="90" y="300" fontSize="13" fontWeight="800" fill={night ? '#F8EDDE' : '#7A1E2B'} opacity="0.6">КАРАСУ</text>
              </svg>
              {events.slice(0, 6).map((ev, i) => (
                <motion.button key={ev.id} onClick={() => setSelected(ev)} aria-label={`${ev.title} — показать на карте и открыть`}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${MAP_POS[i].x}%`, top: `${MAP_POS[i].y}%` }}
                  animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}>
                  <span className="grid place-items-center w-10 h-10 rounded-full rounded-br-none rotate-[-45deg] text-white shadow-xl ring-4 ring-white/40 hover:scale-110 transition" style={{ background: ev.color }}><span className="rotate-45 font-display text-[13px]">{i + 1}</span></span>
                </motion.button>
              ))}
              <span className="absolute bottom-4 left-4 rounded-full bg-black/30 px-3.5 py-1.5 text-[11px] font-bold text-[#FFF6E8] backdrop-blur-sm">Стилизованная карта · не навигационная</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <div className="overflow-hidden py-2" aria-hidden>
        <div className="animate-marquee-rev flex w-max whitespace-nowrap font-display text-[13vw] sm:text-[86px] font-extrabold leading-none">
          {[0, 1].map(n => <span key={n} className="pr-8"><span className="text-outline">СКОРО · </span>ТАРАЗ ЗАЗВУЧИТ <span className="text-outline">ПО-НОВОМУ · </span></span>)}
        </div>
      </div>

      {/* COMING SOON */}
      <section id="waitlist" className="relative scroll-mt-16 overflow-hidden bg-[#1B0A12] text-[#FFF6E8]">
        <div className="absolute inset-0 ornament opacity-[0.16]" />
        <motion.div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7A1E2B] blur-[110px]" animate={reduce ? undefined : { scale: [1, 1.25, 1], opacity: [0.5, 0.85, 0.5] }} transition={{ duration: 5, repeat: Infinity }} aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-24 sm:py-32 text-center">
          <ArchLogo size={58} bg="#FFF6E8" />
          <p className="mt-7 text-[11px] font-black tracking-[0.3em] text-[#E8C98A]">COMING SOON · НАУРЫЗ · 21.03.2027</p>
          <h3 className="mx-auto mt-5 max-w-4xl font-display text-[10.5vw] sm:text-6xl lg:text-7xl font-extrabold leading-[1.02]">СКОРО ТАРАЗ<br />ЗАЗВУЧИТ <span className="font-serif2 italic font-semibold text-[#E8C98A]">по-новому</span></h3>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[#FFF6E8]/70">Запуск — в первый день весны по-настоящему: на Наурыз. Оставь e-mail, и Taraz Events придёт к тебе раньше, чем город выйдет на праздничные улицы.</p>

          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 gap-2.5 sm:gap-3" role="timer" aria-label="Обратный отсчёт до запуска">
            {[[cd.days, 'дней'], [cd.hours, 'часов'], [cd.minutes, 'минут'], [cd.seconds, 'секунд']].map(([v, label]) => (
              <div key={label as string} className="rounded-[22px] border border-white/12 bg-white/[0.06] px-2 py-4 backdrop-blur">
                <p className="font-display text-3xl sm:text-4xl tabular-nums">{String(v).padStart(2, '0')}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFF6E8]/55">{label}</p>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {ticket ? (
              <motion.div key="ticket" initial={{ opacity: 0, y: 26, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -1.5 }} className="mx-auto mt-12 max-w-md text-left">
                <div className="relative overflow-hidden rounded-[26px] bg-[#FFF6E8] text-[#2A1418] shadow-[0_36px_80px_-20px_rgba(0,0,0,0.65)]">
                  <div className="flex items-stretch">
                    <div className="flex-1 p-6">
                      <p className="flex items-center gap-2 text-[10px] font-black tracking-[0.22em] text-[#7A1E2B]"><Ticket size={14} /> БИЛЕТ В ДЕНЬ ЗАПУСКА</p>
                      <p className="mt-3 font-display text-xl leading-tight">{ticket.already ? 'Ты уже в списке города' : 'Ты в списке первых'}</p>
                      <p className="mt-2 text-sm text-[#2A1418]/60">{ticket.email}</p>
                      <p className="mt-4 inline-flex rounded-full bg-[#7A1E2B] px-3.5 py-1.5 text-xs font-extrabold text-white">Место в очереди · № {ticket.position}</p>
                    </div>
                    <div className="relative w-[86px] shrink-0 border-l-2 border-dashed border-[#7A1E2B]/30 bg-[#F4E9D4] p-3 flex flex-col items-center justify-center gap-2">
                      <span className="absolute -left-[11px] -top-[11px] w-[22px] h-[22px] rounded-full bg-[#1B0A12]" /><span className="absolute -left-[11px] -bottom-[11px] w-[22px] h-[22px] rounded-full bg-[#1B0A12]" />
                      <ArchLogo size={34} />
                      <span className="font-display text-[10px] tracking-widest">TZ-{String(ticket.position).padStart(4, '0')}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-[#FFF6E8]/70">Заявка честно сохранена в базе раннего доступа. В день запуска письмо придёт именно на этот адрес.{waitCount !== null ? ` Сейчас в очереди ${waitCount} человек.` : ''}</p>
                <button onClick={() => { setTicket(null); setEmail(''); }} className="mx-auto mt-4 block rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C98A]">Добавить ещё один e-mail</button>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0, y: -18 }} onSubmit={submitWaitlist} className="mx-auto mt-12 max-w-lg" noValidate>
                <label htmlFor="waitlist-email" className="sr-only">Электронная почта для раннего доступа</label>
                <div className={`flex flex-col gap-3 sm:flex-row rounded-[26px] sm:rounded-full border bg-white/[0.07] p-2.5 backdrop-blur transition ${formError ? 'border-red-300' : 'border-white/15 focus-within:border-[#E8C98A]'}`}>
                  <input id="waitlist-email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={e => { setEmail(e.target.value); if (formError) setFormError(''); }}
                    className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3.5 text-[15px] font-semibold text-[#FFF6E8] placeholder:text-[#FFF6E8]/40 focus:outline-none" aria-invalid={!!formError} aria-describedby={formError ? 'waitlist-error' : undefined} />
                  <Magnetic strength={0.2}>
                    <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7A1E2B] px-7 py-3.5 text-[15px] font-extrabold text-[#FFF6E8] shadow-xl transition hover:bg-[#8E2436] disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E8C98A]">
                      {submitting ? 'Сохраняем…' : 'Жду запуск'} {!submitting && <ArrowRight size={17} />}
                    </button>
                  </Magnetic>
                </div>
                {formError ? <p id="waitlist-error" role="alert" className="mt-3 text-sm font-semibold text-red-200">{formError}</p>
                  : <p className="mt-3 text-[13px] text-[#FFF6E8]/55">Одно письмо в день запуска. Без спама и лишнего шума — только город.{waitCount !== null ? ` Уже в очереди: ${waitCount}.` : ''}</p>}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-sm">
              <span className="flex items-center gap-2.5"><ArchLogo size={38} /><span className="font-display text-sm font-bold">TARAZ<span className="text-[#7A1E2B]">EVENTS</span></span></span>
              <p className="mt-4 text-sm leading-relaxed muted">Единое пространство событий Тараза: афиша, рекомендации AI-гида, избранное и билеты с QR — в одном приложении.</p>
            </div>
            <nav className="flex gap-14 text-sm" aria-label="Навигация в подвале">
              <div className="flex flex-col gap-2.5"><span className="text-[11px] font-black tracking-[0.18em] text-[#7A1E2B]">ГОРОД</span>{[['Афиша', '#discover'], ['Карта', '#map'], ['Твой Тараз', '#experience']].map(([l, h]) => <button key={h} onClick={() => scrollTo(h)} className="text-left font-semibold muted transition hover:text-[#7A1E2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] rounded">{l}</button>)}</div>
              <div className="flex flex-col gap-2.5"><span className="text-[11px] font-black tracking-[0.18em] text-[#7A1E2B]">ЗАПУСК</span>{[['Приложение', '#app'], ['Ранний доступ', '#waitlist']].map(([l, h]) => <button key={h} onClick={() => scrollTo(h)} className="text-left font-semibold muted transition hover:text-[#7A1E2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] rounded">{l}</button>)}<button onClick={() => setNight(n => !n)} className="text-left font-semibold muted transition hover:text-[#7A1E2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1E2B] rounded">{night ? 'Дневной город' : 'Ночной город'}</button></div>
            </nav>
          </div>
          <p className="mt-14 select-none text-center font-display text-[11.5vw] font-extrabold leading-none text-outline opacity-25" aria-hidden>TARAZ EVENTS</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-xs muted">
            <span>© 2026 Taraz Events · Сделано с любовью к Таразу</span><span>Версия 2.0 · Запуск — Наурыз 2027</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AnimatePresence>{selected && <EventModal ev={selected} isFav={favs.has(selected.id)} onFav={() => toggleFav(selected.id)} onClose={() => setSelected(null)} onWaitlist={() => { setSelected(null); scrollTo('#waitlist'); }} />}</AnimatePresence>
      <AnimatePresence>{refOpen && (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Закрыть референс" className="absolute inset-0 bg-[#14060B]/80 backdrop-blur-sm" onClick={() => setRefOpen(false)} />
          <motion.figure initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} className="relative w-full max-w-3xl overflow-hidden rounded-[26px] bg-[#FFFDF8] shadow-2xl">
            <img src="/app-reference.png" alt="Настоящие экраны приложения Taraz Events: регистрация, вход и приветственный экран" className="w-full" />
            <figcaption className="flex items-center justify-between gap-4 p-5 text-[#2A1418]"><span className="text-sm"><b>Источник идентичности.</b> <span className="text-[#2A1418]/60">Настоящие экраны Taraz Events: кремовый фон, бордо, арка-логотип и беседка Парка Первого Президента. Лендинг продолжает этот язык, а не копирует его.</span></span>
              <button onClick={() => setRefOpen(false)} aria-label="Закрыть" className="grid shrink-0 place-items-center w-10 h-10 rounded-full bg-[#7A1E2B] text-white transition hover:bg-[#8E2436] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7A1E2B]/30"><X size={18} /></button></figcaption>
          </motion.figure>
        </motion.div>)}
      </AnimatePresence>
    </div>
  );
}
