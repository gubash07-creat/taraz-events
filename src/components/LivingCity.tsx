import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';
import Magnetic from './Magnetic';

type Pin = { id: number; title: string; venue: string; x: number; y: number };

const BUILDINGS = [
  { x: 40, y: 218, w: 62, h: 118 }, { x: 112, y: 188, w: 48, h: 148 }, { x: 690, y: 178, w: 58, h: 158 },
  { x: 758, y: 208, w: 44, h: 128 }, { x: 935, y: 196, w: 66, h: 140 }, { x: 1012, y: 226, w: 48, h: 110 },
  { x: 520, y: 205, w: 42, h: 131 }, { x: 250, y: 232, w: 54, h: 104 },
];

function Windows({ night, pulseOn }: { night: boolean; pulseOn: boolean }) {
  return (
    <g>
      {BUILDINGS.map((b, bi) => Array.from({ length: Math.floor(b.w / 14) * Math.floor(b.h / 18) }, (_, i) => {
        const col = i % Math.floor(b.w / 14), row = Math.floor(i / Math.floor(b.w / 14));
        const lit = night || pulseOn ? ((i * 7 + bi * 13) % 10) > 3 : ((i * 11 + bi) % 13) === 0;
        return <rect key={`${bi}-${i}`} x={b.x + 7 + col * 14} y={b.y + 10 + row * 18} width="6" height="8" rx="1.5" fill={lit ? '#FFD98A' : 'rgba(255,246,232,0.14)'} opacity={lit ? 0.95 : 0.5} style={{ transition: `opacity .5s ease ${(i % 9) * 70}ms` }} />;
      }))}
    </g>
  );
}

