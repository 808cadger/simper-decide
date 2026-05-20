(function () {
  'use strict';

  const TOPICS = {
    auto: ['car', 'auto', 'vehicle', 'engine', 'brake', 'tire', 'battery', 'oil', 'transmission', 'check engine', 'noise', 'leak', 'vin'],
    life: ['life', 'relationship', 'family', 'parent', 'emotion', 'mental', 'health', 'stress', 'home', 'medical', 'fitness', 'nutrition'],
    career: ['career', 'job', 'resume', 'interview', 'boss', 'coworker', 'promotion', 'salary', 'business', 'school', 'education'],
    money: ['money', 'finance', 'debt', 'budget', 'tax', 'insurance', 'rent', 'mortgage', 'retirement', 'invest', 'loan', 'credit'],
    planning: ['plan', 'schedule', 'trip', 'travel', 'move', 'project', 'deadline', 'goal', 'wedding', 'event', 'organize'],
    general: ['decision', 'choose', 'advice', 'help', 'problem', 'issue', 'question']
  };

  const TOPIC_META = {
    auto: {
      label: 'Auto',
      firstQuestion: 'What vehicle issue are you dealing with, and is it safe to drive right now?',
      questions: [
        'What year, make, model, mileage, and engine do you have?',
        'What symptoms do you notice: sounds, smells, warning lights, leaks, vibration, or behavior changes?',
        'When did it start, and what happened right before it started?',
        'Can you upload a photo or short video of the warning light, leak, tire, damage, or sound source?',
        'What outcome do you want: quick triage, DIY fix, repair estimate, or shop talking points?'
      ],
      risk: 'Do not drive if braking, steering, overheating, fuel smell, smoke, or severe tire damage is involved.'
    },
    life: {
      label: 'Life',
      firstQuestion: 'What is the situation, and what would a good outcome look like for you?',
      questions: [
        'Who is affected by this decision, and what constraints matter most?',
        'What have you already tried, and what happened?',
        'What feels urgent versus important here?',
        'What are you trying to avoid?',
        'Would a photo, document, or screenshot help explain the situation?'
      ],
      risk: 'For safety, health, legal, or crisis concerns, involve qualified local help immediately.'
    },
    career: {
      label: 'Career',
      firstQuestion: 'What career decision or work problem are you trying to solve?',
      questions: [
        'What role, industry, and level are you at now?',
        'What are your top priorities: pay, growth, stability, flexibility, purpose, or location?',
        'What options are currently available to you?',
        'What deadline or external pressure is attached to this?',
        'Can you upload a resume, job post screenshot, offer, or message if relevant?'
      ],
      risk: 'Avoid quitting, signing, or escalating until you understand the financial and reputational downside.'
    },
    money: {
      label: 'Money',
      firstQuestion: 'What money decision are you facing, and what numbers are involved?',
      questions: [
        'What are the amounts, due dates, interest rates, income, or budget limits?',
        'What is the goal: save money, reduce risk, get approved, recover from debt, or choose an option?',
        'What happens if you do nothing for 30 days?',
        'What documents, bill screenshots, estimates, or offers can you upload?',
        'How much uncertainty or risk can you tolerate?'
      ],
      risk: 'Verify contracts, rates, taxes, and penalties before moving money or signing anything.'
    },
    planning: {
      label: 'Planning',
      firstQuestion: 'What are you planning, and what date or deadline matters most?',
      questions: [
        'What does done look like?',
        'What resources do you have: time, budget, people, tools, or transportation?',
        'What are the biggest blockers or dependencies?',
        'What must happen first?',
        'Would photos, screenshots, receipts, maps, or documents help build the plan?'
      ],
      risk: 'The main risk is hidden dependencies. Confirm dates, owners, and costs before committing.'
    },
    general: {
      label: 'General',
      firstQuestion: 'Tell me the decision or problem in one or two sentences.',
      questions: [
        'What outcome are you hoping for?',
        'What options are already on the table?',
        'What constraints should I respect?',
        'What would make this advice more useful: speed, cost, safety, quality, or simplicity?',
        'Is there any photo, video, document, or screenshot that would change the answer?'
      ],
      risk: 'When stakes are high, slow down and validate assumptions before acting.'
    }
  };

  const PERSONAS = {
    practical: 'Practical',
    calm: 'Calm',
    direct: 'Direct',
    coach: 'Coach'
  };

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function classifyTopic(text) {
    const t = normalize(text);
    let best = { topic: 'general', score: 0 };
    Object.keys(TOPICS).forEach(topic => {
      const score = TOPICS[topic].reduce((sum, word) => sum + (t.includes(word) ? 1 : 0), 0);
      if (score > best.score) best = { topic, score };
    });
    return best.topic;
  }

  function createMemory() {
    return {
      topic: null,
      phase: 'greeting',
      answers: [],
      media: [],
      result: null,
      confidence: 0,
      needsReview: false,
      persona: 'practical',
      updatedAt: new Date().toISOString()
    };
  }

  function ensureMemory(session) {
    if (!session.memory) session.memory = createMemory();
    if (!Array.isArray(session.memory.answers)) session.memory.answers = [];
    if (!Array.isArray(session.memory.media)) session.memory.media = [];
    return session.memory;
  }

  function greeting(name) {
    const who = name ? ', ' + name : '';
    return {
      type: 'question',
      topic: 'general',
      confidence: 0.4,
      needsReview: false,
      summary: 'I am your avatar advisor' + who + '. Choose a topic or describe what you are dealing with.',
      question: 'What do you need help with today: car, life, career, money, planning, or something general?',
      json: null
    };
  }

  function nextQuestion(memory) {
    const meta = TOPIC_META[memory.topic || 'general'];
    const asked = memory.answers.length;
    if (asked === 0) return meta.firstQuestion;
    return meta.questions[Math.min(asked - 1, meta.questions.length - 1)];
  }

  function confidenceFor(memory) {
    const answers = memory.answers.length;
    const mediaBoost = memory.media.length > 0 ? 0.12 : 0;
    return Math.min(0.92, 0.38 + answers * 0.13 + mediaBoost);
  }

  function highStakes(memory) {
    const text = normalize(memory.answers.map(a => a.text).join(' '));
    return /suicide|harm|abuse|violence|chest pain|stroke|fire|smoke|lawsuit|eviction|arrest|bankrupt|overheating|brake|steering|fuel smell/.test(text);
  }

  function summarizeFacts(memory) {
    return memory.answers.slice(-4).map((answer, index) => (index + 1) + '. ' + answer.text).join(' ');
  }

  function buildResult(memory) {
    const topic = memory.topic || 'general';
    const meta = TOPIC_META[topic];
    const confidence = confidenceFor(memory);
    const review = highStakes(memory) || confidence < 0.64;
    const facts = summarizeFacts(memory);
    const mediaTypes = memory.media.map(item => item.kind).join(', ') || 'none';
    const options = [
      {
        title: 'Stabilize the situation',
        action: topic === 'auto'
          ? 'Stop driving if there is a safety symptom, record the symptom, and check basics like lights, fluid level, tire condition, and battery connections.'
          : 'Write down the facts, deadline, people involved, and the cost of waiting.',
        risk: 'Acting too fast can hide the real cause or create a bigger problem.'
      },
      {
        title: 'Compare the realistic choices',
        action: 'List the top two or three paths, then compare cost, time, risk, reversibility, and who needs to approve.',
        risk: 'A choice can look good until you price the downside and the next dependency.'
      },
      {
        title: 'Take the next smallest useful step',
        action: topic === 'money'
          ? 'Verify the numbers, due dates, rates, fees, and written terms before paying, borrowing, or signing.'
          : 'Pick one action you can complete today that reduces uncertainty without locking you into a bad path.',
        risk: meta.risk
      }
    ];

    return {
      topic,
      topicLabel: meta.label,
      confidence: Number(confidence.toFixed(2)),
      needsReview: review,
      reviewReason: review ? 'Higher-stakes or incomplete information. Confirm details before acting.' : 'Enough session context for practical next steps.',
      practicalAdvice: 'Based on your session facts: ' + facts,
      mediaAnalyzed: mediaTypes,
      options,
      nextSteps: [
        'Confirm the missing facts and deadlines.',
        'Choose the lowest-risk option that moves the situation forward.',
        'Upload relevant media or documents if visual details would change the advice.'
      ],
      summary: meta.label + ' advice: stabilize the issue, compare realistic choices, then take the smallest step that reduces uncertainty.'
    };
  }

  function naturalSummary(result, persona) {
    const tone = PERSONAS[persona] || PERSONAS.practical;
    const review = result.needsReview ? ' I would treat this as review-needed before any irreversible step.' : '';
    return tone + ' read: ' + result.summary + review + ' Best first move: ' + result.nextSteps[0];
  }

  function nextTurn(session, userText, persona) {
    const memory = ensureMemory(session);
    const text = String(userText || '').trim();
    memory.persona = persona || memory.persona || 'practical';

    if (!text) return greeting('');

    if (!memory.topic) memory.topic = classifyTopic(text);
    memory.answers.push({ text, at: new Date().toISOString() });
    memory.confidence = confidenceFor(memory);
    memory.needsReview = highStakes(memory) || memory.confidence < 0.64;
    memory.updatedAt = new Date().toISOString();

    if (memory.answers.length < 3 && !/\b(result|advice|options|next steps|summary|json)\b/i.test(text)) {
      const meta = TOPIC_META[memory.topic] || TOPIC_META.general;
      return {
        type: 'question',
        topic: memory.topic,
        confidence: Number(memory.confidence.toFixed(2)),
        needsReview: memory.needsReview,
        summary: 'Classified as ' + meta.label + '. I need one more detail before recommending options.',
        question: nextQuestion(memory),
        json: null
      };
    }

    const result = buildResult(memory);
    memory.result = result;
    memory.phase = 'result';
    return {
      type: 'result',
      topic: result.topic,
      confidence: result.confidence,
      needsReview: result.needsReview,
      summary: naturalSummary(result, memory.persona),
      question: 'Want to go deeper on option 1, 2, or 3?',
      json: result
    };
  }

  function addMedia(session, file) {
    const memory = ensureMemory(session);
    const kind = file && file.type && file.type.indexOf('video/') === 0 ? 'video' : 'photo';
    memory.media.push({
      id: Date.now().toString(),
      name: file && file.name ? file.name : kind + '-capture',
      kind,
      type: file && file.type ? file.type : '',
      size: file && file.size ? file.size : 0,
      at: new Date().toISOString(),
      status: 'intake-only'
    });
    memory.updatedAt = new Date().toISOString();
    return memory.media[memory.media.length - 1];
  }

  window.SimperAdvisor = {
    TOPIC_META,
    PERSONAS,
    createMemory,
    ensureMemory,
    classifyTopic,
    nextTurn,
    addMedia,
    greeting
  };
})();
