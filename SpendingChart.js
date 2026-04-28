import React from 'react';

function SpendingChart({ expenses, savings, goal }) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);
  const remaining = Math.max(0, goal - totalSavings);
  const maxValue = Math.max(totalExpenses, totalSavings, remaining, 1);
  
  const expensePercent = (totalExpenses / maxValue) * 100;
  const savingsPercent = (totalSavings / maxValue) * 100;
  const remainingPercent = (remaining / maxValue) * 100;

  // Group expenses by category - FIXED: Convert to array properly
  const categories = {};
  expenses.forEach(exp => {
    const cat = exp.name.split(' ')[0];
    if (categories[cat]) {
      categories[cat] += exp.amount;
    } else {
      categories[cat] = exp.amount;
    }
  });
  
  // Convert categories object to array for mapping - THIS WAS THE BUG
  const categoryList = Object.keys(categories).map(cat => ({
    name: cat,
    amount: categories[cat]
  }));
  
  const totalCategoryAmount = categoryList.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
      {/* Expense Categories Chart */}
      <div className="card">
        <h3 style={{ textAlign: 'center' }}>📊 Expense Categories</h3>
        {expenses.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#ff8fb3' }}>No expenses yet. Add some expenses to see chart!</p>
        ) : (
          <div>
            {categoryList.map(cat => {
              const percent = (cat.amount / totalCategoryAmount) * 100;
              return (
                <div key={cat.name} style={{ margin: '15px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}>{cat.name}</span>
                    <span>₹{cat.amount.toLocaleString()}</span>
                  </div>
                  <div style={{ background: '#ffe0e8', borderRadius: '10px', height: '25px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        background: '#ff6b9d', 
                        width: `${percent}%`, 
                        height: '100%',
                        borderRadius: '10px',
                        lineHeight: '25px',
                        paddingLeft: '10px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    >
                      {Math.round(percent)}%
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ffe0e8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>₹{totalCategoryAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expenses vs Savings Bar Chart */}
      <div className="card">
        <h3 style={{ textAlign: 'center' }}>📈 Expenses vs Savings</h3>
        {expenses.length === 0 && savings.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#ff8fb3' }}>Add expenses or savings to see comparison!</p>
        ) : (
          <div>
            {/* Expenses Bar */}
            <div style={{ margin: '25px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>📝 Expenses</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#e74c3c' }}>₹{totalExpenses.toLocaleString()}</span>
              </div>
              <div style={{ background: '#ffe0e8', borderRadius: '10px', height: '35px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    background: '#e74c3c', 
                    width: `${expensePercent}%`, 
                    height: '100%', 
                    lineHeight: '35px', 
                    paddingLeft: '15px', 
                    color: 'white',
                    fontWeight: 'bold',
                    transition: 'width 0.5s ease'
                  }}
                >
                  {expensePercent > 15 ? `${Math.round(expensePercent)}%` : ''}
                </div>
              </div>
            </div>

            {/* Savings Bar */}
            <div style={{ margin: '25px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>💰 Savings</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#27ae60' }}>₹{totalSavings.toLocaleString()}</span>
              </div>
              <div style={{ background: '#ffe0e8', borderRadius: '10px', height: '35px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    background: '#27ae60', 
                    width: `${savingsPercent}%`, 
                    height: '100%', 
                    lineHeight: '35px', 
                    paddingLeft: '15px', 
                    color: 'white',
                    fontWeight: 'bold',
                    transition: 'width 0.5s ease'
                  }}
                >
                  {savingsPercent > 15 ? `${Math.round(savingsPercent)}%` : ''}
                </div>
              </div>
            </div>

            {/* Remaining to Goal Bar (only if goal is set) */}
            {goal > 0 && (
              <div style={{ margin: '25px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🎯 Remaining to Goal</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff6b9d' }}>₹{remaining.toLocaleString()}</span>
                </div>
                <div style={{ background: '#ffe0e8', borderRadius: '10px', height: '35px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      background: '#ff6b9d', 
                      width: `${remainingPercent}%`, 
                      height: '100%', 
                      lineHeight: '35px', 
                      paddingLeft: '15px', 
                      color: 'white',
                      fontWeight: 'bold',
                      transition: 'width 0.5s ease'
                    }}
                  >
                    {remainingPercent > 15 ? `${Math.round(remainingPercent)}%` : ''}
                  </div>
                </div>
              </div>
            )}

            {/* Summary Note */}
            <div style={{ marginTop: '20px', padding: '15px', background: '#fff5f7', borderRadius: '12px', textAlign: 'center' }}>
              <small style={{ color: '#666' }}>
                💡 Tip: {totalSavings > totalExpenses ? 
                  "Great job! Your savings are higher than expenses!" : 
                  "Try to save more than you spend to reach your goal faster!"}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpendingChart;