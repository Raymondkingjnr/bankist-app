'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////
//CREATING THE USER NAME
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

//////////////////////////////////////

//ACCUMULATING BALANCE
const calcPrinteBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);

  acc.balance = balance;

  labelBalance.textContent = `${acc.balance} €`;
};

// calcPrinteBalance(account1.movements);

////////////////////////////////////////

//ACCOUNT SUMMUARY
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outIncome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, arr) => acc + arr, 0);
  labelSumOut.innerHTML = `${outIncome}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.innerHTML = `${interest}€`;
};
// calcDisplaySummary(account1.movements);

////////////////////////////////////
//DISPLAY MOVMENTS
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` 

    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
       ${i + 1}
       
       ${type}</div>
     <div class="movements__value">
      ${mov}€
     </div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

////////////////////////////////

//IMPLEMENTING LOGIN

const updatUI = function (acc) {
  //DISPLAY MOVEMENTS
  displayMovements(acc.movements);

  //DISPLAYBALANCE

  calcDisplaySummary(acc);

  //DISPLAY CURRENT BALANCE

  calcPrinteBalance(acc);
};
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    // DISPLAY UI AND MESSAGE
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //CLEAR THE INPUT FELID

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updatUI(currentAccount);
  }
});

/////////////////////////////

//IMPLEMENTING TRANSFER FUNCTION

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updatUI(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});
////////////////////////////////
//DELETING ACCOUNT

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value === currentAccount.pin)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    console.log(index);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});
/////////////////////////////

//LOAN FUNCTION
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updatUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, true);
});

/////////////////////////////
//CODING CHALLENGE
/*
const JuliaData = [3, 5, 2, 12, 7];
const KateData = [4, 1, 15, 8, 3];
*/

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.splice(1, 2);
  // dogsKate = KateData;
  console.log([...dogsJuliaCorrected]);

  const newArray = dogsJuliaCorrected.concat(dogsKate);

  console.log(newArray);

  newArray.forEach(function (Dogs, i) {
    if (Dogs >= 3) {
      console.log(`Dog number ${i + 1}: is an adult and is ${Dogs} years old`);
    } else {
      console.log(`Dog number ${i + 1}: is still a puppy 🐶`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

const JuliaData2 = [9, 16, 6, 8, 3];
const KateData2 = [10, 5, 6, 1, 4];

console.log(checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]));

/*
const movementsUsd = movements.map(function (mov) {
  return mov * eurToUsd;
});

console.log(movements);
console.log(movementsUsd);
*/

//CODING CHALLENGE 2
const calcAverageHumanAge = function (DogsAge) {
  const humanAges = DogsAge.map(function (Dogs) {
    if (Dogs <= 2) {
      return 2 * Dogs;
    } else if (Dogs > 2) {
      return (16 + Dogs) * 4;
    }
    //console.log(humanAges);
  });
  console.log(humanAges);

  const adults = humanAges.filter(function (Dogs) {
    return Dogs >= 18;
  });
  console.log(adults);
  const average = humanAges.reduce((acc, cuu) => acc + cuu, 0) / adults.length;

  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2);

//CODING CHALLENGE 2

const calcAverageHumanAge2 = dogages =>
  dogages
    .map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4))
    .filter(dog => dog >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
const avg3 = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
const avg4 = calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]);

console.log(avg3, avg4);

/////////////////////////////////////////////////
/////////////////////////////////////////////////

// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ['a', 'b', 'c', 'd', 'e'];

//SPLICE MUTATING AN ARRAY

//REMOVES THE LAST ELEMENT IN AN ARRAY
arr.splice(-1);
console.log(arr);

arr.splice(1, 2);
console.log(arr);

//REVERSE METHOD MUTATE AN ARR
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//CONCATE
const letters = arr.concat(arr2);
console.log(letters);

//OR

console.log([...arr, ...arr2]);

//JOIN

console.log(letters.join(' - '));

//NEW ARRAY METHOD AT METHOD

const arr3 = [23, 11, 64];
console.log(arr3.at(0));

//GETTING LAST ARRAY ELEMENT USE AT METHOD IT ALSO WORKS ON STRINGS
console.log(arr3[arr.length - 1]);
console.log(arr3.slice(-1)[0]);
console.log(arr3.at(-1));

//USING WITH FOREACH
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//for (const movement of movements)
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('----FOREACH-----');
movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

//CALLING FOREACH IN MAP AND SET
//MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//FOREACH IN A SET

const currenciesUnique = ['USD', 'GDP', 'USD', 'EUR', 'EUR'];

console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});

/////////////////////////////////////////
//DATA TRANSFORMATION WITH MAP FILTER AND REDUCE

//MAP USED WHEN YOU WANT TO CREATE A NEW ARRAY

const eurToUsd = 1.1;
/*
const movementsUsd = movements.map(function (mov) {
  return mov * eurToUsd;
});

console.log(movements);
console.log(movementsUsd);
*/

const movementUSD = movements.map(mov => mov * eurToUsd);

