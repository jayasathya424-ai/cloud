import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'other';
  date: string;
}

interface BudgetTrackerProps {
  budget: any;
  setBudget: (budget: any) => void;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({  }) => {
  const [totalBudget, setTotalBudget] = useState(2000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: 0,
    category: 'other' as Expense['category'],
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    accommodation: { label: 'Accommodation', color: 'bg-purple-500', icon: '🏨' },
    transport: { label: 'Transport', color: 'bg-blue-500', icon: '🚗' },
    food: { label: 'Food & Dining', color: 'bg-orange-500', icon: '🍽️' },
    activities: { label: 'Activities', color: 'bg-green-500', icon: '🎯' },
    shopping: { label: 'Shopping', color: 'bg-pink-500', icon: '🛍️' },
    other: { label: 'Other', color: 'bg-gray-500', icon: '📝' }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const budgetUsedPercent = (totalExpenses / totalBudget) * 100;

  const categoryTotals = Object.keys(categories).reduce((acc, category) => {
    acc[category] = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return acc;
  }, {} as Record<string, number>);

  const addExpense = () => {
    if (newExpense.title && newExpense.amount > 0) {
      const expense: Expense = {
        id: Date.now().toString(),
        ...newExpense
      };
      setExpenses([...expenses, expense]);
      setNewExpense({
        title: '',
        amount: 0,
        category: 'other',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddExpense(false);
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Budget</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2"> ₹{totalBudget}</div>
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Spent</h3>
            <TrendingUp className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2"> ₹{totalExpenses}</div>
          <div className="text-sm text-gray-600">{budgetUsedPercent.toFixed(1)}% of budget</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Remaining</h3>
            <TrendingDown className={`w-6 h-6 ${remainingBudget >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <div className={`text-3xl font-bold mb-2 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
             ₹{remainingBudget}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${budgetUsedPercent > 100 ? 'bg-red-500' : budgetUsedPercent > 80 ? 'bg-orange-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(categories).map(([key, category]) => {
              const amount = categoryTotals[key];
              const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="text-sm text-gray-600">{category.icon} {category.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold"> ₹{amount}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Add Expense Form */}
          {showAddExpense && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Expense title"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount || ''}
                    onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value as Expense['category']})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {Object.entries(categories).map(([key, category]) => (
                      <option key={key} value={key}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddExpense(false)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addExpense}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💰</div>
                <p>No expenses recorded yet</p>
              </div>
            ) : (
              expenses.slice().reverse().map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{categories[expense.category].icon}</span>
                    <div>
                      <div className="font-medium text-sm">{expense.title}</div>
                      <div className="text-xs text-gray-500">{expense.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${expense.amount}</div>
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;