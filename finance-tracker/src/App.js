import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food');
  
  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  // Categories for grouping transactions
  const categories = {
    income: ['salary', 'freelance', 'investment', 'gift', 'other'],
    expense: ['food', 'transport', 'entertainment', 'housing', 'utilities', 'health', 'education', 'shopping', 'other']
  };
  
  // Add new transaction
  const addTransaction = (e) => {
    e.preventDefault();
    
    if (!description || !amount) {
      alert('Please fill in all fields');
      return;
    }
    
    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString().substr(0, 10)
    };
    
    setTransactions([...transactions, newTransaction]);
    
    // Clear the form
    setDescription('');
    setAmount('');
  };
  
  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };
  
  // Calculate totals
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);
    
  const totalExpense = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
    
  const balance = totalIncome - totalExpense;
  
  return (
    <div className="container">
      <h1>Personal Finance Tracker</h1>
      
      <div className="summary">
        <div className="summary-item">
          <h2>Income</h2>
          <p className="income">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <h2>Expense</h2>
          <p className="expense">${totalExpense.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <h2>Balance</h2>
          <p className={balance >= 0 ? "income" : "expense"}>${balance.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="add-transaction">
        <h2>Add New Transaction</h2>
        <form onSubmit={addTransaction}>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <input 
              type="text" 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Enter description..."
            />
          </div>
          
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="Enter amount..."
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="form-control">
            <label htmlFor="type">Type</label>
            <select 
              id="type" 
              value={type} 
              onChange={(e) => {
                setType(e.target.value);
                // Reset category when type changes
                setCategory(e.target.value === 'income' ? 'salary' : 'food');
              }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          
          <div className="form-control">
            <label htmlFor="category">Category</label>
            <select 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories[type].map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <button className="btn" type="submit">Add Transaction</button>
        </form>
      </div>
      
      <div className="transaction-history">
        <h2>Transaction History</h2>
        <ul className="list">
          {transactions.length === 0 ? (
            <li className="no-transactions">No transactions yet</li>
          ) : (
            transactions.map(transaction => (
              <li key={transaction.id} className={transaction.type === 'income' ? 'income-item' : 'expense-item'}>
                <div className="transaction-details">
                  <h3>{transaction.description}</h3>
                  <p className="transaction-category">{transaction.category}</p>
                  <p className="transaction-date">{transaction.date}</p>
                </div>
                <div className="transaction-amount">
                  <span>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</span>
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;