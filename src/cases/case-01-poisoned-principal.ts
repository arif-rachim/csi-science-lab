import type { Case } from './types';

export const caseOne: Case = {
  id: 'case-01-poisoned-principal',
  title: 'THE COFFEE THAT BURNED',
  subtitle: 'Case 01 · Chemistry · The Poisoned Principal',
  subject: 'chemistry',
  mypTopics: [
    'pH scale (0–14)',
    'Acids, bases, and neutralization',
    'Universal indicator interpretation',
    'Chemical reactions: acid + base',
  ],

  story:
    "Pak Hartono — your principal, your forensics-club mentor — collapsed after his morning coffee. The hospital can't pick an antidote until you tell them WHAT he drank. You have twenty minutes alone in his office before the police arrive.",

  intro: `>> CHANNEL OPEN: STUDENT FORENSICS CLUB
>> 03:14 JKT · FRIDAY · FINALS WEEK

>> "Iqbal? It's Bu Sari. Wake up."

>> "...Bu Sari? It's three in the morning—"

>> "Pak Hartono is in the hospital. His coffee.
>>  They say it was chemical."

>> A pause. Your stomach drops through the floor.

>> "He's stable. But the doctor needs to know
>>  WHAT he drank before they can pick an antidote.
>>  Police arrive in twenty minutes. After that,
>>  every bottle in his office becomes evidence
>>  and we don't see it for a month."

>> "Why me?"

>> "Because you and your forensics club have
>>  night-key access to the lab. And because
>>  Pak Hartono trusted you with it."

>> A long silence.

>> "...I'll be there."

>> CONNECTING TO SCHOOL NETWORK...
>> SECURE TUNNEL ESTABLISHED.
>> CASE FILE OPENED.`,

  briefing: `You drive through empty Jakarta streets. Streetlights
tick past in the rain. The school gate is open; the
security guard waves you through without looking up.

The hallway is silent except for one humming bulb. The
principal's office door is unlocked. You step inside.

   ═══════════════════════════════════════════
              THE OFFICE — 03:47 JKT
   ═══════════════════════════════════════════

Pak Hartono's coffee mug sits half-drunk on the desk.
Four bottles in a tidy row. A doctor's emergency note.
The chair pushed back so hard it hit the wall.

The note is what gets you. It says the antidote can't
be chosen until the acid is identified. Every minute
matters. He is lying there somewhere across town.

You snap on gloves. Twenty minutes.

(Three days ago, the chemistry teacher Pak Budi signed
out concentrated HCl from the lab "for a demonstration"
and never logged the return. Bu Sari knew. She didn't
tell anyone — until tonight.)`,

  phaseFlavor: {
    'crime-scene': `Examine each item on the desk. Anything that catches
your eye goes into the evidence log. Don't waste
gloves — touch every container at least once.`,

    hypothesis: `   ═══════════════════════════════════════════
       NOTEBOOK OPEN. 03:55 JKT.
   ═══════════════════════════════════════════

"Always write at least two hypotheses," Pak Hartono
used to say. "Otherwise you're just confirming what
you already believed."

Write what you think happened — including the boring
explanation. Be wrong on purpose if you have to.`,

    lab: `   ═══════════════════════════════════════════
            LAB UNLOCKED. 04:08 JKT.
   ═══════════════════════════════════════════

The lab smells like ethanol and Friday-night cleanup.
The pH probe is in the second drawer where Pak Hartono
keeps it. Universal indicator strips: stocked.
Distilled water in the corner — your control sample.

Test EVERYTHING. Even the bottles you think you know.`,

    analysis: `   ═══════════════════════════════════════════
       LAB BENCH. 04:21 JKT. 14 MIN LEFT.
   ═══════════════════════════════════════════

The strips are dry. The numbers are in. Now you have
to read them.

One reading should not look like the others.`,

    verdict: `   ═══════════════════════════════════════════
          12 MIN UNTIL POLICE ARRIVAL.
   ═══════════════════════════════════════════

Bu Sari is in the hallway, biting her lip. She keeps
checking her phone.

The doctor at the hospital is waiting for your call.
Get this wrong, they pick the wrong antidote, and
Pak Hartono gets worse before he gets better.

WHO POISONED THE COFFEE — AND HOW DO YOU KNOW?`,

    reflection: `   ═══════════════════════════════════════════
        HOSPITAL. 06:40 JKT. SUN COMING UP.
   ═══════════════════════════════════════════

The paramedics took the bottle you flagged.
The doctor confirmed it twenty minutes ago.

Pak Hartono is groggy but talking. He squeezed your
shoulder when you walked in. He said:

>> "Show your work, Iqbal."

So show it.`,

    complete: `   ═══════════════════════════════════════════
        FIELD REPORT — CASE 01 CLOSED
   ═══════════════════════════════════════════`,
  },

  suspects: [
    {
      id: 'liquid-vinegar',
      name: 'Bu Tini (Bottle A — vinegar)',
      motive:
        "Eleven years bringing Pak Hartono his coffee every morning. Devoted. Maybe too devoted — she's been heard saying he 'doesn't take care of himself.'",
      alibi:
        'In the kitchen prepping breakfast from 06:30 to 07:25. Three staff confirm she never left.',
    },
    {
      id: 'liquid-baking-soda',
      name: 'Bu Sari (Bottle B — baking soda)',
      motive:
        "Passed over for the principal job six weeks ago. Has openly criticized Pak Hartono's funding choices. Carries baking soda for what she calls 'office stomach.'",
      alibi:
        'Says she heard him collapse through the wall and called the ambulance at 07:12 — log confirms. She is also the one who called YOU.',
    },
    {
      id: 'liquid-lemon-juice',
      name: "Pak Hartono himself? (Bottle C — lemon juice)",
      motive:
        'No motive worth the name. He puts lemon in his own coffee — claims he picked the habit up in Vienna. The bottle is his.',
      alibi:
        'He drank the coffee. He is the victim. Unless this is bizarre self-harm — but the doctor says the dose is too precise to be accidental.',
    },
    {
      id: 'liquid-unknown-x',
      name: 'Unknown (Bottle D — unlabeled, wiped clean)',
      motive:
        'Three days ago Pak Budi (chemistry teacher) signed out concentrated HCl "for a demonstration." Never logged the return. Bu Tini saw him in this office yesterday, arguing about lab safety budget cuts.',
      alibi:
        'Pak Budi went home at 18:00 yesterday — alone — when the coffee was poisoned. No witness can confirm he stayed home.',
    },
  ],

  evidence: [
    {
      id: 'evidence-bottle-a',
      name: 'Bottle A — Vinegar',
      description:
        'Clear bottle from Bu Tini\'s station. Label: "ACETIC ACID 5% — FOOD GRADE". Greasy fingerprints — three of them, all hers. Used to descale the coffee maker every Friday.',
      location: { x: 195, y: 225 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-bottle-b',
      name: 'Bottle B — Baking soda solution',
      description:
        'Cloudy white. Label in Bu Sari\'s handwriting: "FOR OFFICE STOMACH". She keeps it in her desk drawer. The drawer was open when you arrived.',
      location: { x: 285, y: 225 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-bottle-c',
      name: 'Bottle C — Lemon juice',
      description:
        'Pale yellow. Half-empty. Label in Pak Hartono\'s handwriting: "MY LEMON — DO NOT TOUCH". His fingerprints alone — only person who handles this bottle.',
      location: { x: 375, y: 225 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-bottle-d',
      name: 'Bottle D — UNLABELED',
      description:
        'Wedged between the desk and the wall, like somebody hid it in a hurry. No label. No fingerprints — wiped clean with cloth. Sharp chemical smell — not food. Nobody admits this bottle is theirs.',
      location: { x: 465, y: 225 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-coffee-mug',
      name: "Pak Hartono's coffee mug",
      description:
        'Half-drunk. Faint discolored residue ring around the inside rim — not normal coffee staining. Smells faintly like Bottle D. Whatever went in this mug left a mark.',
      location: { x: 580, y: 250 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-symptoms',
      name: "Doctor's emergency note",
      description:
        'Patient: HARTONO, M., 54. Severe corrosive burn pattern, throat and esophagus. Strong-acid ingestion suspected (pH ≤ 2). NOT consistent with common food acids. ANTIDOTE SELECTION BLOCKED until specific acid identified.',
      location: { x: 640, y: 415 },
      relevantTools: [],
    },
  ],

  labTools: [
    { id: 'ph_probe', name: 'pH probe & universal indicator', unlocked: true },
    { id: 'microscope', name: 'Microscope', unlocked: false },
    { id: 'chromatography', name: 'Chromatography', unlocked: false },
    { id: 'density', name: 'Density test', unlocked: false },
    { id: 'spectroscopy', name: 'Spectroscopy', unlocked: false },
  ],

  hypothesisTemplates: [
    {
      id: 'hyp-strong-acid',
      text: 'If the harmful liquid is a strong acid, then its pH will be ≤ 2 and it will cause burning symptoms matching the doctor\'s note.',
      independentVariable: 'identity of the liquid',
      dependentVariable: 'pH reading',
      control: 'distilled water (pH 7)',
      correct: true,
    },
    {
      id: 'hyp-strong-base',
      text: 'If the harmful liquid is a strong base, then its pH will be ≥ 12 and it will also cause burning symptoms.',
      independentVariable: 'identity of the liquid',
      dependentVariable: 'pH reading',
      control: 'distilled water (pH 7)',
      correct: true,
    },
    {
      id: 'hyp-vinegar',
      text: 'If vinegar caused the harm, then its pH will be far below 3 and it would produce severe burns.',
      independentVariable: 'identity of the liquid',
      dependentVariable: 'pH reading',
      control: 'distilled water (pH 7)',
      correct: false,
    },
    {
      id: 'hyp-baking-soda',
      text: 'If baking soda solution caused the harm, then its pH will be far above 12 and would produce severe burns.',
      independentVariable: 'identity of the liquid',
      dependentVariable: 'pH reading',
      control: 'distilled water (pH 7)',
      correct: false,
    },
  ],

  phReadings: {
    'evidence-bottle-a': {
      ph: 2.8,
      hexColor: '#e85a3a',
      classification: 'weak-acid',
      notes:
        'Vinegar (acetic acid). Mildly acidic. Sharp taste and smell, but household concentration is not corrosive.',
    },
    'evidence-bottle-b': {
      ph: 9.2,
      hexColor: '#4a90c8',
      classification: 'weak-base',
      notes:
        'Baking soda solution (sodium bicarbonate). Mildly basic. Safe in cooking and as a mild cleaner.',
    },
    'evidence-bottle-c': {
      ph: 2.4,
      hexColor: '#f08040',
      classification: 'weak-acid',
      notes:
        'Lemon juice (citric acid). Acidic but edible. Citric acid does not cause chemical burns at this concentration.',
    },
    'evidence-bottle-d': {
      ph: 1.0,
      hexColor: '#c41e1e',
      classification: 'strong-acid',
      notes:
        'STRONG ACID. pH ≤ 1 is corrosive — capable of causing burns, internal injury, and matches the doctor\'s pH ≤ 2 finding.',
    },
    'evidence-coffee-mug': {
      ph: 1.5,
      hexColor: '#d12e2e',
      classification: 'strong-acid',
      notes:
        "The residue in the mug is strongly acidic — its pH range matches Bottle D, not anything else. The acid was added to the coffee.",
    },
  },

  correctVerdict: 'liquid-unknown-x',

  reflectionQuestions: [
    {
      id: 'reflect-a-1',
      question:
        "Pak Hartono asks you to 'show your work' — explain in your own words: what is the difference between a strong acid like Bottle D and a weak acid like vinegar? Why does pH 1 burn but pH 3 doesn't?",
      type: 'open',
      criterion: 'A',
    },
    {
      id: 'reflect-b-1',
      question:
        "In hindsight, why was it important to test distilled water (the control) at all — wasn't its pH obvious? What would you have lost if you skipped the control?",
      type: 'open',
      criterion: 'B',
    },
    {
      id: 'reflect-c-1',
      question:
        "One pH reading didn't fit the pattern of the others — that's how you cracked the case. In your own data table, which reading was the anomaly, and how confident were you when you made the call? Would you bet a life on it now?",
      type: 'open',
      criterion: 'C',
    },
    {
      id: 'reflect-d-1',
      question:
        "Concentrated lab chemicals can look identical to drinking liquids. What one rule at your school would have prevented this — and would you defend it if students complained it was annoying?",
      type: 'open',
      criterion: 'D',
    },
  ],

  estimatedMinutes: 20,
};
