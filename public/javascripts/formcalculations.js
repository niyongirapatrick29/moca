/*
This source is shared under the terms of LGPL 3
www.gnu.org/licenses/lgpl.html

You are free to use the code in Commercial or non-commercial projects
*/

//Set up an associative array
//The keys represent the size of the cake
//The values represent the cost of the cake i.e A 10" cake cost's $35
var cake_prices = new Array();
cake_prices["Round6"] = 20000;
cake_prices["Round8"] = 25000;
cake_prices["Round10"] = 35000;
cake_prices["Round12"] = 75000;

//Set up an associative array 
//The keys represent the filling type
//The value represents the cost of the filling i.e. Lemon filling is $5,Dobash filling is $9
//We use this this array when the user selects a filling from the form
var filling_prices = new Array();
filling_prices["None"] = 0;
filling_prices["Lemon"] = 5000;
filling_prices["Custard"] = 5000;
filling_prices["Fudge"] = 7000;
filling_prices["Mocha"] = 8000;
filling_prices["Raspberry"] = 10000;
filling_prices["Pineapple"] = 5000;
filling_prices["Dobash"] = 9000;
filling_prices["Mint"] = 5000;
filling_prices["Cherry"] = 5000;
filling_prices["Apricot"] = 8000;
filling_prices["Buttercream"] = 7000;
filling_prices["Chocolate Mousse"] = 15000;



// getCakeSizePrice() finds the price based on the size of the cake.
// Here, we need to take user's the selection from radio button selection
function getCakeSizePrice() {
    var cakeSizePrice = 0;
    //Get a reference to the form id="cakeform"
    var theForm = document.forms["cakeform"];
    //Get a reference to the cake the user Chooses name=selectedCake":
    var selectedCake = theForm.elements["selectedcake"];
    //Here since there are 4 radio buttons selectedCake.length = 4
    //We loop through each radio buttons
    for (var i = 0; i < selectedCake.length; i++) {
        //if the radio button is checked
        if (selectedCake[i].checked) {
            //we set cakeSizePrice to the value of the selected radio button
            //i.e. if the user choose the 8" cake we set it to 25
            //by using the cake_prices array
            //We get the selected Items value
            //For example cake_prices["Round8".value]"
            cakeSizePrice = cake_prices[selectedCake[i].value];
            //If we get a match then we break out of this loop
            //No reason to continue if we get a match
            break;
        }
    }
    //We return the cakeSizePrice
    return cakeSizePrice;
}

//This function finds the filling price based on the 
//drop down selection
function getFillingPrice() {
    var cakeFillingPrice = 0;
    //Get a reference to the form id="cakeform"
    var theForm = document.forms["cakeform"];
    //Get a reference to the select id="filling"
    var selectedFilling = theForm.elements["filling"];

    //set cakeFilling Price equal to value user chose
    //For example filling_prices["Lemon".value] would be equal to 5
    cakeFillingPrice = filling_prices[selectedFilling.value];

    //finally we return cakeFillingPrice
    return cakeFillingPrice;
}

//candlesPrice() finds the candles price based on a check box selection
function candlesPrice() {
    var candlePrice = 0;
    //Get a reference to the form id="cakeform"
    var theForm = document.forms["cakeform"];
    //Get a reference to the checkbox id="includecandles"
    var includeCandles = theForm.elements["includecandles"];

    //If they checked the box set candlePrice to 5
    if (includeCandles.checked == true) {
        candlePrice = 1000;
    }
    //finally we return the candlePrice
    return candlePrice;
}

function insciptionPrice() {
    //This local variable will be used to decide whether or not to charge for the inscription
    //If the user checked the box this value will be 20
    //otherwise it will remain at 0
    var inscriptionPrice = 0;
    //Get a refernce to the form id="cakeform"
    var theForm = document.forms["cakeform"];
    //Get a reference to the checkbox id="includeinscription"
    var includeInscription = theForm.elements["includeinscription"];
    //If they checked the box set inscriptionPrice to 1000
    if (includeInscription.checked == true) {
        inscriptionPrice = 1000;
    }
    //finally we return the inscriptionPrice
    return inscriptionPrice;
}

function calculateTotal() {
    //Here we get the total price by calling our function
    //Each function returns a number so by calling them we add the values they return together
    var cakePrice = getCakeSizePrice() + getFillingPrice() + candlesPrice() + insciptionPrice();

    //display the result
    var divobj = document.getElementById('totalPrice');
    divobj.style.display = 'block';
    divobj.innerHTML = "Total Price For the Cake is <b>" + cakePrice + " Rwf</b>";

    var tt_cost = document.getElementById('tt_cost');
    tt_cost.style.display = 'block';
    tt_cost.innerHTML = cakePrice;

    document.getElementById('tt_cost').value = cakePrice;

    var totalP = document.getElementById('totalP');
    totalP.style.display = 'block';
    totalP.innerHTML = "current price: <span>" + cakePrice + " Rwf </span>"

    document.getElementById('totalP').value = "current price: <span>" + cakePrice + "</span>";

    var theForm = document.forms["cakeform"];
    //Get a reference to the checkbox id="includeinscription"
    var message = theForm.elements["message"];

    var orderNote = document.getElementById('orderNote');
    orderNote.style.display = 'block';
    orderNote.innerHTML = message;

    document.getElementById('totalP').value = "current price: <span>" + cakePrice + "</span>";


    document.getElementById('totalP').value = cakePrice;

    //Transaction Id
    var date = new Date();
    var components = [
        "Moca",
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];

    var id = components.join("");

    var trID = document.getElementById('trID');
    trID.style.display = 'block';
    trID.innerHTML = "Order ID: <span>" + id + "</span>";

    document.getElementById('trID').value = "Order ID: <span>" + id + "</span>";

    //include transaction or Order Id in form 
    var transactionId = document.getElementById('transactionId');
    transactionId.style.display = 'block';
    transactionId.innerHTML = id;

    document.getElementById('transactionId').value = id;
}


function hideTotal() {
    var divobj = document.getElementById('totalPrice');
    divobj.style.display = 'none';
}

//////// creating mut-level form script


var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        // ... the form gets submitted:
        document.getElementById("cakeform").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false
            valid = false;
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}