console.log(movementUSD);

const movementDescription = movements.map(
  (mov, i) =>
    `movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`

  /*
  if (mov > 0){
  return `movement ${i +1}: you deposited ${mov};
  }else{
  return `movement ${i + 1}: you withdrew ${Math.abs(mov)}
  }
   */
);
console.log(movementDescription);

//////////////////////////////////////
//FLITER METHOD

const deposit = movements.filter(function (mov) {
  return mov > 0;
});

console.log(deposit);

const withdrawal = movements.filter(function (mov) {
  return mov < 0;
});

console.log(withdrawal);

const withdrawalOut = [];

for (const mov of movements) if (mov < 0) withdrawalOut.push(mov);
console.log(withdrawalOut);

/////////////////
//REDUCE METHOD///THE FIRST ARGURMENT IN THE PARAMETER IS CALLED THE ACCUMULATOR

const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`${i + 1}: ${acc} `);
  return acc + cur;
}, 0);
console.log(balance);

const balance2 = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);

let balance3 = 0;

for (const mov of movements) balance3 += mov;
console.log(balance3);

//GETTING THE MAXMUMU VALUE WITH REDUCE

const max = movements.reduce(function (acc, mov) {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

console.log(max);

//CHAINING METHOD WITH MAP,FLITER,REDUCE

const totaolDepositeUSD = movements
  .filter(mov => mov > 0)
  // .map(mov => mov * eurToUsd)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totaolDepositeUSD);

//FIND METHOD FIND AN ELEMENT IN THE ARRAY NOT AN ARRAY

const firstWithdrawal = movements.find(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');

console.log(account);

for (const acc of accounts) {
  if (acc.owner === `Jessica Davis`) {
    console.log(acc);
  }
}

//SOME METHOD CHECKING A CONDITION

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

//EVERY METHOD
//console.log(movements.every(mov => mov > 0));
//console.log(accounts.movements.every(mov => mov > 0));

//FLAT METHOD
const samArr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];

console.log(arrDeep.flat(2));

/*
const accountMovements = accounts.map(acc => acc.movements);

console.log(accountMovements);

const allMovements = accountMovements.flat();

console.log(allMovements);

const overalBalance = allMovements.reduce((acc, cuu) => acc + cuu, 0);

console.log(overalBalance);
*/

const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cuu) => acc + cuu, 0);
console.log(overalBalance);

//FLATMAP ONLY GOES ONE DEEP
/*
const overalBalance2 = accounts
  .flatmap(acc => acc.movements)
  .reduce((acc, cuu) => acc + cuu, 0);
console.log(overalBalance2);
*/

//SORTING METHOD ARRAYS DOSE NOT WORK WITH STRINGS AND NUMBERS

const owner = ['jonas', 'Zeck', 'Adam', 'Martha'];
console.log(owner.sort());

//Acending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

movements.sort((a, b) => a - b);
console.log(movements);

//Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

movements.sort((a, b) => b - a);

console.log(movements);

//CREATING AND FILLING ARRAYS

const y = Array.from({ length: 7 }, () => 1);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(y, z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];

  console.log(movementsUI2);
});

/////////////

/*
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
*/
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  //.reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000);

//2.

const convertTitleCase = function (title) {
  const expections = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      expections.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    );

  return titleCase;
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

//////////////////////////////////////

//CODING CHALLENGE

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1
const foodPortion = function (food) {
  food.forEach(function (dogs) {
    dogs.recommendedFood = Math.trunc(dogs.weight ** 0.75 * 28);
  });
};

foodPortion(dogs);
console.log(dogs);

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);

console.log(
  `sarah's dog is eating ${
    dogSarah.curFood > dogSarah.recommendedFood ? `Much` : `Little`
  }`
);

//3

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .map(dog => dog.owners)
  .flat();

console.log(ownersEatTooMuch);

const ownersEatTooLow = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLow);

//4
//console.log(`${dogs[1].owners[0]} and ${dogs[0].owners[0]}  and ${dogs[0].owners[1]}`);

console.log(`${ownersEatTooMuch.join(' and ')}'s Dogs eat too much`);
console.log(`${ownersEatTooLow.join(' and ')}'s Dogs eat too Low`);

//5
console.log(dogs.includes(dog => dog.curFood === dog.recommendedFood));

//6
/*
console.log(
  dogs.includes(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);
*/

const checkEatinOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.some(checkEatinOkay));

/////////////////////////////
//7

console.log(dogs.filter(checkEatinOkay));
/*
const OkayDogs = function (dogs) {
  dogs.forEach(function (dog) {
    dog.EatingOkay =
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1;
  });
};
OkayDogs(dogs);
console.log(dogs);
*/
////////////////////////////////
//8
const dogsSorted = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

console.log(dogsSorted);

/*
const all = dogs
  .map(dog => Object.assign({}, dog))
  .recommendedFood.sort((a, b) => {
    if (a > b) return -1;
    if (a < b) return 1;
  });

console.log(all);
*/
