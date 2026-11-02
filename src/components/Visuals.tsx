import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import './visuals.css';

function Phone({ children, tilt = 0, delay = 0, className = '' }: { children: ReactNode; tilt?: number; delay?: number; className?: string }) {
  return (
    <motion.div className={`phone ${className}`} initial={{ opacity: 0, y: 50, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: tilt }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 110, damping: 16, delay }}>
      <div className="phone-status"><span>9:41</span><i /></div>
      <div className="phone-body">{children}</div>
      <span className="phone-home" />
    </motion.div>
  );
}
const Check = ({ c = '#12a150' }: { c?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><circle cx="8" cy="8" r="8" fill={c} /><path d="M4.5 8.2l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/* ───────── PAYMENTS ───────── */
const PayPaste = () => (
  <>
    <p className="pv-step mono">1 / 4</p>
    <h4 className="pv-h">Paste their details</h4>
    <div className="pv-paste"><span className="pv-ic">⧉</span><b>Tap to paste</b><small>name, bank, account…</small></div>
    <div className="pv-clip"><small>From your clipboard</small><span>“Hi! My details: Amina Uwase…”</span><b>Paste</b></div>
  </>
);
const PayFound = () => (
  <>
    <p className="pv-step mono">3 / 4</p>
    <div className="pv-av">AU</div>
    <h4 className="pv-h center">Amina Uwase <Check /></h4>
    <p className="pv-sub center">Bank of Kigali · •••• 8890</p>
    <div className="pv-ok"><Check /> <span><b>Name matches the account</b><br />The bank confirmed it.</span></div>
    <div className="pv-rows"><p><span>Bank</span><b>Bank of Kigali</b></p><p><span>Account</span><b>0004 5521 8890</b></p></div>
    <div className="pv-btn">Continue</div>
  </>
);
const PaySent = () => (
  <>
    <div className="pv-burst"><Check /></div>
    <h4 className="pv-h center big">Money sent!</h4>
    <p className="pv-sub center">€150.00 is on its way to Amina.</p>
    <div className="pv-rows track"><p><Check /><b>Sent from your account</b></p><p><Check /><b>Bank received it</b></p><p><span className="pv-dash" /><b className="violet">Delivering…</b></p></div>
    <div className="pv-btn">Done</div>
  </>
);

/* ───────── CLINIC ───────── */
const ClinicAsk = () => (
  <>
    <p className="pv-step mono">STEP 1</p>
    <h4 className="pv-h">What’s going on?</h4>
    <div className="cv-input">sore throat for 3 days<i /></div>
    <p className="pv-sub">Suggested visit</p>
    <div className="cv-match"><b>General check-up</b><small>15 min · in person</small><Check c="#16130f" /></div>
  </>
);
const ClinicSlots = () => (
  <>
    <p className="pv-step mono">STEP 2</p>
    <h4 className="pv-h">Pick a time</h4>
    <div className="cv-days">{['Mon 12', 'Tue 13', 'Wed 14'].map((d, i) => <span key={d} className={i === 1 ? 'on' : ''}>{d}</span>)}</div>
    <div className="cv-slots">{['09:00', '09:30', '10:15', '11:00', '14:30', '16:00'].map((s, i) => <span key={s} className={i === 2 ? 'on' : i === 4 ? 'off' : ''}>{s}</span>)}</div>
    <div className="pv-btn lilac">Book 10:15</div>
  </>
);
const ClinicDone = () => (
  <>
    <div className="pv-burst lilac"><Check c="#16130f" /></div>
    <h4 className="pv-h center big">You’re booked</h4>
    <p className="pv-sub center">Tue 13, 10:15 · Dr. Mukamana</p>
    <div className="pv-rows"><p><span>Reminder</span><b>The evening before</b></p><p><span>Directions</span><b>Open in Maps →</b></p></div>
    <div className="pv-btn ghost">Add to calendar</div>
  </>
);

/* ───────── SHOP ───────── */
const ShopToday = () => (
  <>
    <p className="pv-step mono">TODAY</p>
    <h4 className="pv-h big">RWF 48,600</h4>
    <p className="pv-sub">23 sales · better than Tuesday</p>
    <div className="sv-bars">{[40, 62, 35, 80, 55, 92, 70].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
    <div className="sv-alert">⚠ Cooking oil is running low <b>3 left</b></div>
  </>
);
const ShopTap = () => (
  <>
    <p className="pv-step mono">TAP TO SELL</p>
    <div className="sv-grid">{['Bread', 'Soap', 'Eggs', 'Sugar', 'Soda', 'Oil'].map((p, i) => <span key={p} className={i === 0 ? 'on' : ''}><b>{p}</b><small>{[600, 800, 200, 1500, 500, 2400][i]}</small></span>)}</div>
    <div className="pv-btn sand">+1 Bread logged</div>
  </>
);

export function Cover({ slug }: { slug: string }) {
  if (slug === 'design-system') {
    return (
      <div className="cover cover-ds">
        <div className="ds-board">
          <div className="ds-tokens">{['#ff5b2e', '#c9b8ff', '#16130f', '#e7dfd1', '#12a150'].map((c) => <i key={c} style={{ background: c }} />)}</div>
          <div className="ds-type"><b>Aa</b><span>Display / 48</span><span>Body / 16</span><span>Label / 12</span></div>
          <div className="ds-comps">
            <span className="ds-b p">Primary</span><span className="ds-b s">Secondary</span><span className="ds-b g">Ghost</span>
            <span className="ds-in">Email address</span>
            <span className="ds-tg"><i /></span><span className="ds-chip">Chip ×</span><span className="ds-chk">✓</span>
          </div>
        </div>
      </div>
    );
  }
  const sets: Record<string, ReactNode[]> = {
    payments: [<PayPaste key="a" />, <PayFound key="b" />, <PaySent key="c" />],
    'clinic-booking': [<ClinicAsk key="a" />, <ClinicSlots key="b" />, <ClinicDone key="c" />],
    'shop-tools': [<ShopTap key="a" />, <ShopToday key="b" />],
  };
  const screens = sets[slug] ?? [];
  return (
    <div className={`cover cover-${slug}`}>
      {screens.map((s, i) => (
        <Phone key={i} tilt={[-3, 0, 3][i] ?? 0} delay={i * 0.12} className={i === 1 ? 'mid' : ''}>{s}</Phone>
      ))}
    </div>
  );
}

export function BeforeAfter({ slug, after }: { slug: string; after: boolean }) {
  if (slug === 'payments') {
    return after ? <Phone><PayPaste /></Phone> : (
      <Phone>
        <h4 className="pv-h">Add recipient</h4>
        {['FULL NAME', 'BANK NAME ▾', 'ACCOUNT NUMBER', 'IBAN', 'SWIFT / BIC', 'BANK ADDRESS', 'REFERENCE'].map((f, i) => (
          <div key={f} className={`bf-field ${i === 2 ? 'err' : ''}`}><small className="mono">{f}</small>{i === 2 && <em>Account number is invalid</em>}</div>
        ))}
      </Phone>
    );
  }
  if (slug === 'clinic-booking') {
    return after ? <Phone><ClinicSlots /></Phone> : (
      <Phone>
        <div className="bf-call"><span className="pv-av dark">CL</span><b>Calling the clinic…</b><span className="mono">12:43</span><small className="mono">ON HOLD</small><p>You are number 7 in line</p><p className="hand">♫ hold music, again</p><span className="bf-hang">×</span></div>
      </Phone>
    );
  }
  if (slug === 'shop-tools') {
    return after ? <Phone><ShopToday /></Phone> : (
      <div className="bf-notebook hand">
        <b>Sales — Tuesday</b>
        {['2 bread … 1,200', '1 soap … 800', '3 eggs … ??', 'sugar (owe)', '1 bread … 600', 'cooking oil?? out', '2 soda … 1,000', 'total = ?'].map((l) => <p key={l}>{l}</p>)}
      </div>
    );
  }
  // design system
  return after ? (
    <div className="bf-ds after">
      <p className="mono">ONE LIBRARY · EVERY PRODUCT</p>
      {[0, 1, 2, 3, 4].map((i) => <span key={i} className="ds-b p">Submit</span>)}
    </div>
  ) : (
    <div className="bf-ds">
      <p className="mono">“PRIMARY” BUTTON? ONE FROM EACH PRODUCT</p>
      <span className="v1">Submit</span><span className="v2">SUBMIT</span><span className="v3">Submit →</span><span className="v4">submit</span><span className="v5">Send it</span>
    </div>
  );
}

/** Tiny static screenshots that sit on the folder papers. */
function TinyPhone({ children }: { children: ReactNode }) {
  return (
    <div className="phone tiny">
      <div className="phone-status"><span>9:41</span><i /></div>
      <div className="phone-body">{children}</div>
    </div>
  );
}
export function MiniScreens({ slug }: { slug: string }) {
  if (slug === 'design-system') {
    return (
      <div className="mini mini-ds">
        <div className="mini-ds-side"><b>Component Library</b>{['Buttons', 'Inputs', 'Cards', 'Tokens', 'Icons'].map((x, i) => <span key={x} className={i === 0 ? 'on' : ''}>{x}</span>)}</div>
        <div className="mini-ds-main">
          <div className="mini-ds-row"><span className="ds-b p">Primary</span><span className="ds-b s">Secondary</span><span className="ds-b g">Ghost</span></div>
          <div className="mini-ds-row"><span className="ds-in">Email address</span><span className="ds-tg"><i /></span></div>
          <div className="mini-ds-sw">{['#ff5b2e', '#c9b8ff', '#f3eee4', '#12a150', '#3a332b'].map((c) => <i key={c} style={{ background: c }} />)}</div>
        </div>
      </div>
    );
  }
  const sets: Record<string, ReactNode[]> = {
    payments: [<PayPaste key="a" />, <PayFound key="b" />, <PaySent key="c" />],
    'clinic-booking': [<ClinicAsk key="a" />, <ClinicSlots key="b" />, <ClinicDone key="c" />],
    'shop-tools': [<ShopToday key="a" />, <ShopTap key="b" />, <ShopToday key="c" />],
  };
  return (
    <div className={`mini mini-${slug}`}>
      {(sets[slug] ?? []).map((s, i) => <TinyPhone key={i}>{s}</TinyPhone>)}
    </div>
  );
}
