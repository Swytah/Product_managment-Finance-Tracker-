import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import SpendingChart from './components/SpendingChart';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Data states
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [savingName, setSavingName] = useState('');
  const [savingAmount, setSavingAmount] = useState('');
  const [goal, setGoal] = useState(0);
  const [savedGoal, setSavedGoal] = useState(0);
  const [activeTab, setActiveTab] = useState('expenses');

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setIsAuthenticated(true);
      loadUserData(parsedUser.email);
    }
  }, []);

  const loadUserData = (email) => {
    const savedExpenses = localStorage.getItem(`expenses_${email}`);
    const savedSavings = localStorage.getItem(`savings_${email}`);
    const savedGoal = localStorage.getItem(`goal_${email}`);
    
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedSavings) setSavings(JSON.parse(savedSavings));
    if (savedGoal) setSavedGoal(parseFloat(savedGoal));
  };

  const saveUserData = () => {
    if (currentUser) {
      localStorage.setItem(`expenses_${currentUser.email}`, JSON.stringify(expenses));
      localStorage.setItem(`savings_${currentUser.email}`, JSON.stringify(savings));
      localStorage.setItem(`goal_${currentUser.email}`, savedGoal.toString());
    }
  };

  useEffect(() => {
    if (currentUser) {
      saveUserData();
    }
  }, [expenses, savings, savedGoal, currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    loadUserData(user.email);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setExpenses([]);
    setSavings([]);
    setSavedGoal(0);
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;
    
    const newExpense = {
      id: Date.now(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
      date: new Date().toLocaleDateString()
    };
    
    setExpenses([newExpense, ...expenses]);
    setExpenseName('');
    setExpenseAmount('');
  };

  const addSaving = (e) => {
    e.preventDefault();
    if (!savingName || !savingAmount) return;
    
    const newSaving = {
      id: Date.now(),
      name: savingName,
      amount: parseFloat(savingAmount),
      date: new Date().toLocaleDateString()
    };
    
    setSavings([newSaving, ...savings]);
    setSavingName('');
    setSavingAmount('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteSaving = (id) => {
    setSavings(savings.filter(s => s.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);
  const percent = savedGoal > 0 ? Math.min((totalSavings / savedGoal) * 100, 100) : 0;

  const exportCSV = () => {
    let csv = '=== EXPENSES ===\n';
    csv += 'Name,Amount (INR),Date\n';
    expenses.forEach(e => { csv += `${e.name},${e.amount},${e.date}\n`; });
    
    csv += '\n=== SAVINGS (INVESTMENTS) ===\n';
    csv += 'Name,Amount (INR),Date\n';
    savings.forEach(s => { csv += `${s.name},${s.amount},${s.date}\n`; });
    
    csv += `\n=== SUMMARY ===\n`;
    csv += `Total Expenses,${totalExpenses}\n`;
    csv += `Total Savings,${totalSavings}\n`;
    csv += `Investment Goal,${savedGoal}\n`;
    csv += `Remaining to Goal,${Math.max(0, savedGoal - totalSavings)}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `finance_${currentUser?.email}_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <div className="logo-small">💰 Finance Tracker</div>
        <div className="user-info">
          <span>👋 Welcome, {currentUser?.name || currentUser?.email?.split('@')[0]}!</span>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </div>

      <h1>💰 Finance Tracker</h1>
      <p className="subtitle">Track expenses separately from investments</p>

      {/* Charts Section - NEW */}
      <SpendingChart expenses={expenses} savings={savings} goal={savedGoal} />

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
          📝 Expenses
        </button>
        <button className={`tab ${activeTab === 'savings' ? 'active' : ''}`} onClick={() => setActiveTab('savings')}>
          💰 Savings/Investments
        </button>
      </div>

      {/* Add Expense Form */}
      {activeTab === 'expenses' && (
        <div className="card">
          <h2>📝 Add Expense</h2>
          <p className="info-text">Expenses do NOT affect your investment goal</p>
          <form onSubmit={addExpense}>
            <input type="text" placeholder="e.g., Coffee, Rent, Groceries" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} required />
            <input type="number" placeholder="Amount (₹)" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required />
            <button type="submit">+ Add Expense</button>
          </form>
        </div>
      )}

      {/* Add Saving Form */}
      {activeTab === 'savings' && (
        <div className="card">
          <h2>💰 Add Savings / Investment</h2>
          <p className="info-text">Savings DO affect your investment goal</p>
          <form onSubmit={addSaving}>
            <input type="text" placeholder="e.g., FD, Mutual Fund, Stocks" value={savingName} onChange={(e) => setSavingName(e.target.value)} required />
            <input type="number" placeholder="Amount (₹)" value={savingAmount} onChange={(e) => setSavingAmount(e.target.value)} required />
            <button type="submit">+ Add Savings</button>
          </form>
        </div>
      )}

      {/* Investment Goal Section */}
      <div className="card goal-card">
        <h2>🎯 Investment Goal</h2>
        <div className="goal-input">
          <input type="number" placeholder="Set your goal (₹)" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <button onClick={() => { setSavedGoal(goal); }}>Set Goal</button>
        </div>
        
        {savedGoal > 0 && (
          <>
            <div className="progress-info">
              <span>💰 Total Saved: ₹{totalSavings.toLocaleString()}</span>
              <span>🎯 Goal: ₹{savedGoal.toLocaleString()}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${percent}%` }}>{Math.round(percent)}%</div>
            </div>
            <p className="progress-text">
              {totalSavings >= savedGoal ? '🎉 Congratulations! You reached your investment goal! 🎉' : `Need ₹${(savedGoal - totalSavings).toLocaleString()} more to reach your goal`}
            </p>
          </>
        )}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card expenses-summary">
          <div className="summary-icon">📝</div>
          <div className="summary-label">Total Expenses</div>
          <div className="summary-amount">₹{totalExpenses.toLocaleString()}</div>
        </div>
        <div className="summary-card savings-summary">
          <div className="summary-icon">💰</div>
          <div className="summary-label">Total Savings</div>
          <div className="summary-amount">₹{totalSavings.toLocaleString()}</div>
        </div>
      </div>

      {/* Reminder */}
      {savedGoal > 0 && totalSavings < savedGoal * 0.3 && totalSavings > 0 && (
        <div className="reminder">
          ⏰ Reminder: You're only at {Math.round(percent)}% of your investment goal! Need ₹{(savedGoal - totalSavings).toLocaleString()} more.
        </div>
      )}

      {/* Expenses List */}
      <div className="card">
        <h2>📊 Expenses ({expenses.length})</h2>
        {expenses.length === 0 ? <p className="empty">No expenses yet. Add your first expense above! ✨</p> : (
          <ul className="item-list">
            {expenses.map(exp => (
              <li key={exp.id}>
                <div className="item-info"><strong>{exp.name}</strong><small>{exp.date}</small></div>
                <div className="item-actions"><span className="amount expense-amount">-₹{exp.amount.toLocaleString()}</span><button className="delete-btn" onClick={() => deleteExpense(exp.id)}>Delete</button></div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Savings List */}
      <div className="card">
        <h2>💰 Savings / Investments ({savings.length})</h2>
        {savings.length === 0 ? <p className="empty">No savings yet. Add your first investment above! ✨</p> : (
          <ul className="item-list">
            {savings.map(sav => (
              <li key={sav.id}>
                <div className="item-info"><strong>{sav.name}</strong><small>{sav.date}</small></div>
                <div className="item-actions"><span className="amount savings-amount">+₹{sav.amount.toLocaleString()}</span><button className="delete-btn" onClick={() => deleteSaving(sav.id)}>Delete</button></div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Export Button */}
      <div className="card">
        <button className="export-btn" onClick={exportCSV}>📎 Export All Data to Excel (CSV)</button>
      </div>
    </div>
  );
}

export default App;