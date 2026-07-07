import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchExpenses();
    fetchUsers();
  }, []);

  const fetchExpenses = async () => {
    const response = await axios.get(
      "https://splitwise-clone-production-b7e6.up.railway.app/api/expenses",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setExpenses(response.data);
  };

  const addExpense = async () => {
    const splitAmong = users.map((user) => user._id);
    await axios.post(
      "https://splitwise-clone-production-b7e6.up.railway.app/api/expenses",
      { description, amount, splitAmong },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    fetchExpenses();
    setDescription("");
    setAmount("");
  };

  const deleteExpense = async (id) => {
    await axios.delete(
      `https://splitwise-clone-production-b7e6.up.railway.app/api/expenses/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    fetchExpenses();
  };

  const fetchUsers = async () => {
    const response = await axios.get(
      "https://splitwise-clone-production-b7e6.up.railway.app/api/auth/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setUsers(response.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const calculateBalances = () => {
    const balances = {};

    // Initialize every user with 0 balance
    users.forEach((user) => {
      balances[user._id] = { name: user.name, balance: 0 };
    });

    // Calculate balances from expenses
    expenses.forEach((expense) => {
      const splitCount = expense.splitAmong.length;
      if (splitCount === 0) return;

      const share = expense.amount / splitCount;

      // Payer gets credited full amount
      if (balances[expense.paidBy._id]) {
        balances[expense.paidBy._id].balance += expense.amount;
      }

      // Each person in splitAmong gets debited their share
      expense.splitAmong.forEach((userId) => {
        if (balances[userId]) {
          balances[userId].balance -= share;
        }
      });
    });

    return Object.values(balances);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Splitwise Clone</h1>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Add Expense Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
          />

          <button
            onClick={addExpense}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          >
            Add Expense
          </button>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>

          {expenses.length === 0 ? (
            <p className="text-gray-500">No expenses yet.</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <h3 className="font-medium">{expense.description}</h3>
                    <p className="text-gray-500 text-sm">
                      Rs. {expense.amount}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteExpense(expense._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Balances */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Balances</h2>
          {calculateBalances().map((user) => (
            <div
              key={user.name}
              className="flex justify-between items-center border-b pb-2 mb-2"
            >
              <span className="font-medium">{user.name}</span>
              <span
                className={
                  user.balance >= 0 ? "text-green-600" : "text-red-500"
                }
              >
                {user.balance >= 0 ? "Gets back" : "Owes"} Rs.{" "}
                {Math.abs(user.balance).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
