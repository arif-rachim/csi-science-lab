import type { Case } from './types';

export const caseOne: Case = {
  id: 'case-01-poisoned-principal',
  title: 'The Poisoned Principal',
  subject: 'chemistry',
  mypTopics: [
    'pH scale (0–14)',
    'Acids, bases, and neutralization',
    'Universal indicator interpretation',
    'Chemical reactions: acid + base',
  ],
  story:
    "Principal Hartono collapsed after his morning coffee. Paramedics say he's stable, but the symptoms — nausea, burning stomach pain, hoarse voice — point to a chemical irritant. Four liquids were found on his desk. As junior forensic scientist, you must identify which liquid caused the reaction and explain the chemistry.",
  suspects: [
    {
      id: 'liquid-vinegar',
      name: 'Bottle A — Vinegar (acetic acid)',
      motive: 'Janitor uses it as a cleaning solution. Mildly acidic.',
      alibi: 'Found in unlocked supply closet — anyone could have taken it.',
    },
    {
      id: 'liquid-baking-soda',
      name: 'Bottle B — Baking soda solution',
      motive: 'Used by the canteen for baking. Mildly basic.',
      alibi: 'Three staff members had access this morning.',
    },
    {
      id: 'liquid-lemon-juice',
      name: 'Bottle C — Lemon juice',
      motive: 'Brought from the canteen by the kitchen helper.',
      alibi: 'Sealed bottle, opened only for the principal.',
    },
    {
      id: 'liquid-unknown-x',
      name: 'Bottle D — Unknown Liquid X',
      motive: 'No label. Strong chemical smell. Found behind the coffee mug.',
      alibi: 'No one admits to bringing it into the office.',
    },
  ],
  evidence: [
    {
      id: 'evidence-bottle-a',
      name: 'Bottle A',
      description: 'A clear bottle of vinegar, partially full. Sharp sour smell.',
      location: { x: 195, y: 225 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-bottle-b',
      name: 'Bottle B',
      description: 'White cloudy solution. Labeled "baking soda + water".',
      location: { x: 285, y: 225 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-bottle-c',
      name: 'Bottle C',
      description: 'Pale yellow liquid in a sealed bottle. Citrus smell.',
      location: { x: 375, y: 225 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-bottle-d',
      name: 'Bottle D',
      description: 'Unlabeled bottle. Faint chemical odor — not food.',
      location: { x: 465, y: 225 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-coffee-mug',
      name: "Principal's coffee mug",
      description: 'Half-full mug of coffee with a faint chemical residue ring.',
      location: { x: 580, y: 250 },
      relevantTools: ['ph_probe'],
    },
    {
      id: 'evidence-symptoms',
      name: "Doctor's note",
      description:
        'Symptoms: burning throat, nausea, vomiting. Consistent with ingesting a strong acid or strong base.',
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
      text: 'If the harmful liquid is a strong acid, then its pH will be at or below 2 and it will cause burning symptoms.',
      independentVariable: 'identity of the liquid',
      dependentVariable: 'pH reading',
      control: 'distilled water (pH 7)',
      correct: true,
    },
    {
      id: 'hyp-strong-base',
      text: 'If the harmful liquid is a strong base, then its pH will be at or above 12 and it will cause burning symptoms.',
      independentVariable: 'identity of the liquid',
      dependentVariable: 'pH reading',
      control: 'distilled water (pH 7)',
      correct: true,
    },
    {
      id: 'hyp-vinegar',
      text: 'If vinegar caused the harm, then its pH will be far below 3 and produce severe burns.',
      independentVariable: 'identity of the liquid',
      dependentVariable: 'pH reading',
      control: 'distilled water (pH 7)',
      correct: false,
    },
    {
      id: 'hyp-baking-soda',
      text: 'If baking soda solution caused the harm, then its pH will be far above 12 and produce severe burns.',
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
        'Baking soda solution (sodium bicarbonate). Mildly basic. Used safely in cooking and as a mild cleaner.',
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
        'STRONG ACID. pH ≤ 1 is corrosive — capable of causing burns, internal injury, and matches the symptoms.',
    },
    'evidence-coffee-mug': {
      ph: 1.5,
      hexColor: '#d12e2e',
      classification: 'strong-acid',
      notes:
        'Residue in the mug is strongly acidic — matches the pH range of Bottle D. The acid was added to the coffee.',
    },
  },
  correctVerdict: 'liquid-unknown-x',
  reflectionQuestions: [
    {
      id: 'reflect-a-1',
      question:
        'On the pH scale, what range would you call a "strong acid"? Why does pH 2 cause harm but pH 5 (lemon juice) does not?',
      type: 'open',
      criterion: 'A',
    },
    {
      id: 'reflect-b-1',
      question:
        'In your investigation, what was the independent variable? Why was it important to test a known control like distilled water?',
      type: 'open',
      criterion: 'B',
    },
    {
      id: 'reflect-c-1',
      question:
        'Which result surprised you the most when reading the indicator colors? How confident are you in your interpretation?',
      type: 'open',
      criterion: 'C',
    },
    {
      id: 'reflect-d-1',
      question:
        'Concentrated cleaning chemicals look similar to drinking liquids. What real-world safety practice could prevent this kind of accident at school or at home?',
      type: 'open',
      criterion: 'D',
    },
  ],
  estimatedMinutes: 18,
};
