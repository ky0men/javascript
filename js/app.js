var inputText = document.querySelector("#input-text");
var inputMoney = document.querySelector("#input-money");
var submitBtn = document.querySelector(".submit-btn");

//Add transaction
submitBtn.addEventListener("click", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  addHistory();
}
var income = 0,
  expense = 0;
//Add History
var amountDisplay = document.querySelector(".amount-display");
function addHistory() {
  if (inputMoney.value === "" || inputText.value === "") {
    showAlert("All fields cannot empty!", "fail");
  } else if (isNaN(Number(inputMoney.value))) {
    showAlert("Please input number on amount fields!", "fail");
  } else {
    var money = Number(inputMoney.value);

    //Caculate money
    if (inputMoney.value > 0) {
      // income = eval(income + inputMoney.value);
      income += money;
      var ouputAmount = document.createElement("div");
      ouputAmount.className = "amount-detail border-green";
      ouputAmount.innerHTML = `
        <div class="content">${inputText.value}</div>
        <div class="money">${inputMoney.value}</div>
        <div class="close">x</div>
    `;
    } else {
      // expense = Math.abs(eval(expense + inputMoney.value));
      expense += Math.abs(money);
      var ouputAmount = document.createElement("div");
      ouputAmount.className = "amount-detail border-red";
      ouputAmount.innerHTML = `
        <div class="content">${inputText.value}</div>
        <div class="money">${inputMoney.value}</div>
        <div class="close">x</div>
    `;
    }
    showAlert("Added!", "success");

    amountDisplay.appendChild(ouputAmount);

    updateMoney();
    saveData();
    inputText.value = "";
    inputMoney.value = "";
  }
}

//Update balance & income & expense
var incomeMoney = document.querySelector(".income-money");
var expenseMoney = document.querySelector(".expense-money");
var balance = document.querySelector(".balance");

function updateMoney() {
  incomeMoney.innerText = `$${income}`;
  expenseMoney.innerText = `$${expense}`;
  balance.innerText = `$${income - expense}`;
}

//Show Alert
var alertOut = document.querySelector(".alert");

function showAlert(mess, color) {
  alertOut.innerText = mess;
  alertOut.classList.add("show");
  alertOut.classList.remove("fail");
  alertOut.classList.remove("success");
  alertOut.classList.add(color);
  setTimeout(function () {
    alertOut.classList.remove("show");
  }, 3000);
}

//Delete transaction
amountDisplay.addEventListener("click", deleteTransaction);

function deleteTransaction(e) {
  // console.log(e.target.classList.contains("close"));
  if (e.target.classList.contains("close")) {
    e.target.parentElement.remove();
    var newMoney = Number(e.target.previousElementSibling.innerText);
    if (newMoney > 0) {
      income -= newMoney;
    } else {
      expense += newMoney;
    }
  }
  deleteFromLS(
    e.target.previousElementSibling.previousElementSibling.innerText
  );
  updateMoney();
  showAlert("Deleted!", "success");
}

//Local storage
var expenseTracker;
function saveData() {
  if (localStorage.getItem("expenseTracker") === null) {
    expenseTracker = [];
  } else {
    expenseTracker = JSON.parse(localStorage.getItem("expenseTracker"));
  }
  var data = {
    text: `${inputText.value}`,
    money: `${inputMoney.value}`,
    income: `${income}`,
    expense: `${expense}`,
    balance: `${income - expense}`,
  };
  expenseTracker.push(data);
  localStorage.setItem("expenseTracker", JSON.stringify(expenseTracker));
}
//Delete from Local storage
function deleteFromLS(taskname) {
  if (localStorage.getItem("expenseTracker") === null) {
    expenseTracker = [];
  } else {
    expenseTracker = JSON.parse(localStorage.getItem("expenseTracker"));
  }
  expenseTracker.forEach(function (task, index) {
    if (taskname == task.text) {
      expenseTracker.splice(index, 1);
      if (index >= 0) {
        if (task.money > 0) {
          expenseTracker[expenseTracker.length - 1].income =
            Number(expenseTracker[expenseTracker.length - 1].income) -
            Number(task.income);
        } else {
          expenseTracker[expenseTracker.length - 1].expense =
            Number(expenseTracker[expenseTracker.length - 1].expense) -
            Number(task.expense);
        }
      }
    }
  });
  localStorage.setItem("expenseTracker", JSON.stringify(expenseTracker));
}
//Render data from local storage
document.addEventListener("DOMContentLoaded", renderData);
function renderData() {
  if (localStorage.getItem("expenseTracker") == null) {
    expenseTracker = [];
  } else {
    expenseTracker = JSON.parse(localStorage.getItem("expenseTracker"));
    income = Number(expenseTracker[expenseTracker.length - 1].income);
    expense = Number(expenseTracker[expenseTracker.length - 1].expense);
  }
  updateMoney();

  expenseTracker.forEach(function (task) {
    if (task.money > 0) {
      var ouputAmount = document.createElement("div");
      ouputAmount.className = "amount-detail border-green";
      ouputAmount.innerHTML = `
        <div class="content">${task.text}</div>
        <div class="money">${task.money}</div>
        <div class="close">x</div>
    `;
      amountDisplay.appendChild(ouputAmount);
    } else {
      var ouputAmount = document.createElement("div");
      ouputAmount.className = "amount-detail border-red";
      ouputAmount.innerHTML = `
        <div class="content">${task.text}</div>
        <div class="money">${task.money}</div>
        <div class="close">x</div>
    `;
      amountDisplay.appendChild(ouputAmount);
    }
  });
}
