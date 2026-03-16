import React, { useState } from 'react';
import api from '../services/api';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/ask', { message: question });
      setAnswer(response.data.answer);
    } catch (err) {
      setAnswer('Ошибка при обращении к ИИ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ИИ-помощник Прометей</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Задайте вопрос по учебной теме..."
      />
      <button onClick={handleAsk} disabled={loading}>Спросить</button>
      {loading && <p>Думаю...</p>}
      {answer && <div><strong>Ответ:</strong> {answer}</div>}
    </div>
  );
};

export default AIAssistant;
