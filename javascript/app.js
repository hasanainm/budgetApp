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
  // data object structure for creating a new item 
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };
  //this is for our public methods
  return {
    addItem: function (type, des, val) {
      var newItem, ID
      //unique number we want to assign to each new item that we put either in the income or expense array for the allitems
      //Create new ID
      if(data.allItems[type].length > 0) {

        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        console.log(ID);
      }else{
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
    testing: function() {
      console.log(data);
    }
  };


})();
var UIController = (function () {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }
  //writing a method/function that will be used in another controller. We make this public method/function. It has to be in this iife that will return.
  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,  // will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
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
  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getinput();
    console.log(input);
    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    init: function () {
      console.log("Application has started");
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();

