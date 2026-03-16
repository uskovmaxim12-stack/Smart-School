import React, { useState } from 'react';
import { mockApi } from '../services/mockApi';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Button/Button';
import Input from '../components/ui/Input/Input';
import styles from './AIAssistant.module.css';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = () => {
    if (!question.trim()) return;
    setLoading(true);
    // Имитация задержки
    setTimeout(() => {
      const knowledge = mockApi.getAIContext();
      const words = question.toLowerCase().split(/\W+/);
      let bestAnswer = 'Я не знаю ответа на этот вопрос. Попросите учителя добавить информацию в базу знаний.';
      for (let entry of knowledge) {
        if (entry.keywords.some(kw => words.includes(kw))) {
          bestAnswer = entry.answer;
          break;
        }
      }
      setAnswer(bestAnswer);
      setHistory(prev => [...prev, { question, answer: bestAnswer }]);
      setQuestion('');
      setLoading(false);
    }, 800);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🤖 ИИ-помощник «Прометей»</h1>
      <div className={styles.chat}>
        <div className={styles.messages}>
          {history.map((item, idx) => (
            <div key={idx} className={styles.messageGroup}>
              <div className={styles.userMessage}>{item.question}</div>
              <div className={styles.aiMessage}>{item.answer}</div>
            </div>
          ))}
          {answer && !history.length && (
            <div className={styles.aiMessage}>{answer}</div>
          )}
          {loading && <div className={styles.aiMessage}>Думаю...</div>}
        </div>
        <div className={styles.inputArea}>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Задайте вопрос..."
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          />
          <Button onClick={handleAsk} disabled={loading}>Спросить</Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
