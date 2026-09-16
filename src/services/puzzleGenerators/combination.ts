import { Puzzle, PuzzleOption } from '../../types/game';

export function generateCombinationPuzzle(difficulty: number): Puzzle {
  const d1 = Math.floor(Math.random() * 8) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const d3 = Math.floor(Math.random() * 8) + 1;
  const d4 = Math.floor(Math.random() * 7) + 1;

  const originalCode = `${d1}${d2}${d3}${d4}`;

  // Transformation rules
  const rules = [
    { text: 'Add 2 to the first digit and swap the last two digits.', transform: (a: number, b: number, c: number, d: number) => `${a + 2}${b}${d}${c}` },
    { text: 'Multiply the 2nd digit by 2 and subtract 1 from the 4th digit.', transform: (a: number, b: number, c: number, d: number) => `${a}${b * 2}${c}${d - 1}` },
    { text: 'Invert the whole code order, then add 1 to the new first digit.', transform: (a: number, b: number, c: number, d: number) => `${d + 1}${c}${b}${a}` },
  ];

  const ruleObj = rules[Math.floor(Math.random() * rules.length)];
  const correctCode = ruleObj.transform(d1, d2, d3, d4);

  const d1Code = ruleObj.transform(d1, Math.min(9, d2 + 1), d3, d4);
  const d2Code = `${d1}${d2}${d3}${d4}`; // Original unchanged
  const d3Code = correctCode.split('').reverse().join('');

  const options: PuzzleOption[] = Array.from(new Set([correctCode, d1Code, d2Code, d3Code]))
    .map((code, idx) => ({ id: `code_${idx}`, label: `CODE: [ ${code} ]`, value: code }))
    .sort(() => Math.random() - 0.5);

  return {
    id: `comb_cross_${Date.now()}_${Math.random()}`,
    category: 'COMBINATION',
    title: 'DUAL-NEURAL MEMORY + LOGIC TRANSFORM',
    description: `MEMORIZE BASE CODE: [ ${originalCode} ] (Disappears in 3 seconds). Then apply the transformation rule.`,
    inputType: 'MEMORY_FLASH',
    questionText: `INITIAL CODE: [ ${originalCode} ]`,
    correctAnswer: correctCode,
    options,
    timeLimitSeconds: Math.max(12, 22 - difficulty * 1.5),
    difficulty,
    hint: `Store original code digits mentally, then apply: "${ruleObj.text}"`,
    forgeDialogue: {
      intro: `FORGE: Initiating dual-tier neural synthesis. Retain memory trace while applying logic transform.`,
      success: `FORGE: Dual-tier processing completed with 100% fidelity!`,
      failure: `FORGE: Processing bottleneck. Memory trace corrupted during logic transformation.`,
    },
    metadata: {
      originalCode,
      ruleText: ruleObj.text,
      flashDurationMs: Math.max(2000, 4000 - difficulty * 250),
    }
  };
}
