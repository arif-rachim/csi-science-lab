import type { Case } from './types';

export const caseTwo: Case = {
  id: 'case-02-pond-that-breathes',
  title: 'THE POND THAT BREATHES',
  subtitle: 'Case 02 · Biology · The Pond Killer',
  subject: 'biology',
  mypTopics: [
    'Cells and microorganisms (cyanobacteria)',
    'Ecosystems and food chains',
    'Dissolved oxygen and aerobic respiration',
    'Eutrophication and nutrient loading',
    'Bioindicators and pathogenicity',
  ],

  story:
    "Six days after Case 01, the school's fish pond is killing things. Frogs, fish — and now Pak Yusuf, the biology teacher who mentors your forensics club. He was found unconscious in the pond holding a glass bottle with a hand-drawn skull. City inspectors arrive in 24 hours.",

  intro: `>> CHANNEL OPEN: STUDENT FORENSICS CLUB
>> 02:11 JKT · SATURDAY · 6 DAYS AFTER CASE 01

>> "Iqbal. Wake up."

>> "Bu Sari? Again?"

>> "It's Pak Yusuf this time. The biology teacher."

>> A beat.

>> "He's in the school infirmary. Unconscious.
>>  They found him at the fish pond at 01:45.
>>  Holding a glass bottle. Skull drawn on it."

>> Your blood goes cold.

>> "Is he—"

>> "Stable. But not responding. Doctor wants
>>  to know what was in that bottle, and what's
>>  in the pond, because Pak Yusuf was IN that
>>  pond up to his knees."

>> "Why me again?"

>> "City environmental inspector arrives at
>>  02:00 tomorrow. If we can't show what
>>  happened, the pond gets drained, the bio
>>  lab gets sealed, and Pak Hartono — who you
>>  just saved six days ago — loses his license
>>  over it."

>> A pause. Then quieter:

>> "Also, last week a kindergartener almost
>>  touched that water, Iqbal. The next kid
>>  who slips and falls in might not be lucky."

>> "...I'll be there in twenty."

>> CONNECTING TO SCHOOL NETWORK...
>> SECURE TUNNEL ESTABLISHED.
>> CASE FILE OPENED — 24:00:00 ON CLOCK.`,

  briefing: `You park at the back gate. The pond is fifty meters
past the bio building, ringed by a chain-link fence
the school threw up last week when the dead frogs
started appearing.

The fence gate is unlocked. Someone was here recently.

   ═══════════════════════════════════════════
              THE POND — 02:47 JKT
   ═══════════════════════════════════════════

The pond is bigger than you remember. Maybe fifteen
meters across. The surface is wrong — matte instead
of reflecting the streetlights. There is a smell
that catches in your throat.

Three frogs floating belly-up near the inlet.
Six dead fish along the far edge. The water has
a green tint that doesn't move when the wind blows.

Pak Yusuf's notebook is on the wooden bench by the
fence, opened to a half-drawn diagram of a single
cell — long shape, dotted gas vesicles inside. His
pen rolled off when whoever pulled him out shoved
his bag aside.

Beside the bench is the evidence bag with the bottle.
Glass. Old jam jar. Hand-drawn skull on a masking-
tape label. Half-full of something dark and viscous.

You take samples from four pond locations — the
shallow east bank, the deep center, the inlet pipe,
and the outlet pipe — plus a sample from inside the
skull bottle.

(Three days ago Pak Yusuf told you, in passing, that
he had been logging nitrate levels weekly and the
numbers were climbing. He thought it was fertilizer
runoff. You didn't write it down.)

Pak Toni, the night security guard, sits in his golf
cart twenty meters back, arms crossed. He will not
come closer than that.

"Saw someone last night," he says when you walk over.
"Rubber boots. Up to here." He points at his knee.
"Couldn't see the face. Person was small."

You start with the microscope.`,

  phaseFlavor: {
    'crime-scene': `Check the water sample bottles, Pak Yusuf's notebook,
the dead frogs, the skull bottle, the inlet pipe.
He saw something. So can you.`,

    hypothesis: `   ═══════════════════════════════════════════
            NOTEBOOK OPEN. 03:15 JKT.
            22 HOURS, 45 MINUTES LEFT.
   ═══════════════════════════════════════════

In Pak Yusuf's last legible note, before the writing
turned shaky:

  >> "Four candidate causes — rule them out:
  >>   1. Cyanobacterial bloom
  >>   2. Eutrophication runoff
  >>   3. Chemical dump (chlorine?)
  >>   4. Pathogen / virus"

Write two hypotheses. For each, predict what your
water tests WILL show if that cause is the real one.

The harder you make your predictions, the cleaner
your verdict will be.`,

    lab: `   ═══════════════════════════════════════════
            BIO LAB UNLOCKED. 04:02 JKT.
            21 HOURS, 58 MINUTES LEFT.
   ═══════════════════════════════════════════

Two tools tonight.

First the microscope. Pak Yusuf's slides are racked
by location. Look at every one — your job is to know
what is actually living in the water.

Then the water-chemistry panel. Each sample gives
you four numbers at once: pH, dissolved oxygen,
nitrate, and microbe density.

   Healthy reference:  pH 6.5–8.5
                       DO  ≥ 5 mg/L
                       NO₃ < 10 mg/L
                       microbes — low

A sick pond looks different on all four axes — but
each cause leaves a DIFFERENT signature. Read the
combinations, not the headline number.`,

    analysis: `   ═══════════════════════════════════════════
        LAB BENCH. 05:30 JKT. 20 HRS LEFT.
   ═══════════════════════════════════════════

Five samples. Four readings per sample. Five slides
from the microscope.

The pond samples will agree with each other in a
pattern. One sample will not. That one is the
witness.`,

    verdict: `   ═══════════════════════════════════════════
      INSPECTOR ARRIVES IN 4 HOURS. 22:00 JKT.
   ═══════════════════════════════════════════

Pak Yusuf is still in the infirmary. The doctor on
the line has been waiting for your call. He needs
to know what is in Pak Yusuf's blood so he can pick
a targeted treatment.

WHO POISONED THE POND — AND HOW?

(Reasoning has to cover both: who put the contaminant
in, and what kind of contamination it actually is.
The doctor needs the mechanism even more than the
name.)`,

    reflection: `   ═══════════════════════════════════════════
        HOSPITAL. 09:15 NEXT MORNING.
   ═══════════════════════════════════════════

Pak Yusuf woke an hour ago. He squeezed your hand.
He couldn't talk but he wrote three words on the
back of his discharge form:

  >> "Thank you, Iqbal."

The pond is being drained. The bio lab stayed open.
Pak Hartono kept his license. The student who did
this confessed to her parents this morning.

The environmental inspector wants your full debrief
in writing. Not just what happened — what you
LEARNED.`,

    complete: `   ═══════════════════════════════════════════
        FIELD REPORT — CASE 02 CLOSED
   ═══════════════════════════════════════════`,
  },

  suspects: [
    {
      id: 'suspect-pak-joko',
      name: 'Pak Joko (janitor / maintenance contractor)',
      motive:
        "Has been pouring undiluted bleach into the pond every Friday to 'keep it clean' — well past what any safety standard allows. Doesn't know chemistry well. Doesn't deny it.",
      alibi:
        "Was at the pond Wednesday morning with bleach jugs — witnesses confirm. Says he wasn't here last night. His old motorbike was parked at home — wife confirms.",
    },
    {
      id: 'suspect-bu-diah',
      name: 'Bu Diah (sales rep, Aqualife Indonesia)',
      motive:
        "Wants the school to sell its back lot for her company's fish-farm pilot. A 'broken' pond removes the 'we already have a water feature' argument. Strongest material motive.",
      alibi:
        'Was at a hotel pitch meeting until 23:00 — hotel receipt, two witnesses. Was not on any school security camera. No lab access.',
    },
    {
      id: 'suspect-wira',
      name: 'Wira (Year 11 student, IB Diploma candidate)',
      motive:
        'IA project on extremophile cyanobacteria. Cultures cells in the bio lab WITH a slide permission — NOT with permission to put anything in the pond. Has lab night-key access.',
      alibi:
        'Says she went home at 18:00 yesterday. Mother confirms. But her dorm card swipe shows she left at 23:30 and did not return until 04:45. She went somewhere.',
    },
    {
      id: 'suspect-pak-yusuf',
      name: 'Pak Yusuf himself (the victim)',
      motive:
        "Could he have been running an unauthorized experiment? He had been quietly logging the pond for weeks and not telling anyone.",
      alibi:
        'He was IN the pond when found. His phone was at home but his car was here. Could he have been trying to fix it himself and dosed something wrong?',
    },
    {
      id: 'suspect-unknown',
      name: 'Unknown intruder (rubber boots, no face)',
      motive:
        "Pak Toni saw rubber boots wading at 01:45. The figure was small. Face hidden. No further description.",
      alibi:
        'No alibi possible — identity unknown. Could be any suspect above, or someone external entirely.',
    },
  ],

  evidence: [
    {
      id: 'evidence-pond-shallow',
      name: 'Pond sample — east shallow bank',
      description:
        "Where the dead frogs were floating. The water here is the most green-tinted. Surface scum you can scoop with a slide. Smells slightly of rotting plant matter.",
      location: { x: 0, y: 0 },
      relevantTools: ['microscope'],
    },
    {
      id: 'evidence-pond-deep',
      name: 'Pond sample — deep center',
      description:
        'Taken from a meter down with a pole sampler. The water here is darker and colder. Very little movement. No surface scum at this point.',
      location: { x: 0, y: 0 },
      relevantTools: ['microscope'],
    },
    {
      id: 'evidence-pond-inlet',
      name: 'Pond sample — inlet pipe',
      description:
        "Where municipal water enters the pond. Pak Yusuf had a sampling tap installed here last year. Should be your cleanest sample — closest to a control.",
      location: { x: 0, y: 0 },
      relevantTools: ['microscope'],
    },
    {
      id: 'evidence-pond-outlet',
      name: 'Pond sample — outlet pipe',
      description:
        "Where the pond drains into the city storm system. This is what the city inspector will measure tomorrow. Heavy green tint. Visible particulates in suspension.",
      location: { x: 0, y: 0 },
      relevantTools: ['microscope'],
    },
    {
      id: 'evidence-skull-bottle',
      name: 'Skull-labeled bottle (from Pak Yusuf)',
      description:
        "Glass jar. Half-full of dark green concentrated liquid. Hand-drawn skull on masking-tape label. Pak Yusuf was holding this when they found him.",
      location: { x: 0, y: 0 },
      relevantTools: ['microscope'],
    },
    {
      id: 'evidence-notebook',
      name: "Pak Yusuf's notebook",
      description:
        "Open to a half-drawn cell diagram: long oval shape with dotted internal gas vesicles. He labeled it 'M.a.?' His weekly nitrate log shows climbing values for three weeks. His handwriting got shakier on the last page.",
      location: { x: 0, y: 0 },
      relevantTools: [],
    },
  ],

  labMode: 'water_panel',

  labTools: [
    { id: 'microscope', name: 'Microscope (40× / 400×)', unlocked: true },
    { id: 'ph_probe', name: 'Water analysis panel (pH/DO/NO₃/microbe density)', unlocked: true },
  ],

  hypothesisTemplates: [
    {
      id: 'hyp-cyano-bloom',
      text: 'If a cyanobacterial bloom caused the pond death, then microbe density will be high and dissolved oxygen will drop below 2 mg/L (microbes consume O₂ at night).',
      independentVariable: 'biological contamination level',
      dependentVariable: 'microbe density and dissolved oxygen',
      control: 'inlet pipe water (fresh municipal)',
      correct: true,
    },
    {
      id: 'hyp-chemical-dump',
      text: 'If a chemical dump (chlorine bleach) caused the pond death, microbe density will be LOW (chlorine sterilizes) and pH will spike above 9.',
      independentVariable: 'chemical contamination',
      dependentVariable: 'microbe density and pH',
      control: 'inlet pipe water',
      correct: true,
    },
    {
      id: 'hyp-eutrophication',
      text: 'If fertilizer runoff caused this, nitrate will be very high (>40 mg/L) and microbes will be high but dominated by mixed algae, not a single species.',
      independentVariable: 'nutrient load',
      dependentVariable: 'nitrate level and microbe diversity',
      control: 'inlet pipe water',
      correct: true,
    },
    {
      id: 'hyp-pathogen',
      text: "If a pathogen caused the kill, microbe density on standard counts may look normal, but the deaths will cluster in one taxonomic group (e.g., only fish, or only frogs).",
      independentVariable: 'pathogen presence',
      dependentVariable: 'organism mortality pattern',
      control: 'inlet pipe water',
      correct: true,
    },
  ],

  waterReadings: {
    'evidence-pond-shallow': {
      ph: 9.3,
      dissolvedO2: 2.2,
      nitrate: 42,
      microbeDensity: 8.5e6,
      status: 'critical',
      notes:
        'Surface scum is dense. High pH from photosynthetic activity of dense surface microbes. Eutrophic-range nitrate.',
    },
    'evidence-pond-deep': {
      ph: 8.5,
      dissolvedO2: 0.8,
      nitrate: 35,
      microbeDensity: 3.0e6,
      status: 'critical',
      notes:
        'Anoxic conditions — dissolved O₂ near zero. Dead biomass settling here and decomposing. Fish suffocate at this depth.',
    },
    'evidence-pond-inlet': {
      ph: 7.2,
      dissolvedO2: 7.5,
      nitrate: 5,
      microbeDensity: 1.2e4,
      status: 'healthy',
      notes:
        'Clean municipal water. Your control — this is what should be coming OUT of the pond, too.',
    },
    'evidence-pond-outlet': {
      ph: 9.1,
      dissolvedO2: 1.8,
      nitrate: 45,
      microbeDensity: 9.0e6,
      status: 'critical',
      notes:
        'Pond exit water. Eutrophic and crowded with microbes — going straight into the city storm drain. Inspector will see this number first.',
    },
    'evidence-skull-bottle': {
      ph: 8.0,
      dissolvedO2: 0.5,
      nitrate: 80,
      microbeDensity: 1.0e9,
      status: 'critical',
      notes:
        'Concentrated culture. Microbe density is THREE ORDERS OF MAGNITUDE higher than any pond sample. This is a source, not a victim.',
    },
  },

  microscopeReadings: {
    'evidence-pond-shallow': {
      organism: 'Microcystis aeruginosa (cyanobacteria)',
      asciiArt: `      .:::::. .:::.
   .:::::::::::::::.
  ::::*:::::::*:::::
  ::::::*::::::::::    M. aeruginosa
   ':::::::::::*::'    colony — gas
     ':::::::::'       vesicles visible`,
      classification: 'dangerous',
      notes:
        "Dense colonies of Microcystis with gas vesicles (the dotted interior). This species produces MICROCYSTIN — hepatotoxic. This is what Pak Yusuf's diagram was sketching.",
    },
    'evidence-pond-deep': {
      organism: 'Microcystis aeruginosa (lower density)',
      asciiArt: `      .::::.   .::.
   .:::::::.  .:::.
   :*::::::    ::::    Fewer colonies
   :::::::*    *:::    at depth — but
    '::::'     ':'     still present`,
      classification: 'dangerous',
      notes:
        'Same species as shallow, lower concentration. Bloom is throughout the water column. Dead diatoms also visible — Microcystis is outcompeting them.',
    },
    'evidence-pond-inlet': {
      organism: 'Mixed normal algae (Chlorella, diatoms)',
      asciiArt: `      .*.     .::.
       *      :  :    Diatoms and
              ':*'    common green
       .*.    .*.     algae — normal
        *      *      freshwater mix`,
      classification: 'safe',
      notes:
        "Normal mixed flora — Chlorella, a few diatoms, no cyanobacteria. This water is FINE on its way in. The pond is doing the damage.",
    },
    'evidence-pond-outlet': {
      organism: 'Microcystis aeruginosa (very high density)',
      asciiArt: `   .:::::::::::::::.
   :::::::::::::::::
  *:::*:::*:::*:::::    Dominant
   :::::::::::::::*     bloom — virtually
   '::::::::::::::'     ALL Microcystis
     ':::::::::'        going downstream`,
      classification: 'dangerous',
      notes:
        'The microbial population is now almost entirely Microcystis. This is what enters the city storm system. If a stormdrain feeds a downstream water source, the bloom can spread.',
    },
    'evidence-skull-bottle': {
      organism: 'Microcystis aeruginosa — PURE LAB CULTURE',
      asciiArt: `  :::::::::::::::::::
  :::::::::::::::::::
  :::*:::*:::*:::*:::    PURE
  :::::::::::::::::::    LAB-GRADE
  :::*:::*:::*:::*:::    CULTURE
  :::::::::::::::::::
  ':::::::::::::::::    Density: 10⁹/mL`,
      classification: 'dangerous',
      notes:
        "This is not pond water. This is a pure laboratory culture of Microcystis aeruginosa at growth-medium density. Somebody who knows microbiology cultured this — and someone put a skull on it because they knew what it was.",
    },
  },

  correctVerdict: 'suspect-wira',

  reflectionQuestions: [
    {
      id: 'reflect-a-1',
      question:
        "Pak Yusuf wants you to teach next week's Year 8 biology class about why a pond can be 'dead' even when it is full of life. Explain — in your own words — how a CYANOBACTERIAL bloom can kill fish even though the cyanobacteria are alive.",
      type: 'open',
      criterion: 'A',
    },
    {
      id: 'reflect-b-1',
      question:
        "You ran four water variables on every sample (pH, DO, nitrate, microbe density). If you had been forced to keep only ONE of those tests, which would you keep, and which one would have been the most MISLEADING on its own?",
      type: 'open',
      criterion: 'B',
    },
    {
      id: 'reflect-c-1',
      question:
        "One sample reading didn't fit the eutrophication pattern of the others — the skull bottle. Why was that outlier the most useful piece of data in the case? What did it prove that the pond samples couldn't?",
      type: 'open',
      criterion: 'C',
    },
    {
      id: 'reflect-d-1',
      question:
        "Wira's IA project was legitimate science. The harm came from how she disposed of her cultures. Schools handle this with 'biosafety protocols.' Write ONE specific rule you would add to your school's biology lab policy after this case — and defend it against the student who says 'but that's too restrictive.'",
      type: 'open',
      criterion: 'D',
    },
  ],

  estimatedMinutes: 25,
};
