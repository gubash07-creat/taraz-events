import { AnimatePresence, motion } from 'framer-motion';
import { BatteryFull, Bell, CalendarDays, Compass, Heart, Home, MapPin, Music2, QrCode, Search, Signal, Sparkles, Ticket, User, Wifi } from 'lucide-react';
import type { EventItem } from '../lib/types';

export function ArchLogo({ size = 34, color = '#7A1E2B', bg = '#FFFDF8' }: { size?: number; color?: string; bg?: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-[28%] shadow-[0_6px_18px_rgba(122,30,43,0.16)]" style={{ width: size, height: size, background: bg }} aria-hidden>
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        <path d="M5 21v-8.2C5 8.4 8.1 5 12 5s7 3.4 7 7.8V21" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M9.2 21v-6.4c0-2 1.2-3.4 2.8-3.4s2.8 1.4 2.8 3.4V21" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-[#241318]">
      <span className="text-[11px] font-bold tracking-wide">9:41</span>
      <span className="flex items-center gap-1.5"><Signal size={12} /><Wifi size={12} /><BatteryFull size={15} /></span>
    </div>
  );
}

function MiniCard({ ev, i }: { ev: EventItem; i: number }) {
  return (
    <div className="flex gap-2.5 rounded-2xl bg-white p-2.5 shadow-[0_4px_16px_rgba(80,20,30,0.07)] border border-[#7A1E2B]/8">
      <div className="w-11 shrink-0 rounded-xl flex flex-col items-center justify-center text-white" style={{ background: ev.color }}>
        <span className="font-display text-[13px] leading-none">{ev.day_num}</span>
        <span className="text-[8px] uppercase tracking-wider opacity-90">{ev.month_label}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-extrabold text-[#2A1418] leading-tight">{ev.title}</p>
        <p className="mt-1 flex items-center gap-1 text-[9px] text-[#2A1418]/55"><MapPin size={9} />{ev.venue}</p>
        <p className="text-[9px] font-bold" style={{ color: ev.color }}>{ev.is_free ? 'Бесплатно' : `от ${ev.price.toLocaleString('ru-RU')} ₸`} · {ev.time_label}</p>
      </div>
      <Heart size={13} className={i === 0 ? 'fill-[#7A1E2B] text-[#7A1E2B] shrink-0 mt-0.5' : 'text-[#2A1418]/25 shrink-0 mt-0.5'} />
    </div>
  );
}

const FALLBACK_NOTE = 'События подгрузятся из афиши города';

function HomeScreen({ events }: { events: EventItem[] }) {
  const list = events.slice(0, 3);
  return (
    <div className="px-4 pb-3">
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2"><ArchLogo size={30} /><div><p className="text-[13px] font-black leading-none text-[#2A1418]">TarazEvents</p><p className="text-[8px] font-bold tracking-[0.14em] text-[#7A1E2B] mt-1">ВЕРСИЯ 2.0 • ТАРАЗ</p></div></div>
        <span className="relative grid place-items-center w-8 h-8 rounded-full bg-white shadow-sm border border-[#7A1E2B]/10"><Bell size={14} className="text-[#2A1418]" /><span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#7A1E2B]" /></span>
      </div>
      <div className="mt-4 rounded-[22px] bg-[#7A1E2B] p-3.5 text-[#FFF6E8] relative overflow-hidden">
        <svg className="absolute -right-2 -bottom-3 w-28 opacity-25" viewBox="0 0 120 70" fill="none" stroke="#FFF6E8" strokeWidth="2"><path d="M10 62h100M22 62V38l38-22 38 22v24M34 62V44h52v18M60 16v46M22 38h76"/></svg>
        <p className="text-[9px] font-bold tracking-[0.16em] opacity-80">ПАРК ПЕРВОГО ПРЕЗИДЕНТА</p>
        <p className="font-serif2 italic text-[21px] leading-tight mt-1">Открой свой Тараз</p>
        <p className="text-[10px] opacity-85 mt-1 max-w-[170px]">Афиша, места и билеты — в одном приложении</p>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-full bg-white px-3.5 py-2.5 shadow-sm border border-[#7A1E2B]/10 text-[#2A1418]/40"><Search size={13} /><span className="text-[11px]">Куда сходить сегодня?</span></div>
      <div className="mt-3 flex gap-1.5">{['Все', 'Концерты', 'Бесплатно', 'Спорт'].map((c, i) => <span key={c} className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${i === 0 ? 'bg-[#7A1E2B] text-white' : 'bg-white text-[#2A1418]/60 border border-[#7A1E2B]/10'}`}>{c}</span>)}</div>
      <p className="mt-3.5 text-[11px] font-black text-[#2A1418]">Скоро в городе</p>
      <div className="mt-2 space-y-2">{list.length ? list.map((ev, i) => <MiniCard key={ev.id} ev={ev} i={i} />) : <p className="text-[10px] text-[#2A1418]/50">{FALLBACK_NOTE}</p>}</div>
    </div>
  );
}

function SearchScreen({ events }: { events: EventItem[] }) {
  return (
    <div className="px-4 pb-3">
      <p className="mt-3 font-display text-[15px] text-[#2A1418]">Поиск по городу</p>
      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-3 shadow-sm border-2 border-[#7A1E2B]/25 text-[#2A1418]"><Search size={14} className="text-[#7A1E2B]" /><span className="text-[12px] font-semibold">концерт под открытым небом</span><span className="ml-auto w-[2px] h-4 bg-[#7A1E2B] animate-pulse" /></div>
      <div className="mt-3 flex flex-wrap gap-1.5">{['Сегодня', 'Выходные', 'Бесплатно', 'Рядом', 'Для детей'].map((c, i) => <span key={c} className={`rounded-full px-2.5 py-1.5 text-[9px] font-bold ${i < 2 ? 'bg-[#7A1E2B] text-white' : 'bg-white border border-[#7A1E2B]/12 text-[#2A1418]/65'}`}>{c}</span>)}</div>
      <p className="mt-4 text-[10px] font-bold tracking-wider text-[#2A1418]/45">НАЙДЕНО · {events.length || 12} СОБЫТИЙ</p>
      <div className="mt-2 space-y-2">{events.slice(0, 4).map((ev, i) => <MiniCard key={ev.id} ev={ev} i={i} />)}</div>
      <div className="mt-3 rounded-2xl border border-dashed border-[#7A1E2B]/30 p-3 flex gap-2 items-center"><Compass size={16} className="text-[#7A1E2B]" /><p className="text-[10px] text-[#2A1418]/70 leading-snug">Фильтры по району, цене и настроению — без лишних вкладок</p></div>
    </div>
  );
}

function AiScreen({ events }: { events: EventItem[] }) {
  const pick = events[1] || events[0];
  return (
    <div className="px-4 pb-3">
      <div className="mt-3 flex items-center gap-2"><span className="grid place-items-center w-8 h-8 rounded-full bg-[#7A1E2B] text-white"><Sparkles size={15} /></span><div><p className="text-[13px] font-black text-[#2A1418]">AI-гид Тараза</p><p className="text-[9px] text-emerald-700 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> знает город и твой вкус</p></div></div>
      <div className="mt-4 ml-auto max-w-[210px] rounded-[18px] rounded-br-md bg-[#7A1E2B] text-white px-3.5 py-2.5 text-[11px] leading-snug">Хочу вечер пятницы: живая музыка, недалеко от центра и без толпы</div>
      <div className="mt-2.5 max-w-[225px] rounded-[18px] rounded-bl-md bg-white border border-[#7A1E2B]/10 px-3.5 py-2.5 text-[11px] leading-snug text-[#2A1418]/85 shadow-sm">Подобрал три варианта. Ближе всего — акустика на закате, а после неё удобно заглянуть на ночной маркет.</div>
      {pick && <div className="mt-3"><MiniCard ev={pick} i={0} /></div>}
      <div className="mt-3 flex gap-1.5">{['Спокойный вечер', 'С друзьями', 'Свидание'].map(c => <span key={c} className="rounded-full bg-white border border-[#7A1E2B]/15 px-2.5 py-1.5 text-[9px] font-bold text-[#7A1E2B]">{c}</span>)}</div>
      <div className="mt-3 rounded-2xl bg-[#F1E7D3] p-3 text-[10px] leading-snug text-[#2A1418]/75"><span className="font-black text-[#7A1E2B]">Почему это тебе: </span>ты сохранял джаз, открытые площадки и события после 19:00.</div>
    </div>
  );
}

function FavScreen({ events }: { events: EventItem[] }) {
  return (
    <div className="px-4 pb-3">
      <p className="mt-3 font-display text-[15px] text-[#2A1418]">Избранное</p>
      <p className="text-[10px] text-[#2A1418]/55 mt-1">Город напомнит за день до начала</p>
      <div className="mt-3 space-y-2">{events.slice(0, 4).map((ev, i) => <MiniCard key={ev.id} ev={ev} i={i} />)}</div>
      <div className="mt-3 rounded-[20px] bg-[#2A1418] text-[#FFF6E8] p-3.5 flex items-center gap-3"><CalendarDays size={20} className="text-[#E8C98A]" /><div><p className="text-[11px] font-extrabold">Напоминание включено</p><p className="text-[9px] opacity-70">Мы напишем, когда откроется вход</p></div></div>
    </div>
  );
}

function QrPattern() {
  const cells = Array.from({ length: 21 * 21 }, (_, idx) => {
    const x = idx % 21, y = Math.floor(idx / 21);
    const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    if (finder) { const lx = x > 13 ? x - 14 : x, ly = y > 13 ? y - 14 : y; return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx > 1 && lx < 5 && ly > 1 && ly < 5); }
    return ((x * 31 + y * 17 + x * y * 7) % 11) < 5;
  });
  return <div className="grid grid-cols-[repeat(21,1fr)] gap-0 w-[118px] h-[118px] bg-white p-1.5 rounded-lg" aria-hidden>{cells.map((f, i) => <span key={i} style={{ background: f ? '#241318' : 'transparent' }} />)}</div>;
}

function TicketScreen({ events }: { events: EventItem[] }) {
  const ev = events[0];
  return (
    <div className="px-4 pb-3">
      <p className="mt-3 font-display text-[15px] text-[#2A1418]">Мой билет</p>
      <div className="mt-3 overflow-hidden rounded-[22px] bg-white shadow-[0_10px_30px_rgba(80,20,30,0.12)] border border-[#7A1E2B]/10">
        <div className="p-3.5 text-white" style={{ background: ev?.color || '#7A1E2B' }}><p className="text-[8px] font-bold tracking-[0.18em] opacity-85">TARAZ EVENTS • ВХОД</p><p className="font-serif2 italic text-[19px] leading-tight mt-1">{ev?.title || 'Вечер города'}</p><p className="text-[10px] opacity-90 mt-1">{ev ? `${ev.day_num} ${ev.month_label} · ${ev.time_label} · ${ev.venue}` : 'Тараз'}</p></div>
        <div className="relative flex justify-center py-4"><span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FBF6EE]" /><span className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#FBF6EE]" /><QrPattern /></div>
        <p className="pb-3 text-center text-[9px] font-bold tracking-[0.22em] text-[#2A1418]/45">TZ-2027 · РЯД 7 · МЕСТО 12</p>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-600/20 px-3 py-2.5 text-emerald-900"><QrCode size={15} /><p className="text-[10px] font-bold">Билет офлайн — QR откроется без интернета</p></div>
    </div>
  );
}

export const SCREEN_TITLES = ['Главная афиша', 'Умный поиск', 'AI-гид', 'Избранное', 'Билет и QR'];

export default function Phone({ screen, events }: { screen: number; events: EventItem[] }) {
  const screens = [<HomeScreen key="h" events={events} />, <SearchScreen key="s" events={events} />, <AiScreen key="a" events={events} />, <FavScreen key="f" events={events} />, <TicketScreen key="t" events={events} />];
  const nav = [{ icon: Home, s: 0 }, { icon: Search, s: 1 }, { icon: Sparkles, s: 2 }, { icon: Heart, s: 3 }, { icon: Ticket, s: 4 }];
  return (
    <div className="relative mx-auto w-[302px] max-w-[86vw] rounded-[46px] bg-[#1B1015] p-[9px] shadow-[0_40px_90px_-18px_rgba(40,8,16,0.55)] ring-1 ring-white/25">
      <div className="absolute left-1/2 top-[9px] z-30 h-[22px] w-[96px] -translate-x-1/2 rounded-b-2xl bg-[#1B1015]" />
      <div className="relative h-[604px] overflow-hidden rounded-[38px] bg-[#FBF6EE]">
        <StatusBar />
        <AnimatePresence mode="wait">
          <motion.div key={screen} initial={{ opacity: 0, x: 34, filter: 'blur(3px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -28, filter: 'blur(3px)' }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} className="h-[512px] overflow-hidden">
            {screens[screen]}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-around rounded-full bg-white/92 px-2 py-2 shadow-[0_10px_28px_rgba(80,20,30,0.14)] border border-[#7A1E2B]/10 backdrop-blur">
          {nav.map(({ icon: Icon, s }) => <span key={s} className={`grid place-items-center w-9 h-9 rounded-full transition-all ${screen === s ? 'bg-[#7A1E2B] text-white scale-105' : 'text-[#2A1418]/40'}`}><Icon size={17} /></span>)}
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[38px] ring-1 ring-inset ring-black/5" />
      </div>
      <Music2 className="hidden" />
    </div>
  );
}
