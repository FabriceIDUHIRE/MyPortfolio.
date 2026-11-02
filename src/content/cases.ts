export type CaseStudy = {
  slug: string;
  file: string;
  index: number;
  label: string; // e.g. FINTECH · 2025
  color: string;
  ink: string;
  title: [string, string]; // [plain part, italic word]
  intro: string;
  role: string;
  year: string;
  platform: string;
  tags: string[];
  status?: string;
  problem: { title: string; body: string; steps: string[]; aside: string };
  stakes: { title: string; body: string; items: { wrong: string; response: string }[] };
  research: { title: string; body: string; insight: string };
  idea: { title: string; body: string; steps: { t: string; d: string }[]; aside: string };
  result: { title: string; body: string; before: string; after: string };
  takeaways: { items: string[]; quote: string };
};

export const cases: CaseStudy[] = [
  {
    slug: 'payments',
    file: 'payments.fig',
    index: 1,
    label: 'FINTECH · 2025',
    color: '#ff5b2e',
    ink: '#16130f',
    title: ['Making money transfers feel', 'effortless'],
    intro:
      'Sending money abroad meant copying long bank details from one app into another, and one wrong digit could send money to the wrong place. I redesigned the flow so people paste once, check once, and send with confidence.',
    role: 'Lead product designer',
    year: '2025',
    platform: 'iOS & Android',
    tags: ['Payments', 'UX writing', 'Prototyping'],
    problem: {
      title: 'Copy, switch, paste, repeat.',
      body: 'To send money abroad, people copied the recipient’s details from a chat, switched to the app, and pasted them in one field at a time. Seven fields. Two apps. Plenty of chances to get one wrong.',
      steps: ['Copy from chat', 'Switch app', 'Paste one field', 'Repeat × 7'],
      aside: '(and hope you didn’t miss a digit)',
    },
    stakes: {
      title: 'One wrong digit can send real money to the wrong place.',
      body: 'Mistakes here aren’t cosmetic. A failed transfer means stress, support calls and days of waiting for a refund. Each common failure needed its own design answer.',
      items: [
        { wrong: 'A typo in the account number', response: 'Check the format as soon as it’s pasted' },
        { wrong: 'The wrong bank picked from a long list', response: 'Detect the bank from the details' },
        { wrong: 'A name that doesn’t match the account', response: 'Confirm the name with the bank before sending' },
      ],
    },
    research: {
      title: 'The details were already there. People just had to retype them.',
      body: 'Looking at how people actually shared bank details, the pattern was hard to miss: recipients almost always send their details as one message.',
      insight: 'they already have the whole message. let them paste it all at once.',
    },
    idea: {
      title: 'Paste once. The app does the rest.',
      body: 'Instead of seven fields, one box. People paste the whole message, the app pulls out the details, checks them with the bank, and shows a simple summary to confirm.',
      steps: [
        { t: 'Paste', d: 'Drop the whole message in one box.' },
        { t: 'Check', d: 'Name, bank and account are pulled out.' },
        { t: 'Review', d: 'Confirm everything at a glance.' },
        { t: 'Send', d: 'Send, with a clear receipt.' },
      ],
      aside: 'manual entry is still one tap away, for the rare odd message',
    },
    result: {
      title: 'From seven fields to one box.',
      body: 'The new flow cuts the work down to a single paste and a quick review. Flip between the two to see the difference.',
      before: '7 fields · 2 apps · 1 typo away from the wrong account',
      after: '1 box · 1 check · sent',
    },
    takeaways: {
      items: [
        'Remove the work. Don’t just tidy it up.',
        'Errors are a design problem, not a user problem.',
        'Small signals, like a sweep or a label change, build big trust.',
      ],
      quote: 'The best form is the one people don’t have to fill in.',
    },
  },
  {
    slug: 'clinic-booking',
    file: 'clinic-booking.fig',
    index: 2,
    label: 'HEALTH · 2024',
    color: '#c9b8ff',
    ink: '#16130f',
    title: ['A calmer way to book a', 'doctor'],
    intro:
      'Booking a doctor meant phone calls, hold music and guessing which slot was free. People were anxious before they even arrived. I designed a booking flow that feels calm, clear and quick, even on a bad day.',
    role: 'Product designer',
    year: '2024',
    platform: 'iOS, Android & web',
    tags: ['Health', 'Booking', 'Accessibility'],
    problem: {
      title: 'Booking felt like a chore before you even felt better.',
      body: 'Most patients booked by phone. Lines were busy every morning, open slots were hard to compare, and confirmations got lost in text messages. People gave up, or booked the wrong type of visit.',
      steps: ['Call the clinic', 'Wait on hold', 'Guess a slot', 'Call again'],
      aside: '(while feeling unwell, too)',
    },
    stakes: {
      title: 'Missed bookings mean missed care.',
      body: 'When booking is hard, people delay seeing a doctor. Every drop-off was a patient who didn’t get help when they needed it. Each one needed its own design answer.',
      items: [
        { wrong: 'Giving up on a busy phone line', response: 'Show real open slots, no calls needed' },
        { wrong: 'Booking the wrong type of visit', response: 'Ask one simple question first' },
        { wrong: 'Forgetting the appointment', response: 'A calendar invite and a gentle reminder' },
      ],
    },
    research: {
      title: 'Anxiety, not the interface, was the real problem.',
      body: 'The calmer the experience felt, the more likely people were to finish booking. Fewer choices, clearer words and real-time slots mattered more than any visual polish.',
      insight: 'people don’t want more options. they want the right one, fast.',
    },
    idea: {
      title: 'One question, then the right slot.',
      body: 'Instead of a long form, the flow starts by asking what’s going on. That one answer narrows things down to the right type of visit and shows real open slots straight away.',
      steps: [
        { t: 'Tell us', d: 'Say what’s going on in a few words.' },
        { t: 'Match', d: 'We suggest the right type of visit.' },
        { t: 'Pick', d: 'See real open slots, no calls.' },
        { t: 'Relax', d: 'Reminder and directions, sorted.' },
      ],
      aside: 'a “call me instead” button stays for anyone who prefers it',
    },
    result: {
      title: 'From hold music to three taps.',
      body: 'Booking goes from a phone queue to a few calm taps. Flip between the two to see the difference.',
      before: 'on hold · still no slot · patient gives up',
      after: '1 question · 3 taps · booked',
    },
    takeaways: {
      items: [
        'Calm is a feature. Design for how people feel.',
        'The best filter is one good question.',
        'Reminders are part of the product, not an afterthought.',
      ],
      quote: 'People don’t want more choices. They want the right one.',
    },
  },
  {
    slug: 'design-system',
    file: 'design-system.fig',
    index: 3,
    label: 'DESIGN SYSTEM · 2024',
    color: '#16130f',
    ink: '#f3eee4',
    title: ['One design system for five', 'products'],
    intro:
      'Five products, five versions of the same button. Every team rebuilt the basics and nothing quite matched. I led a shared design system so teams could stop solving the same problems and ship consistent products, faster.',
    role: 'Design system lead',
    year: '2024',
    platform: 'Web & mobile',
    tags: ['Design systems', 'Tokens', 'Documentation'],
    problem: {
      title: 'Five products. Five different buttons.',
      body: 'Each product team had built its own components. The same button existed in five shapes, colours drifted apart, and every new feature started with rebuilding the basics instead of solving real problems.',
      steps: ['Design a component', 'Hand it off', 'Rebuilt differently', 'Repeat × 5'],
      aside: '(and every team called theirs “primary”)',
    },
    stakes: {
      title: 'Inconsistency was costing time and trust.',
      body: 'People switching between products felt like they were using different companies. Teams spent weeks redoing the same work, and small UI bugs kept slipping through.',
      items: [
        { wrong: 'Five versions of every button', response: 'One shared component library' },
        { wrong: 'Colours and spacing drifting apart', response: 'Design tokens as one source of truth' },
        { wrong: 'Slow, back-and-forth handoffs', response: 'Docs that live next to the components' },
      ],
    },
    research: {
      title: 'Most of the work was already done. Just five times.',
      body: 'I audited every product and pulled each button, input and card onto one big wall. Seeing them side by side made the case better than any slide could.',
      insight: 'we don’t need new components. we need the same ones, everywhere.',
    },
    idea: {
      title: 'Build it once. Use it everywhere.',
      body: 'Start with tokens, build a small core of components, and grow the system with the teams instead of for them.',
      steps: [
        { t: 'Audit', d: 'Collect every component across 5 products.' },
        { t: 'Tokens', d: 'Colour, type and spacing as one source.' },
        { t: 'Core', d: 'A small set of components, done right.' },
        { t: 'Adopt', d: 'Migrate product by product, with the teams.' },
      ],
      aside: 'teams can still propose new components. they just go through a quick review',
    },
    result: {
      title: 'From five libraries to one.',
      body: 'Every team pulls from the same library. Flip between the two to see the difference.',
      before: '5 buttons · 5 styles · 0 agreement',
      after: '1 library · 5 products · in sync',
    },
    takeaways: {
      items: [
        'A system is a product. It needs users, not just rules.',
        'Start small. Ten great components beat a hundred okay ones.',
        'Adoption is a design problem too.',
      ],
      quote: 'Consistency isn’t boring. It’s what lets teams move fast.',
    },
  },
  {
    slug: 'shop-tools',
    file: 'wip_shop-tools.fig',
    index: 4,
    label: 'SIDE PROJECT · IN PROGRESS',
    color: '#e7dfd1',
    ink: '#16130f',
    status: 'In progress',
    title: ['Simple tools for small shop', 'owners'],
    intro:
      'Most small shops still run on notebooks and memory. Stock runs out without warning and sales are hard to track. This side project explores tools simple enough to use between customers. It’s still in progress.',
    role: 'Designer (solo)',
    year: '2026',
    platform: 'Tablet & phone',
    tags: ['Retail', 'Dashboards', 'Field research'],
    problem: {
      title: 'Running a shop from a notebook.',
      body: 'Owners log sales in notebooks, guess what to reorder, and find out about empty shelves from customers. Existing tools feel built for big stores: too many screens and far too much setup.',
      steps: ['Write the sale down', 'Guess the stock', 'Run out', 'Lose the sale'],
      aside: '(and the notebook gets wet)',
    },
    stakes: {
      title: 'For a small shop, one empty shelf is real money.',
      body: 'Margins are tiny. A missed reorder or a forgotten sale can decide whether a week ends in profit or not.',
      items: [
        { wrong: 'Running out of best sellers', response: 'A low-stock nudge before it’s empty' },
        { wrong: 'No idea what sold today', response: 'A plain daily summary' },
        { wrong: 'Tools that take a week to set up', response: 'Start selling in minutes' },
      ],
    },
    research: {
      title: 'They didn’t want software. They wanted fewer surprises.',
      body: 'Watching how owners sell, count and reorder showed one thing: the tools they liked best felt like the notebook, just a little smarter.',
      insight: 'it has to be faster than the notebook. that’s the bar.',
    },
    idea: {
      title: 'As fast as the notebook, just smarter.',
      body: 'One tap to log a sale, a daily summary in plain words, and a nudge before anything runs out.',
      steps: [
        { t: 'Tap', d: 'Log a sale in one tap.' },
        { t: 'Track', d: 'Stock updates on its own.' },
        { t: 'Nudge', d: 'A heads-up before it runs out.' },
        { t: 'Review', d: 'A plain summary at closing time.' },
      ],
      aside: 'works offline, because the shop wifi is… optimistic',
    },
    result: {
      title: 'Where it stands today.',
      body: 'The prototype is still evolving. Flip between the notebook and the tool.',
      before: 'messy notebook · guessing stock · lost sales',
      after: '1 tap · live stock · daily summary',
    },
    takeaways: {
      items: [
        'Watch people work before you design for them.',
        'Simple is a feature you have to defend.',
        'The notebook is the real competitor.',
      ],
      quote: 'If it’s not faster than paper, it doesn’t ship.',
    },
  },
];

export const caseBySlug = (slug: string) => cases.find((c) => c.slug === slug);
export const nextCase = (slug: string) => {
  const i = cases.findIndex((c) => c.slug === slug);
  return cases[(i + 1) % cases.length];
};
