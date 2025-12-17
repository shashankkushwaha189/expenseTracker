const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionsList = document.getElementById('transactions');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const exportBtn = document.getElementById('exportCsv');

// Load data from LocalStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add a new transaction
function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value;

  if (!text || amount === 0) {
    alert("Please enter a valid description and amount");
    return;
  }

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

// Delete a transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
}

// Update the Balance, Income, and Expense numbers
function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  
  const total = amounts.reduce((acc, amt) => acc + amt, 0);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0);

  // Formatting with Indian Currency commas (e.g., ₹1,00,000.00)
  balanceEl.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  incomeEl.textContent = `₹${income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  expenseEl.textContent = `₹${Math.abs(expense).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

// Render the list into the scroll-area
function renderTransactions() {
  transactionsList.innerHTML = '';

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.classList.add(t.amount > 0 ? 'income' : 'expense');
    
    const sign = t.amount > 0 ? '+' : '-';
    
    li.innerHTML = `
      <div class="list-info">
        <span class="list-desc">${t.text}</span>
        <span class="list-amt">${sign}₹${Math.abs(t.amount).toLocaleString('en-IN')}</span>
      </div>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">×</button>
    `;
    transactionsList.appendChild(li);
  });

  updateSummary();
}

// Save to LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// CSV Export Logic
function exportToCSV() {
  if (transactions.length === 0) {
    alert("No transactions to export");
    return;
  }

  let csv = "Description,Amount,Type,Date\n";
  transactions.forEach(t => {
    const type = t.amount > 0 ? "Income" : "Expense";
    const date = new Date(t.id).toLocaleDateString();
    csv += `"${t.text}",${t.amount},${type},${date}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `Expense_Report_${new Date().toLocaleDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Event Listeners
form.addEventListener('submit', addTransaction);
exportBtn.addEventListener('click', exportToCSV);

// Initial Render
renderTransactions();