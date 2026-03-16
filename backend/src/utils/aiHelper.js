const AIKnowledge = require('../models/aiKnowledge.model');

const findBestAnswer = async (query) => {
  const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  if (queryWords.length === 0) return 'Пожалуйста, задайте более конкретный вопрос.';

  const entries = await AIKnowledge.findRelevant(query);
  if (entries.length === 0) {
    return 'Я пока не знаю ответа на этот вопрос. Попросите учителя добавить информацию в базу знаний.';
  }

  // Simple relevance: choose first with highest keyword overlap
  let bestEntry = null;
  let maxOverlap = 0;
  for (const entry of entries) {
    const overlap = entry.keywords.filter(kw => queryWords.includes(kw)).length;
    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      bestEntry = entry;
    }
  }

  // If we have a pattern match, check regex
  if (bestEntry.question_pattern) {
    const regex = new RegExp(bestEntry.question_pattern, 'i');
    if (regex.test(query)) {
      return bestEntry.answer_template; // Could use template substitution
    }
  }

  return bestEntry.answer_template;
};

module.exports = { findBestAnswer };
