//    Linking from HTML 
let balance = document.querySelector("#balance");
let incAmt = document.querySelector("#inc-amt"); 
let expAmt = document.querySelector("#exp-amt"); 
let description =  document.querySelector("#desc"); 
let amount =  document.querySelector("#amount"); 
let form = document.querySelector("#form");
let trans = document.querySelector("#trans")

// Local Storage getting
const localStoragetrans = JSON.parse(localStorage.getItem("trans"));
let transactions = localStorage.getItem("trans")!==null?localStoragetrans :[];

// Loading the input box to Transaction column and setting it to (red or green)colour by class name
function loadTransactionDetails(transaction){

    // create list in transaction side 
    const li = document.createElement("li");
    li.classList.add(transaction.amount < 0 ? "expense" : "income");
    li.innerHTML= transaction.description;
    trans.appendChild(li);

    // create amount inside list in transaction side 
    const span = document.createElement("span");
    span.classList.add("amtInList");
    span.innerHTML = transaction.amount;
    li.appendChild(span);

    // create delete button to delete transaction details 
    const button = document.createElement("button");
    button.classList.add("btn-del");
    button.innerHTML ="x";
    li.appendChild(button);
    button.addEventListener("click",function(){
        removeTrans(transaction.id)
    });   
}

// Removing the transaction from Transaction column
function removeTrans(id){
    if(confirm("Are you sure you want to delete Transaction?")){
        transactions = transactions.filter((transaction) => transaction.id != id);
        config();
        updateLocalStorage();
    }   
}

// Updating the balance and (income & expense)
function updateAmount(){
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item),0);
    balance.innerHTML=(total>=0)?"₹ "+Math.abs(total).toFixed(2):"- ₹ "+Math.abs(total).toFixed(2);

    const income = amounts.filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0);
    incAmt.innerHTML ="₹ "+Math.abs(income);

    const expense = amounts.filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0);
    expAmt.innerHTML ="₹ "+Math.abs(expense);
}

window.addEventListener("load",config);
// config function created to refresh the page when every changes and updation occur 
function config(){
    trans.innerHTML ="";
    transactions.forEach(loadTransactionDetails);
    updateAmount();
}

form.addEventListener("submit", addTransaction);
// addTransaction function is created to add the input from user to transaction column by clicking Add Transaction button 
function addTransaction(e){
    e.preventDefault();
    if(description.value.trim()=="" && amount.value.trim()){
        alert("Please enter description and amount.");
    }
    else{
        const transaction = { id: uniqueId(), description: description.value, amount: +amount.value}
        transactions.push(transaction);
        loadTransactionDetails(transaction);
        description.value = "";
        amount.value = "";
        updateAmount();
        updateLocalStorage();
        }
    }

    // Unique ID is created to add id to array in local storage 
   function uniqueId(){
        return Math.floor(Math.random()*10000000);
    }

// Local Storage setting 
function updateLocalStorage(){
    localStorage.setItem("trans", JSON.stringify(transactions));
}

