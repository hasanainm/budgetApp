var budgetController = (function () {
  //Need a data model for expenses and incomes here. 
  //I chose to create objects here through the expense function constructor because there will be alot of expenses.
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  // calculates percentage for each expense
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  }
  // returns the percentage for each expense
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum
  }
  // data object structure for creating a new item 
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    // set to -1 incase the value is nonexistent; if there are no budget values and no total expenses on incomes, then there cannot be a percentage
    percentage: -1
  };
  //this is for our public methods
  return {
    addItem: function (type, des, val) {
      var newItem, ID
      // [1 2 3 4 5 6], next ID = 6
      // [1 2 4 6 8], next ID = 9
      // ID = last ID + 1
      //unique number we want to assign to each new item that we put either in the income or expense array for the allitems
      //Create new ID
      if (data.allItems[type].length > 0) {

        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        console.log(ID);
      } else {
        ID = 0;
        console.log(ID);
      }
      //if the string is 'exp', then we want to create a new expense using the designation and the value that we pass in.
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
        // if the string is "inc", then we want to create a new income object based on the income function constructor.
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      //push it into our data structure
      data.allItems[type].push(newItem);
      //need to return newItem because then the other module or the other function that's going to call this one can have direct access to the item we just created.
      return newItem;
    },
    deleteItem: function (type, id) {
      var ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      })
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1)
      }
    },
    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {

        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    // calculate the expense percentage for each of the expense object that are stored in the expense array.
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      })

    },
    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    //this method is crucial for returning something from our data structure or module so you get used to this philosophy of having functions that only retrieve or set data.
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },
    testing: function () {
      console.log(data);
    }
  };


})();
var UIController = (function () {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: ".budget__title--month"
  };
  // setting + or - before number, exactly 2 decimal points, comma seperating the thousands
  var formatNumber = function (num, type) {
    var numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
    }
    dec = numSplit[1];
    //ternary operator used for selecting a + or - based on the type

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };
  //Private function, so only the methods that are in here, in this control module can use this function
  var nodeListForEach = function (list, callback) {
    // each iteration it calls our call back function. When we call our nodeListForEach function, we pass a callback function into it. 
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
      console.log(list);
    }
  };
  //writing a method/function that will be used in another controller. We make this public method/function. It has to be in this iife that will return.
  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,  // will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      //Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      // passing the result of formatting this number. THE FORMATNUMBER FUNCTION WILL BE CALLED WITH OUR VALUE, AND WITH THE TYPE WILL BE FORMATTED AND RETURNED AND THEN REPLACED WITH OUR STRING.
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      //Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldArr;
      // does not return a array
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      console.log(fields);
      // convert list to an array 
      fieldArr = Array.prototype.slice.call(fields);
      console.log(fieldArr);

      fieldArr.forEach(function (current, index, array) {
        current.value = "";

      })
      fieldArr[0].focus();
    },
    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');


      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      }
      else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    //nodelist does not have the for each method
    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      console.log(fields);
      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';

        } else {
          current.textContent = '---';
        }
      })
    },
    // // setting + or - before number, exactly 2 decimal points, comma seperating the thousands
    // formatNumber: function(num, type) {
    //   var numSplit, int, dec;
    //   num = Math.abs(num);
    //   num = num.toFixed(2);

    //   numSplit = num.split('.');

    //   int = numSplit[0];

    //   if(int.length > 3) {
    //     int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3,3) 
    //   } 
    //   dec = numSplit[1];
    //   //ternary operator used for selecting a + or - based on the type

    //   return (type === 'exp' ? sign '-' : sign  '+') + ' ' + int + dec;

    // },
    displayMonth: function () {
      var now, year, month;
      now = new Date();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();
       // year is now and this object inherits many methods from the date prototype
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

    },
    changedType: function() {
      var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
      console.log(fields);
      nodeListForEach(fields, function(cur){
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },
    //exposing the DOMstrings object into the public
    getDOMstrings: function () {
      return DOMstrings; 
    }
  };
})();
// Global App Controller....
// Set up the event listener for our input button in our controller because this the central place where I want to decide, what I want to control on each event and then delegate these tasks to the other controls.
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    // Need DOM elements for our event listeners
    var DOM = UICtrl.getDOMstrings();
    //call back. The addEventListener will call it for us when someone clicks the button
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    //Starting Event Delegation for deleting expenses and incomes. We used the container element primarily for this reason. Later we do dom traversing to move up to the parent element.
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  }
  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    var budget = budgetCtrl.getBudget();
    console.log(budget);
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function () {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages()
    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    // 3. Update the UI with the new percentages
    console.log(percentages);
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getinput();
    console.log(input);
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update budget 
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
    else {

      alert("Please enter valid string and number");
    };
  };
  // in event delegation, an event bubbles up, and then we can know where it came from by looking at the target property of the event.
  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
    if (itemID) {
      //inc-1
      splitID = itemID.split('-');

      type = splitID[0];
      // convert to integer because you are comparing the ID to a number
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID)
      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // 3. Update and show the new budget
      updateBudget();
      // 4. Calculate and update percentages
      updatePercentages();
    }
  }


  return {
    init: function () {
      console.log("Application has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();

