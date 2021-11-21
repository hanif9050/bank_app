// Fake Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-11-02T17:01:17.194Z",
    "2021-11-07T23:36:17.929Z",
    "2021-11-08T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "BDT",
  locale: "bn-BD",
};

const accounts = [account1, account2];
// displaySelector
const containerApp = document.querySelector(".app");
// Input Login Selector
const loginUserInput = document.querySelector(".login_input--user");
const loginUserPin = document.querySelector(".login_input--pin");
const loginBtn = document.querySelector(".login_btn");
//balance selector
const balanceValue = document.querySelector(".balance_value");
const balanceDate = document.querySelector(".date");
//
const accountMovements = document.querySelector(".movements");
// total deposit,withdraw,interest Selector
const deposit = document.querySelector(".summary_value--in");
const withdraw = document.querySelector(".summary_value--out");
const interest = document.querySelector(".summary_value--interest");
// ///Transfer selector///////
const btnTransfer = document.querySelector(".form_btn--transfer");
const transferTo = document.querySelector(".form_input--to");
const transferAmt = document.querySelector(".form_input--amount");
// ///////Loan Btn////////////
const loanBtn = document.querySelector(".form_btn--loan");
const loanAmt = document.querySelector(".form_input--loan-amount");
// close Account
const closeAct = document.querySelector(".form_input--user");
const closeActPin = document.querySelector(".form_input--pin");
const btnClose = document.querySelector(".form_btn--close");
// sort btn
const sortBtn = document.querySelector(".btn--sort");
// timer selector
const countDown = document.querySelector(".timer");

containerApp.style.opacity = 0;
// welcome Text
const welcomeText = document.querySelector(".welcome");
const updateUI = function (accs) {
  displayBalance(accs);
  displayMovements(accs);
  displaySummary(accs);
};
// format Currency
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
// format Date

const formatDate = function (date, locale) {
  // console.log(date);
  const calcDays = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const days = calcDays(new Date(), date);
  // console.log(days);
  if (days === 1) return "1 Days Ago";
  if (days === 2) return "2 Days Ago";
  if (days <= 7) return `${days} Days Ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};
// create Usernames
const creatUsername = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((acc) => acc[0])
      .join("");
  });
};
creatUsername(accounts);
//

// console.log(formatDate(new Date(account1.movementsDates[7]), "en-US"));
// new Intl.DateTimeFormat("en-US").format();
// /////////////////
function displayMovements(acc, sort = false) {
  accountMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const now = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(now, "en-US");
    const html = `  <div class="movements_row">
          <div class="movements_type movements_type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements_date">${displayDate}</div>
          <div class="movements_value">${mov}</div>
        </div>`;
    accountMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// displayMovements(account1);
// //////////////////////
// display Summary
// const deposit
// const withdraw
// const interest
const displaySummary = function (accs) {
  const totalDeposit = accs.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov, i, arr) => {
      console.log("arr", arr);
      return acc + mov;
    }, 0);
  console.log("Total", totalDeposit);
  const totalWithdraw = accs.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  deposit.textContent = formatCurrency(
    totalDeposit,
    accs.locale,
    accs.currency
  );
  withdraw.textContent = formatCurrency(
    totalWithdraw,
    accs.locale,
    accs.currency
  );
  const totalInterest = accs.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * accs.interestRate) / 100)
    .filter((mov, i, arr) => {
      return mov >= 1;
    })
    .reduce((acc, mov, i, arr) => {
      return acc + mov;
    }, 0);
  interest.textContent = formatCurrency(
    totalInterest,
    accs.locale,
    accs.currency
  );
};
// displaySummary(account1);
// balanceValue
function displayBalance(accs) {
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);

  balanceValue.textContent = formatCurrency(accs.balance, "bn-BD", "BDT");
}
// displayBalance(account1);
// /////////timer//////////

const setLogicTimeout = function () {
  let time = 120;
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    countDown.textContent = `${min} : ${seconds}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      welcomeText.textContent = "Log in to started";
    }
    time--;
  }
  tick();
  const timer = setInterval(() => {
    tick();
  }, 1000);
  return timer;
};

// function updateUI

let currentAccount, timer;
// ////////login Button ////////
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === loginUserInput.value
  );
  loginUserPin.blur();
  if (currentAccount && currentAccount.pin === +loginUserPin.value) {
    console.log(currentAccount);
    welcomeText.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: "numeric",
      day: "2-digit",
      minute: "numeric",
      month: "numeric",
      year: "numeric",
    };
    balanceDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    if (timer) clearInterval(timer);

    timer = setLogicTimeout();
    updateUI(currentAccount);
  }
});

// /////////transfer section /////////
/* 
const btnTransfer 
const transferTo 
const transferAmt 
 */
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferReciver = accounts.find(
    (acc) => acc.username === transferTo.value
  );
  const amount = transferAmt.value;
  const now = new Date().toISOString();
  if (
    transferReciver &&
    amount > 0 &&
    currentAccount?.balance >= amount &&
    currentAccount?.username !== transferReciver.username
  ) {
    transferReciver.movements.push(+amount);
    transferReciver.movementsDates.push(now);
    currentAccount.movements.push(-Number(amount));
    currentAccount.movementsDates.push(now);
    transferAmt.value = "";
    transferTo.value = "";
    clearInterval(timer);
    timer = setLogicTimeout();
    updateUI(currentAccount);
  }
});

// ////Loan Section//////////
//  loanBtn
// loanAmt
loanBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const amt = +loanAmt.value;
  const now = new Date().toISOString();
  loanAmt.value = "";
  if (
    currentAccount &&
    currentAccount.movements.some((mov) => mov >= amt * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amt);
      currentAccount.movementsDates.push(now);

      updateUI(currentAccount);
    }, 3000);
    clearInterval(timer);
    timer = setLogicTimeout();
  }
});
// close Account
/* const closeAct = document.querySelector(".form_input--user");
const closeActPin = document.querySelector(".form_input--pin"); 
const btnClose = document.querySelector(".form_btn--close");
*/
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === closeAct.value &&
    currentAccount.pin === +closeActPin.value
  ) {
    console.log("true");
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
  }
  closeActPin.value = "";
  closeAct.value = "";
  containerApp.style.opacity = 0;
  welcomeText.textContent = "Log in to started";
});
// sortBtn
let sorted = false;
sortBtn.addEventListener("click", function () {
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
