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

var budgetController = (function(){

     
  })();
  
  var UIController = (function(){
  
  
  })();
  // Global App Controller....
  // Set up the event listener for our input button in our controller because this the central place where I want to decide, what I want to control on each event and then delegate these tasks to the other controls.
  var controller = (function(budgetCtrl,UICtrl){
  document.querySelector('.add__btn').addEventListener('click', function(){
    console.log("button was clicked");
    // 1. Get the field input data
    // 2. Add the item to the budget controller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  })

  document.addEventListener('keypress', function(event){
    if(event.keyCode === 13 || event.which === 13){
      console.log("Enter was pressed");
    }
  })
    
  })(budgetController, UIController);
  

  