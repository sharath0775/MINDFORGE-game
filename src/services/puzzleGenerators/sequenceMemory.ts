import { Puzzle, PuzzleOption } from '../../types/game';

const SYMBOL_SET = ['▲', '●', '■', '★', '◆', '✦', '♠', '♣'];

export function generateSequenceMemoryPuzzle(difficulty: number): Puzzle {
  const len = Math.min(8, 4 + Math.floor(difficulty * 0.6));
  const seq: string[] = [];

  for (let i = 0; i < len; i++) {
    seq.push(SYMBOL_SET[Math.floor(Math.random() * SYMBOL_SET.length)]);
  }

  const correctAnswer = seq.join(' ');
  const distractor1 = [...seq].reverse().join(' ');
  const distractor2 = seq.slice(1).concat(seq[0]).join(' ');
  const distractor3 = seq.map(s => SYMBOL_SET[Math.floor(Math.random() * SYMBOL_SET.length)]).join(' ');

  const options: PuzzleOption[] = Array.from(new Set([correctAnswer, distractor1, distractor2, distractor3]))
    .map((label, idx) => ({ id: `seq_${idx}`, label, value: label }))
    .sort(() => Math.random() - 0.5);

  return {
    id: `seq_mem_${Date.now()}_${Math.random()}`,
    category: 'SEQUENCE_MEMORY',
    title: 'SYMBOL CHAIN SEQUENCE RECALL',
    description: `Memorize the exact ${len}-symbol sequence chain before it disappears.`,
    inputType: 'MEMORY_FLASH',
    questionText: seq.join('   '),
    correctAnswer: correctAnswer,
    options,
    timeLimitSeconds: Math.max(8, 16 - difficulty),
    difficulty,
    hint: 'Chunk the symbols into small rhythmic pairs (e.g. ▲● then ■★).',
    forgeDialogue: {
      intro: `FORGE: Broadcasting symbol sequence chain. Retain linear order.`,
      success: `FORGE: Symbol sequence chain reproduced with 100% fidelity.`,
      failure: `FORGE: Sequence memory corrupted. Linear order mismatch.`,
    },
    metadata: {
      flashDurationMs: Math.max(1500, 3500 - difficulty * 200),
    }
  };
}