export default function LivingCity({ night, pins, onPulse }: { night: boolean; pins: Pin[]; onPulse: () => void }) {
  const [pulseOn, setPulseOn] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [activePin, setActivePin] = useState<Pin | null>(null);

  const firePulse = () => {
    setPulseKey(k => k + 1); setPulseOn(true); onPulse();
    window.setTimeout(() => setPulseOn(false), 2600);
  };
  const tapCity = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const item = { id: Date.now(), x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
    setRipples(prev => [...prev.slice(-4), item]);
    window.setTimeout(() => setRipples(prev => prev.filter(p => p.id !== item.id)), 1300);
  };

  const sil = night ? '#2A1220' : '#8A5A52';
  const silFar = night ? '#1E0B18' : '#C99B84';
  const ground = night ? '#170812' : '#E9D9BE';

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] shadow-[0_30px_80px_-30px_rgba(60,10,20,0.45)] cursor-crosshair select-none" onClick={tapCity} role="img" aria-label="Интерактивная панорама Тараза: нажмите, чтобы разбудить город">
      <div className="absolute inset-0 transition-all duration-1000" style={{ background: night ? 'linear-gradient(180deg,#120614 0%,#33101F 52%,#57202A 100%)' : 'linear-gradient(180deg,#F7DFC0 0%,#FBEEDC 55%,#F3DFC2 100%)' }} />
      {/* sun / moon */}
      <motion.div className="absolute rounded-full" animate={{ x: night ? 0 : 0 }} style={{ width: 74, height: 74, right: '12%', top: 34, background: night ? '#F6E7C8' : '#F2B25C', boxShadow: night ? '0 0 60px 18px rgba(246,231,200,.25)' : '0 0 70px 24px rgba(242,178,92,.45)' }} transition={{ duration: 1 }}>
        {night && <><span className="absolute left-3 top-4 w-3 h-3 rounded-full bg-[#DCC9A4]/70" /><span className="absolute left-8 top-9 w-2 h-2 rounded-full bg-[#DCC9A4]/60" /></>}
      </motion.div>
      {night && <>{[[18, 40], [30, 90], [55, 30], [70, 70], [88, 26], [44, 66]].map(([l, t], i) => <span key={i} className="absolute w-1 h-1 rounded-full bg-[#FFF3D6] animate-pulse" style={{ left: `${l}%`, top: t, animationDelay: `${i * 0.4}s` }} />)}</>}
      {/* birds */}
      <div className="city-birds absolute left-[16%] top-[16%] flex gap-6 opacity-70" aria-hidden>{[0, 1, 2].map(i => <svg key={i} width="22" height="10" viewBox="0 0 22 10" fill="none" stroke={night ? '#F6E7C8' : '#7A3B34'} strokeWidth="1.8" strokeLinecap="round"><path d="M1 8C5 3 8 3 11 7c3-4 6-4 10 1" /></svg>)}</div>

      <svg viewBox="0 0 1100 470" className="relative block h-[340px] w-full sm:h-[430px]" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <path d="M0 250 L140 168 L260 224 L390 138 L540 218 L690 150 L830 222 L960 160 L1100 232 V470 H0Z" fill={silFar} opacity="0.55" />
        <path d="M0 292 L180 226 L350 278 L520 214 L700 276 L880 224 L1100 286 V470 H0Z" fill={silFar} opacity="0.75" />
        {BUILDINGS.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="5" fill={sil} />)}
        {/* Aisha-Bibi mausoleum */}
        <g fill={night ? '#3A1828' : '#A9675C'}>
          <rect x="330" y="272" width="92" height="88" rx="6" />
          <path d="M342 272c4-34 16-52 34-52s30 18 34 52Z" />
          <rect x="368" y="196" width="16" height="28" rx="4" />
          <path d="M376 226v52M358 282v42M394 282v42" stroke={night ? '#FFD98A' : '#FBEEDC'} strokeWidth="5" strokeLinecap="round" opacity="0.75" />
        </g>
        {/* Central arch — brand portal */}
        <g>
          <path d="M596 360V238c0-44 24-70 56-70s56 26 56 70v122" fill="none" stroke={pulseOn ? '#FFD98A' : night ? '#E8C98A' : '#7A1E2B'} strokeWidth="13" strokeLinecap="round" style={{ transition: 'stroke .5s' }} />
          <path d="M622 360v-96c0-24 12-38 30-38s30 14 30 38v96" fill="none" stroke={pulseOn ? '#FFF3D6' : night ? '#B97F63' : '#A64B3F'} strokeWidth="8" strokeLinecap="round" style={{ transition: 'stroke .5s' }} />
          {pulseOn && <circle cx="652" cy="240" r="16" fill="#FFD98A" opacity="0.9" />}
        </g>
        {/* gazebo from the app welcome screen */}
        <g stroke={night ? '#E8C98A' : '#7A4A3E'} strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M820 302l52-34 52 34M828 302h88M836 302v42M908 302v42M872 268v76M836 322h72M828 344h88" />
          <path d="M818 344h108" strokeWidth="6" />
        </g>
        <Windows night={night} pulseOn={pulseOn} />
        <rect x="0" y="360" width="1100" height="110" fill={ground} />
        <path d="M0 402 C240 388 420 414 640 400 C820 390 960 408 1100 398 L1100 470 H0Z" fill={night ? '#0F050C' : '#DCC7A2'} />
        <path d="M0 404 C260 392 520 412 1100 400" stroke={night ? '#E8C98A' : '#FFF6E8'} strokeWidth="3" strokeDasharray="26 20" opacity="0.8" fill="none" />
        {[[150, 352], [300, 356], [470, 350], [760, 354], [980, 352]].map(([x, y], i) => <g key={i}><path d={`M${x} ${y}v-26M${x} ${y - 26}c-10-2-14-10-12-18 8 0 12 4 14 10 2-7 7-11 14-10 1 8-3 16-12 18Z`} fill={night ? '#24101C' : '#7C8B6F'} /></g>)}
        <g className="city-car"><rect x="-70" y="382" width="58" height="20" rx="8" fill={night ? '#E8C98A' : '#7A1E2B'} /><rect x="-52" y="370" width="30" height="16" rx="7" fill={night ? '#F6E7C8' : '#A63A4A'} /><circle cx="-52" cy="404" r="7" fill="#241318" /><circle cx="-24" cy="404" r="7" fill="#241318" /></g>
        <g className="city-car-rev"><rect x="-80" y="424" width="66" height="22" rx="8" fill={night ? '#8E5A44' : '#C19A5B'} /><circle cx="-58" cy="448" r="7" fill="#241318" /><circle cx="-28" cy="448" r="7" fill="#241318" /></g>
      </svg>

      {/* pulse rings from the arch */}
      <AnimatePresence>{pulseOn && [0, 1, 2].map(i => <motion.span key={`${pulseKey}-${i}`} className="pointer-events-none absolute rounded-full border-2 border-[#FFD98A]" style={{ left: '59%', top: '46%' }} initial={{ width: 20, height: 20, x: '-50%', y: '-50%', opacity: 0.9 }} animate={{ width: 720, height: 720, opacity: 0 }} transition={{ duration: 2.2, delay: i * 0.35, ease: 'easeOut' }} />)}</AnimatePresence>
      {/* tap ripples */}
      {ripples.map(r => <motion.span key={r.id} className="pointer-events-none absolute rounded-full border-2 border-[#FFD98A]" style={{ left: `${r.x}%`, top: `${r.y}%` }} initial={{ width: 10, height: 10, x: '-50%', y: '-50%', opacity: 1 }} animate={{ width: 190, height: 190, opacity: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} />)}

      {/* event pins */}
      {pins.map((pin, i) => (
        <motion.button key={pin.id} type="button" aria-label={`${pin.title}, ${pin.venue}`} onClick={(e) => { e.stopPropagation(); setActivePin(pin); }} className="absolute z-10 -translate-x-1/2 -translate-y-full" style={{ left: `${pin.x}%`, top: `${pin.y}%` }} animate={pulseOn ? { y: [0, -14, 0], scale: [1, 1.25, 1] } : { y: [0, -6, 0] }} transition={pulseOn ? { duration: 0.7, delay: i * 0.09 } : { duration: 2.6, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}>
          <span className={`grid place-items-center w-9 h-9 rounded-full rounded-br-none rotate-[-45deg] shadow-lg ring-4 transition-colors ${pulseOn ? 'bg-[#E8A33D] ring-[#FFD98A]/40' : 'bg-[#7A1E2B] ring-white/35'}`}><MapPin size={16} className="rotate-45 text-white" /></span>
        </motion.button>
      ))}
      <AnimatePresence>{activePin && <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }} className="absolute left-4 bottom-24 z-20 max-w-[250px] rounded-2xl bg-[#FFFDF8] p-3.5 text-left shadow-2xl" onClick={e => e.stopPropagation()}><p className="text-[10px] font-black tracking-[0.14em] text-[#7A1E2B]">СЕЙЧАС В ГОРОДЕ</p><p className="mt-1 text-sm font-extrabold text-[#2A1418] leading-tight">{activePin.title}</p><p className="text-xs text-[#2A1418]/60 mt-0.5">{activePin.venue}</p></motion.div>}</AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5">
        <div className="rounded-2xl bg-black/25 px-4 py-3 text-[#FFF6E8] backdrop-blur-sm max-w-[340px]">
          <p className="font-display text-[13px] sm:text-sm leading-snug">{pulseOn ? 'Город проснулся. Видишь, как загораются окна?' : night ? 'Ночной Тараз только начинает звучать' : 'Нажми на город — он ответит'}</p>
          <p className="text-[11px] opacity-80 mt-1">Касание рождает волну, а пины — настоящие события из афиши ниже.</p>
        </div>
        <Magnetic strength={0.4}>
          <button type="button" onClick={(e) => { e.stopPropagation(); firePulse(); }} className="group inline-flex items-center gap-2.5 rounded-full bg-[#7A1E2B] px-6 py-3.5 text-sm font-extrabold text-[#FFF6E8] shadow-[0_18px_36px_-10px_rgba(122,30,43,0.7)] transition-colors hover:bg-[#8E2436] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E8C98A]">
            <Zap size={17} className="transition-transform group-hover:scale-125 group-active:scale-90" /> Зажечь город
          </button>
        </Magnetic>
      </div>
      {/* equalizer signature */}
      <div className="absolute right-5 top-5 flex h-8 items-end gap-[3px]" aria-hidden>{[0.9, 0.5, 1, 0.65, 0.8, 0.45, 0.95, 0.6].map((h, i) => <span key={i} className={`w-[3px] rounded-full ${pulseOn ? 'eq-bar bg-[#FFD98A]' : night ? 'bg-[#E8C98A]/70' : 'bg-[#7A1E2B]/60'}`} style={{ height: `${h * 100}%`, animationDelay: `${i * 0.11}s`, animationDuration: pulseOn ? '0.45s' : '1.15s' }} />)}</div>
    </div>
  );
}
