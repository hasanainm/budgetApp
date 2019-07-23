// var budgetController = (function(){

//     var x = 23;

//     var add = function(a) {
//       return x + a;
//     }
//     return {
//       publicTest: function(b) {
//         return (add(b));
//       } 
//     }
// })();

// var UIController = (function(){
// //Some code

// })();
// var controller = (function(budgetCtrl,UICtrl){

//  var z = budgetController.publicTest(5)
//  return {
//    anotherPublic: function() {
//      console.log(z);
//    }
//  }

// })(budgetController, UIController);

var budgetController = (function () {
  //Need a data model for expenses and incomes here. 
  //I chose to create objects here through the expense function constructor because there will be alot of expenses.
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur){
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
    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if(data.totals.inc > 0) {

        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else{
        data.percentage = -1;
      }
    },
    //this method is crucial for returning something from our data structure or module so you get used to this philosophy of having functions that only retrieve or set data.
    getBudget: function() {
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
    percentageLabel: '.budget__expenses--percentage'
  }
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
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      //Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
    displayBudget: function(obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
      

      if(obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      }
      else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
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
    })
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

  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getinput();
    console.log(input);
    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. clear the fields
      UICtrl.clearFields();
      
      // 5. Calculate and update budget
      updateBudget();
    }
    else{
      
      alert("Please enter valid string and number");
    };
  };

  return {
    init: function () {
      console.log("Application has started");
      UICtrl.displayBudget({
        budget: 0, 
        totalInc:0,
        totalExp: 0,
        percentage:-1
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();

