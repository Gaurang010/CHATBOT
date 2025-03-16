import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const App = () => {
  const questions = [
    "What is your age?",
    "What is your gender? (Male/Female)",
    "Do you have any allergies? (Yes/No)",
    "Do you have a history of heart disease?",
    "Do you smoke?",
    "How often do you exercise?",
    "Do you have any chronic conditions? (e.g. diabetes)",
    "Are you currently on any medication?",
    "Do you have any family history of serious illnesses?",
    "Have you had any recent surgeries?",
    "Are you experiencing any pain or discomfort?",
    "Have you traveled outside the country recently?"
  ];

  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (userInput) {
      const updatedHistory = [
        ...chatHistory,
        { sender: 'bot', message: questions[currentQuestionIndex] },
        { sender: 'user', message: userInput }
      ];
      setChatHistory(updatedHistory);
      setUserInput('');
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        socket.emit('userAnswers', updatedHistory);
        setIsLoading(true);
      }
    }
  };

  useEffect(() => {
    socket.on('generatedQuestions', (data) => {
      setIsLoading(false);
      setChatHistory([...chatHistory, { sender: 'bot', message: data.questions }]);
    });
  }, [chatHistory]);

  return (
    <div style={styles.container}>
      <div style={styles.chatArea}>
        <div style={styles.chatHistory}>
          {chatHistory.map((chat, index) => (
            <div key={index} style={styles.messageContainer(chat.sender)}>
              <div style={styles.messageBox(chat.sender)}>
                {chat.message}
              </div>
            </div>
          ))}
          {!isLoading && currentQuestionIndex < questions.length && (
            <div style={styles.messageContainer('bot')}>
              <div style={styles.messageBox('bot')}>
                {questions[currentQuestionIndex]}
              </div>
            </div>
          )}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={styles.inputField}
            placeholder="Type your answer..."
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            style={styles.submitButton}
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#111', color: '#fff' },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' },
  chatHistory: { flex: 1, overflowY: 'auto' },
  messageContainer: (sender) => ({ textAlign: sender === 'user' ? 'right' : 'left', marginBottom: '10px' }),
  messageBox: (sender) => ({ display: 'inline-block', padding: '10px 15px', backgroundColor: sender === 'user' ? '#4CAF50' : '#444', borderRadius: '10px', maxWidth: '70%', color: '#fff' }),
  inputContainer: { display: 'flex', padding: '10px', backgroundColor: '#333', borderRadius: '10px' },
  inputField: { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#444', color: '#fff' },
  submitButton: { marginLeft: '10px', padding: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }
};

export default App;
