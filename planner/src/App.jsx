import React, { useState, useEffect } from 'react';
import { PlusCircle, Bug, Sparkles, Paintbrush, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/feedback';

function App() {
  const [data, setData] = useState({ bugs: [], features: [], polish: [] });
  const [activeTab, setActiveTab] = useState('features');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Could not load feedback", err));
  }, []);

  const saveFeedback = async (newData) => {
    setData(newData);
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false
    };

    saveFeedback({
      ...data,
      [activeTab]: [...data[activeTab], newItem]
    });
    setInputValue('');
  };

  const toggleComplete = (tab, id) => {
    const updatedTab = data[tab].map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveFeedback({ ...data, [tab]: updatedTab });
  };

  const deleteItem = (tab, id) => {
    const updatedTab = data[tab].filter(item => item.id !== id);
    saveFeedback({ ...data, [tab]: updatedTab });
  };

  const tabs = [
    { id: 'features', label: 'Features', icon: <Sparkles size={18} /> },
    { id: 'bugs', label: 'Bugs', icon: <Bug size={18} /> },
    { id: 'polish', label: 'UI Polish', icon: <Paintbrush size={18} /> }
  ];

  return (
    <div className="app-container">
      <header className="header">
        <h1>Kaizen Launch Planner</h1>
        <p>List exactly what needs to be built before giving this to your friends.</p>
      </header>

      <div className="tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <main className="main-content">
        <form onSubmit={handleAdd} className="input-form">
          <input 
            type="text" 
            placeholder={`Add a new ${activeTab.slice(0, -1)}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="add-btn">
            <PlusCircle size={20} />
            <span>Add</span>
          </button>
        </form>

        <ul className="task-list">
          {data[activeTab].map(item => (
            <li key={item.id} className={`task-item ${item.completed ? 'completed' : ''}`}>
              <div className="task-checkbox" onClick={() => toggleComplete(activeTab, item.id)}>
                {item.completed && <div className="task-checkbox-inner"></div>}
              </div>
              <span className="task-text">{item.text}</span>
              <button className="delete-btn" onClick={() => deleteItem(activeTab, item.id)}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
          {data[activeTab].length === 0 && (
            <div className="empty-state">
              <p>No {activeTab} listed yet.</p>
            </div>
          )}
        </ul>
      </main>
    </div>
  );
}

export default App;
