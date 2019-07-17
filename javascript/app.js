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


})();

var UIController = (function () {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value'
  }
  //writing a method/function that will be used in another controller. We make this public method/function. It has to be in this iife that will return.
  return {

    getinput: function () {


      return {

        type: document.querySelector(DOMstrings.inputType).value,  // will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
        
        
      }
    }
    
  };

})();
// Global App Controller....
// Set up the event listener for our input button in our controller because this the central place where I want to decide, what I want to control on each event and then delegate these tasks to the other controls.
var controller = (function (budgetCtrl, UICtrl) {
  var ctrlAddItem = function () {
    // 1. Get the field input data
    var input = UICtrl.getinput();
    console.log(input);
    // 2. Add the item to the budget controller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
    
  }
  //call back. The addEventListener will call it for us when someone clicks the button
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem)

  document.addEventListener('keypress', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  })

})(budgetController, UIController);


