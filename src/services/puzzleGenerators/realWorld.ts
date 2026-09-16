import { Puzzle, PuzzleOption } from '../../types/game';

export function generateRealWorldPuzzle(difficulty: number): Puzzle {
  const type = Math.floor(Math.random() * 5);

  if (type === 0) {
    // Money & Budgeting (e.g. ₹500 - ₹175 - ₹120 = ₹205)
    const initial = 500;
    const food = 150 + Math.floor(Math.random() * 6) * 5; // e.g. ₹175
    const transport = 100 + Math.floor(Math.random() * 5) * 5; // e.g. ₹120
    const remaining = initial - food - transport;

    const question = `A person has ₹${initial}. They spend ₹${food} on food and ₹${transport} on transportation. How much money remains in their balance?`;
    const correctAnswer = `₹${remaining}`;

    const options: PuzzleOption[] = [
      { id: 'c', label: `₹${remaining}`, value: correctAnswer, isCorrect: true },
      { id: 'd1', label: `₹${remaining + 25}`, value: `₹${remaining + 25}` },
      { id: 'd2', label: `₹${remaining - 15}`, value: `₹${remaining - 15}` },
      { id: 'd3', label: `₹${food + transport}`, value: `₹${food + transport}` },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `rw_budget_${Date.now()}_${Math.random()}`,
      category: 'REAL_WORLD',
      title: 'FINANCIAL BALANCE CALCULATION',
      description: 'Compute exact remaining liquidity after accounting for multiple expense deductions.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: correctAnswer,
      options,
      timeLimitSeconds: Math.max(10, 18 - difficulty),
      difficulty,
      hint: 'Subtract food cost first, then subtract transportation cost from the remainder.',
      forgeDialogue: {
        intro: `FORGE: Financial transaction matrix loaded. Calculate net remaining capital.`,
        success: `FORGE: Financial audit accurate. Zero ledger deviation.`,
        failure: `FORGE: Calculation error in expense ledger.`,
      }
    };
  } else if (type === 1) {
    // Train & Relative Speed Time Calculation
    const speed = 60 + Math.floor(Math.random() * 4) * 10; // 60, 70, 80, 90 km/h
    const distance = speed * 2; // e.g. 120, 140, 160 km
    const depHour = 8;
    const depMin = 30;

    const arrivalHour = depHour + 2;
    const arrivalTimeStr = `${arrivalHour}:${depMin < 10 ? '0' : ''}${depMin} AM`;

    const question = `A train departs Station A at ${depHour}:${depMin} AM traveling at a constant speed of ${speed} km/h toward Station B (${distance} km away). At what time will the train arrive at Station B?`;
    const correctAnswer = arrivalTimeStr;

    const options: PuzzleOption[] = [
      { id: 'c', label: arrivalTimeStr, value: arrivalTimeStr, isCorrect: true },
      { id: 'd1', label: `${depHour + 1}:${depMin} AM`, value: `${depHour + 1}:${depMin} AM` },
      { id: 'd2', label: `${depHour + 3}:00 AM`, value: `${depHour + 3}:00 AM` },
      { id: 'd3', label: `${depHour + 2}:00 AM`, value: `${depHour + 2}:00 AM` },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `rw_train_${Date.now()}_${Math.random()}`,
      category: 'REAL_WORLD',
      title: 'TRANSIT KINEMATICS DEDUCTION',
      description: 'Calculate exact transit duration and terminal arrival timestamp based on constant velocity and distance.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: arrivalTimeStr,
      options,
      timeLimitSeconds: Math.max(10, 18 - difficulty),
      difficulty,
      hint: 'Time = Distance ÷ Speed. Add travel hours to the departure time.',
      forgeDialogue: {
        intro: `FORGE: Transit telemetry active. Calculate arrival timestamp.`,
        success: `FORGE: Transit arrival predicted with millisecond accuracy.`,
        failure: `FORGE: Kinematic calculation error. Arrival miscalculated.`,
      }
    };
  } else if (type === 2) {
    // Multi-factor Route Selection (Distance vs Traffic vs Cost vs Time)
    const question = `Goal: Reach the airport before a tight flight check-in deadline with MINIMUM TOTAL TIME.\n\nRoute A: 35 km, Heavy Traffic, Total Time: 55 mins, Toll: $5\nRoute B: 48 km, Clear Highway, Total Time: 35 mins, Toll: $12\nRoute C: 28 km, Moderate Traffic, Total Time: 45 mins, Toll: $0\n\nWhich route best satisfies the primary objective?`;
    const correctAnswer = 'Route B (Shortest Time: 35 mins)';

    const options: PuzzleOption[] = [
      { id: 'rb', label: 'Route B (Shortest Time: 35 mins)', value: 'Route B (Shortest Time: 35 mins)', isCorrect: true },
      { id: 'ra', label: 'Route A (Shortest Distance)', value: 'Route A' },
      { id: 'rc', label: 'Route C (Zero Toll Cost)', value: 'Route C' },
      { id: 'rd', label: 'All routes have equal transit time', value: 'Equal' },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `rw_route_${Date.now()}_${Math.random()}`,
      category: 'REAL_WORLD',
      title: 'MULTI-FACTOR ROUTE OPTIMIZATION',
      description: 'Filter parameters (Distance, Traffic, Cost, Time) to optimize for the stated priority objective.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: 'Route B (Shortest Time: 35 mins)',
      options,
      timeLimitSeconds: Math.max(10, 18 - difficulty),
      difficulty,
      hint: 'Focus on the explicit objective: "MINIMUM TOTAL TIME", ignoring toll cost or raw distance.',
      forgeDialogue: {
        intro: `FORGE: Multi-criteria decision matrix loaded. Optimize for priority constraint.`,
        success: `FORGE: Route optimization successful. Time bottleneck bypassed.`,
        failure: `FORGE: Sub-optimal route selected. Flight deadline compromised.`,
      }
    };
  } else if (type === 3) {
    // Unit Price / Bulk Discount Shopping Math
    const packA_qty = 4;
    const packA_price = 120; // 30 per unit
    const packB_qty = 10;
    const packB_price = 250; // 25 per unit

    const question = `Option A: Pack of 4 items for ₹${packA_price} (₹${packA_price / packA_qty} per item)\nOption B: Pack of 10 items for ₹${packB_price} (₹${packB_price / packB_qty} per item)\n\nWhich option offers the lower cost PER ITEM?`;
    const correctAnswer = `Option B (₹${packB_price / packB_qty}/item vs ₹${packA_price / packA_qty}/item)`;

    const options: PuzzleOption[] = [
      { id: 'ob', label: `Option B (₹${packB_price / packB_qty}/item vs ₹${packA_price / packA_qty}/item)`, value: `Option B (₹${packB_price / packB_qty}/item vs ₹${packA_price / packA_qty}/item)`, isCorrect: true },
      { id: 'oa', label: `Option A (₹${packA_price / packA_qty}/item)`, value: `Option A` },
      { id: 'oe', label: 'Both packs have identical per-item cost', value: 'Identical' },
      { id: 'ox', label: 'Cannot be determined without quantity needed', value: 'Undetermined' },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `rw_shop_${Date.now()}_${Math.random()}`,
      category: 'REAL_WORLD',
      title: 'UNIT PRICE ECONOMIC OPTIMIZATION',
      description: 'Compute unit costs to determine maximum purchasing value.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: `Option B (₹${packB_price / packB_qty}/item vs ₹${packA_price / packA_qty}/item)`,
      options,
      timeLimitSeconds: Math.max(10, 16 - difficulty),
      difficulty,
      hint: 'Divide total package price by the number of units in each package.',
      forgeDialogue: {
        intro: `FORGE: Unit valuation protocol initialized. Identify maximum efficiency option.`,
        success: `FORGE: Unit price calculated accurately. Capital efficiency maximized.`,
        failure: `FORGE: Unit valuation error. Higher per-unit cost chosen.`,
      }
    };
  } else {
    // Digital Technology / Storage Conversion
    const gb = 4;
    const mbPerFile = 800;
    const totalMb = gb * 1024; // 4096 MB
    const maxFiles = Math.floor(totalMb / mbPerFile); // 5 files

    const question = `A USB flash drive has ${gb} GB of usable storage space (1 GB = 1024 MB). How many 800 MB video files can fit completely onto the drive?`;
    const correctAnswer = `${maxFiles} files`;

    const options: PuzzleOption[] = [
      { id: 'c', label: `${maxFiles} files`, value: `${maxFiles} files`, isCorrect: true },
      { id: 'd1', label: `${maxFiles + 1} files`, value: `${maxFiles + 1} files` },
      { id: 'd2', label: `${maxFiles - 1} files`, value: `${maxFiles - 1} files` },
      { id: 'd3', label: `6 files`, value: `6 files` },
    ].sort(() => Math.random() - 0.5);

    return {
      id: `rw_tech_${Date.now()}_${Math.random()}`,
      category: 'REAL_WORLD',
      title: 'DIGITAL STORAGE CAPACITY CONVERSION',
      description: 'Convert digital storage units (GB to MB) and calculate maximum discrete item capacity.',
      inputType: 'MULTIPLE_CHOICE',
      questionText: question,
      correctAnswer: `${maxFiles} files`,
      options,
      timeLimitSeconds: Math.max(10, 18 - difficulty),
      difficulty,
      hint: 'Multiply GB by 1024 to convert to MB, then divide by 800 and drop fractional remainders.',
      forgeDialogue: {
        intro: `FORGE: Storage allocation audit. Compute discrete file capacity.`,
        success: `FORGE: Storage allocation precise. Buffer overflow avoided.`,
        failure: `FORGE: Storage capacity miscalculated. Overflow error.`,
      }
    };
  }
}
