const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionsList = document.getElementById('transactions');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value;

  if (!text || !amount) return;

  const transaction = {
    id: Date.now(),
    text,
    amount
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  form.reset();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
}

function renderTransactions() {
  transactionsList.innerHTML = '';

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
      ${t.text} <span>${t.amount > 0 ? '+' : ''}₹${Math.abs(t.amount)}</span>
      <button onclick="deleteTransaction(${t.id})">x</button>
    `;
    transactionsList.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, amt) => acc + amt, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0).toFixed(2);

  balanceEl.textContent = `₹${total}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${Math.abs(expense)}`;
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}



form.addEventListener('submit', addTransaction);
renderTransactions();
const exportBtn = document.getElementById('exportCsv');

exportBtn.addEventListener('click', exportToCSV);

function exportToCSV() {
  if (transactions.length === 0) {
    alert("No transactions to export");
    return;
  }

  let csv = "Description,Amount,Type\n";

  transactions.forEach(t => {
    const type = t.amount > 0 ? "Income" : "Expense";
    csv += `${t.text},${t.amount},${type}\n`;
  });

  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'expense-report.csv';
  a.click();

  URL.revokeObjectURL(url);
}

