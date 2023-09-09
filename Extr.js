//    Linking from HTML
let balance = document.querySelector("#balance");
let incAmt = document.querySelector("#inc-amt");
let expAmt = document.querySelector("#exp-amt");
let description = document.querySelector("#desc");
let amtincome = document.querySelector("#amtincome");
let amtexpense = document.querySelector("#amtexpense");
let form = document.querySelector("#form");
let trans = document.querySelector("#trans");

// Local Storage getting
const localStoragetrans = JSON.parse(localStorage.getItem("trans"));
let transactions = localStorage.getItem("trans") !== null ? localStoragetrans : [];

// Loading the input box to Transaction column and setting it to (red or green)colour by class name
function loadTransactionDetails(transaction) {
  // create list in transaction side
  const li = document.createElement("li");
  li.classList.add(
    (transaction.amtincome ? "income" : "") ||
      (transaction.amtexpense ? "expense" : "")
  );
  li.innerHTML = transaction.description;
  trans.appendChild(li);

//   create date
  const date_create = document.createElement('span');
  date_create.classList.add('date')
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes();
  const getday = d.getDay();
  const day = days[getday];
  const formated_date = h +":"+ m + " " + day + " " + "(" + date + "/" + month + "/" + year + ")";
  date_create.innerHTML = formated_date
  li.appendChild(date_create)

  // create amount inside list in transaction side
  const span = document.createElement("span");
  span.classList.add("amtInList");
  span.innerHTML = transaction.amtincome || transaction.amtexpense;
  li.appendChild(span);

  // create delete button to delete transaction details
  const button = document.createElement("button");
  button.classList.add("btn-del");
  button.innerHTML = "x";
  li.appendChild(button);
  button.addEventListener("click", function () {
    removeTrans(transaction.id);
  });
}

// Removing the transaction from Transaction column
function removeTrans(id) {
  if (confirm("Are you sure you want to delete Transaction?")) {
    transactions = transactions.filter((transaction) => transaction.id != id);
    config();
    updateLocalStorage();
  }
}

// Updating the balance and (income & expense)
function updateAmount() {
  const amountsincome = transactions.map(
    (transaction) => transaction.amtincome || 0
  );
  const amountsexpense = transactions.map(
    (transaction) => transaction.amtexpense || 0
  );
  const totalincome = amountsincome.reduce(
    (acc, item) => (acc += parseFloat(item)),
    0
  );
  const totalexpense = amountsexpense.reduce(
    (acc, item) => (acc += parseFloat(item)),
    0
  );

  // Calculate the balance, use parseFloat to handle strings like "₹ 0.00"
  const balanceAmount = totalincome - totalexpense;
  const formattedBalance =
    balanceAmount >= 0
      ? "₹ " + balanceAmount.toFixed(2)
      : "- ₹ " + Math.abs(balanceAmount).toFixed(2);

  balance.innerHTML = formattedBalance;
  incAmt.innerHTML = "₹ " + Math.abs(totalincome);
  expAmt.innerHTML = "₹ " + Math.abs(totalexpense);
}

window.addEventListener("load", config);
// config function created to refresh the page when every changes and updation occur
function config() {
  trans.innerHTML = "";
  transactions.forEach(loadTransactionDetails);
  updateAmount();
}

form.addEventListener("submit", addTransaction);
// addTransaction function is created to add the input from user to transaction column by clicking Add Transaction button
function addTransaction(e) {
  e.preventDefault();
  if (
    description.value == "" &&
    (amtincome.value === null) ^ (amtexpense.value === null)
  ) {
    alert("Please enter description and amount.");
  } else {
    const transaction = {
      id: uniqueId(),
      description: description.value,
      amtincome: amtincome.value,
      amtexpense: amtexpense.value,
    };
    transactions.push(transaction);
    loadTransactionDetails(transaction);
    description.value = "";
    amtincome.value = null;
    amtexpense.value = null;
    updateAmount();
    updateLocalStorage();
  }
}

// Unique ID is created to add id to array in local storage
function uniqueId() {
  return Math.floor(Math.random() * 10000000);
}

// Local Storage setting
function updateLocalStorage() {
  localStorage.setItem("trans", JSON.stringify(transactions));
}
