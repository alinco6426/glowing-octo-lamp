// decalring an empty array to store both fecth invoices and dynamically added invoices 
//
let invoiceList = JSON.parse(localStorage.getItem("invoiceList")) || [];
let isDarkMode = JSON.parse(localStorage.getItem("isDarkMode")) || false;
let isMobile = window.matchMedia("(max-width :600px)").matches;

// Elements and the function to display the invoice to be created layouts 
//
let infoGettersContainer = document.querySelector(".info-getters-container-wrapper");
let invoiceLayoutCreator = document.getElementById("invoice-creator");
if (invoiceLayoutCreator) {
  invoiceLayoutCreator.addEventListener("click", function () {
    infoGettersContainer.style.display = "block";
    displayCalender()
  })
}
//
// Creating the layout for a  basic calendar to get the date in which the invoice was created 
//
const calendar = document.querySelector(".calendar");
const invoiceCreatedAtGetter = document.getElementById("created-at-getter");

// element that trigger the display of the calendar when this element is clicked 
//
let calenderDisplayer = document.querySelector(".calendar-container")
if (invoiceCreatedAtGetter) {
  invoiceCreatedAtGetter.addEventListener("click", function () {
    calenderDisplayer.classList.toggle("show")
  })
}

// creating simple calendar to be display to get the date the invoice is created 
//
const nextMonth = new Date();
let currentYear = nextMonth.getFullYear();
let currentMonth = nextMonth.getMonth();
let currentDate = nextMonth.getDate();
// function to  create a simple calendar 
//
function displayCalender() {

 // displaying the current month on the calendar
 //
 calendar.innerHTML = "";
  let currentFormtedDate = new Date(currentYear, currentMonth, 1)
  let monthDisplayer = document.querySelector(".date-month-displayer");
  monthDisplayer.textContent = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long' }).format(currentFormtedDate);

// gettting the first and last day of the current month on the calender 
  const getCurrentMonthLastDay = new Date(currentYear, currentMonth + 1, 0);
  let lastDay = getCurrentMonthLastDay.getDay();
//
  const  getFirstDay = new Date(currentYear, currentMonth, 1);
  let firstDay = getFirstDay.getDay();


// Fill in days of the current month
//
  for (let i = 1; i <= getCurrentMonthLastDay.getDate(); i++) {
    let day = document.createElement("option");
    day.value = `${currentYear}-${currentMonth + 1}-${i}`;
    day.setAttribute("class", "day");
    day.textContent = i;
    calendar.appendChild(day);

    if (isDarkMode) {
      day.classList.add("dark")
    } else if (!isDarkMode) {
      day.classList.remove("dark");
    }
  }

// Calculate the days needed to balance the weeks
//
  let daysToBalance = firstDay + (6 - lastDay);
  if (daysToBalance > 7) {
    daysToBalance = daysToBalance - 7;
  } else {
    daysToBalance = daysToBalance;
  }

// Fill in days of the next month to balance the weeks
//
  for (let i = 1; i <= daysToBalance; i++) {
    let nextMonthDaysOption = document.createElement("option");
    nextMonthDaysOption.setAttribute("class", "day");
    nextMonthDaysOption.classList.add("other-days")
    nextMonthDaysOption.setAttribute("disabled", "true");
    nextMonthDaysOption.value = `${currentYear}-${currentMonth + 2}-${i}`;
    nextMonthDaysOption.textContent = i;
    calendar.append(nextMonthDaysOption);
  }

// Add click event listeners to the days option so when click the invoiceCreetedAtGetter is updated to get the date the invoice is been created 
//
  const days = document.getElementsByClassName("day");
  for (let x = 0; x < days.length; x++) {
    days[x].addEventListener("click", function () {
      const dateCreated = new Date(this.value);
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      const formattedDate = dateCreated.toLocaleDateString('en-US', options);
      invoiceCreatedAtGetter.value = formattedDate.replace(/,/g, "");
    });
  }

} 

// displaying the calendar based on the current location of the window 
//
if (window.location.pathname === "/starter-code/index.html") {
  displayCalender()
}

// navigator button to get the previous month  and check if the current month on january so it can navigate back to the previous year 
//
let previousBtn = document.getElementById("previous-btn");

if (previousBtn) {
previousBtn.addEventListener("click", function () {
    // clearing the calendar container and displaying again the previous mnonth  after this button is clicked 
    //
    calendar.innerHTML = "";
    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    displayCalender() //calling the display calendar function each time  the month decreases 
  })
}

// navigator button to get the next  month  and check if the current month on december  so it can navigate back to the next  year 
//
let nextBtn = document.getElementById("next-btn");

if (nextBtn) {
nextBtn.addEventListener("click", function () {
     // clearing the calendar container and displaying again the previous mnonth  after this button is clicked 
    calendar.innerHTML = "";
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  displayCalender();  //calling the display calendar function each time  the month increases 
  })
}
// end of creating calendar to get the invoice date 
//


//
// function to invoice due date  

function getPaymentDue(createdDate, TermsGetter) {

  // to check if the createdat  value it's  not empty  so if it's empty 
  // it prompt user to enter the created at to be able to calculate date due 
  //
  if (createdDate.value === "") {
    TermsGetter.nextElementSibling.innerHTML = "input date created first";
    TermsGetter.value = "";
    TermsGetter.placeholder = "select-payment-terms";
    return false;
  } 
  // else if the createdAt value is not empty   the due date is been calculated 
  //
  else {
    const currentDate = new Date(createdDate.value);
    const getCurrentYear = currentDate.getFullYear();
    const getCurrentMonth = currentDate.getMonth();
    const currenDate = currentDate.getDate();
    const getLastDayOfTheMonth = new Date(getCurrentYear, getCurrentMonth + 1, 0).getDate();
    const getDueDate = parseInt(currenDate) + parseInt(TermsGetter.placeholder);
    let dueYear, dueMonth, dueDate, paymentDue;
// to check after the due date falls in the next month 
// 
if (getDueDate > getLastDayOfTheMonth) {
      dueDate = parseInt(getDueDate) - getLastDayOfTheMonth;
      dueMonth = getCurrentMonth + 1;
      dueYear = getCurrentYear;
      if (getCurrentMonth > 11) {
        dueMonth = 0;
        dueYear += 1;
      }
    } else {
      dueDate = getDueDate;
      dueMonth = getCurrentMonth;
      dueYear = getCurrentYear;
    }

    TermsGetter.nextElementSibling.innerHTML = ""; // clearing previous error message 
    paymentDue = new Date(dueYear, dueMonth, dueDate).toLocaleDateString();
    return paymentDue;
  }
}

let optionContainer = document.querySelector(".options-container");
const paymentTermsGetter = document.getElementById("payment-terms-getter");
// Element to trigger the toggling class of the paymentTerms  of the invoice
//
let paymentTermsIcon = document.querySelector("#payment-terms-icon")
if (paymentTermsGetter) {
  paymentTermsGetter.addEventListener("click", function () {
    optionContainer.classList.toggle("visible");
    paymentTermsIcon.classList.toggle("rotate");
  })
}
 
// function for each options to call the getPaymentdue function so it caalculate the due date baseed on the  
// clicked option value and setting the calue of the paymentTermsGetter to value to the calculated payment due 
// 
let paymentTermsOption = document.getElementsByClassName("payment-options");

if (paymentTermsOption) {
  for (let i = 0; i < paymentTermsOption.length; i++) {
    paymentTermsOption[i].addEventListener("click", function () {

      paymentTermsGetter.placeholder = ""; //clearing the placeholder each time an option is clicked before setting it back to the current value]

      paymentTermsGetter.placeholder = this.value;
      paymentTermsGetter.value = this.textContent;

      getPaymentDue(invoiceCreatedAtGetter, paymentTermsGetter)
    })
  }
}


 let itemList = []; //array to store item created 

// function to add item to the invoice to be created 
//
function createItem(itemInfoList, Appender) {

  // creating a section for an item each time the function is called 
  //
  let item = document.createElement("section");
  item.setAttribute("class", "item list"); 

  // creating element input to get the item name 
  //
  const itemName = document.createElement("input");
  itemName.setAttribute("class", "item-name name info-getters");
  // creating element input to get the item quantity
  //
  const itemQuantity = document.createElement("input");
  itemQuantity.setAttribute("class", "item-quantity quantity info-getters");
  // creating element input to get the item price
  //
  const itemPrice = document.createElement("input");
  itemPrice.setAttribute("class", "item-price price info-getters");
  // creating element input to get the item total
  //
  const itemTotalPrice = document.createElement("input");
  itemTotalPrice.setAttribute("class", " total item-total-price info-getters item-total");
  itemTotalPrice.disabled = true;
  // creating element button to delete the  current section of item 
  //
  let deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "delete-item");
  const iconDelete = document.createElement("img");
  iconDelete.src = "icon-delete.svg";
  deleteButton.append(iconDelete);
  let totalPrice;

// appending all Element created to the parent element 
//
  item.appendChild(itemName);
  item.appendChild(itemQuantity);
  item.appendChild(itemPrice);
  item.appendChild(itemTotalPrice);
  item.appendChild(deleteButton);
// appending the section for item  into an apender thats availbe in the DOM 
//  
Appender.appendChild(item);

// creating an object to store information on each item added  so it can be added invoice details 
let items =
  {
    "name": "",
    "quantity": "",
    "price": "",
    "total": "",
    "index": -1
  };

// function for bpth item quantity and price inputs so as to calculate the total price of the item added
//
function calcualteTotalPrice(unitQuantity, price) {

// checking if the curent active input is empty  so to set the total price to nothing 
//
  if (parseInt(this.value) === "") {
  itemTotalPrice.value = parseInt("0");
  } 
  // else if the value is not empty  it can calulate the item price 
  //
  else {
      totalPrice = parseInt(unitQuantity.value) * parseInt(price.value);
      itemTotalPrice.value = totalPrice;
      items.total = parseInt(itemTotalPrice.value)

      let indexFind = Array.from(Appender.children).indexOf(this.parentNode); //setting the index of the item in the database base on the layout in the DOM
      items.index = indexFind;
    }
}

 // Adding event listers to each item inputs 
//
// adding event listener to the itemName to get the item name 
//            
itemName.addEventListener("input", function () {
  items.name = this.value;
  this.classList.remove("invalid")
});
// adding event listner to the itemPrice input to calculate the total price 
//
itemPrice.addEventListener("input", function () {
    calcualteTotalPrice(itemQuantity, this);
    items.price = parseInt(this.value);
    this.classList.remove("invalid")
  })
// adding event listner to the itemPrice input to calculate the total qusantity
//
itemQuantity.addEventListener("input", function () {
    calcualteTotalPrice(this, itemPrice);
    items.quantity = parseInt(this.value);
    this.classList.remove("invalid")
});


itemInfoList.push(items) // after all is created storing the item in the items list database 

// function to update the  index of the items in the items list 
//
function updateIndices() {
    for (let i = 0; i < itemList.length; i++) {
      items.index = i;
    }
  }

// adding event listener to the delete button attached to each of the  item created  
//to delete item and update the items indexes in the array 
deleteButton.addEventListener("click", function () {
    updateIndices()
    let findIndex = Array.from(Appender.children).indexOf(this.parentNode);
    let removeIndex = itemList.findIndex(item => item.index === findIndex);
    itemList.splice(removeIndex, 1);
    this.parentNode.remove();
})

applyTheme()
}
//
// ending of the add item function 
//
// element to trigger the function of adding item  and adding upating the appender in the DOM 
//
let addItemBtn = document.getElementById("add-item-btn");
let itemAlert = document.querySelector(".item-alert"); //  to be use later in the editing section
let itemAppender = document.getElementById("item-appender");
if (addItemBtn) {
addItemBtn.addEventListener("click", function () {
  createItem(itemList, itemAppender);
  itemAlert.textContent = "";
  });
}



// fucnction to check the validity of each input  before the invoice is been created
//
let valid = true;
function validityCheck(input, regExp, type) {
// getting the alertMessage Element of each inputs
//
let alertMessage = input.nextElementSibling;
let inputValue = input.value;
// checking the value of the inputs if they are empty and displaying the necessary message 
//
if (inputValue === "") {
    alertMessage.textContent = "can't be empty";
    input.classList.add("invalid");
    valid = false;
}
// checking if the regular expression matches the input value 
//
else if (!inputValue.match(regExp)) {
    alertMessage.textContent = `${type} only`;
    input.classList.add("invalid");
    valid = false;
  } else {
    alertMessage.textContent = "";
    input.classList.remove("invalid");
  }
  return valid
}


// function to test out the validity of all the info getters and return the one that are not valid; 
//
function testValidity() {

  valid = true;
  validityCheck(senderStreetAdressGetter, /^(?:[a-zA-Z0-9 ]+[a-zA-Z ]+)$/, "words");

  validityCheck(senderCityGetter, /^[A-Za-z ]+$/, "letters");

  validityCheck(senderPostCodeGetter, /^[0-9]+$/, "numbers");

  validityCheck(senderCountryGetter, /^[a-zA-Z]+$/, "letters");

  validityCheck(clientNameGetter, /^([a-zA-Z ])+$/, "letters");

  validityCheck(clientEmailGetter, /\S+@\S*\.\S*/, "email address");

  validityCheck(clientStreetAddressGetter, /^(?:[a-zA-Z0-9 ]+[a-zA-Z ]+)$/, "words");

  validityCheck(clientCityGetter, /^[A-Za-z ]+$/, "letters");

  validityCheck(clientPostCodeGetter, /^[0-9]+$/, "number");

  validityCheck(clientCountryGetter, /^[A-za-z]+$/, "letters");

  validityCheck(projectDescriptionGetter, /^[a-zA-Z ]+$/, "letters");

  validityCheck(invoiceCreatedAtGetter, "", "");

  validityCheck(paymentTermsGetter, "", "")

// validity check on item if created 
const nameOfItem = document.getElementsByClassName("item-name");
const quantityOfItem = document.getElementsByClassName("item-quantity");
const priceOfItem = document.getElementsByClassName("item-price");
if (nameOfItem) {
    Array.from(nameOfItem).forEach(input => {
      return validityCheck(input, /^([a-zA-Z ])+$/, "")
    })
}
if (quantityOfItem) {
    Array.from(quantityOfItem).forEach(input => {
      return validityCheck(input, /^[0-9]+$/, "")
    })
}
if (priceOfItem) {
    Array.from(priceOfItem).forEach(input => {
      return validityCheck(input, /^[0-9]+$/, "")
    })
}

// checking if  theres no item added to the input 
if(itemAppender.innerHTML === ""){
  itemAlert.textContent = "An item must be added";
  valid = false;
}else{
  itemAlert.textContent = "";
}
// returning the validity for all inputs 
return valid;
}
//
// function for each inputs in which the input's  alert message is been display if the input is active the mmessage disappears 
//
let infoGetters = document.getElementsByClassName("info-getters");
if(infoGetters){
  Array.from(infoGetters).forEach(getter => {
    getter.addEventListener("focus", function () {
      let alert = this.nextElementSibling;
      if (alert || this.classList.contains("invalid")) {
        alert.textContent = "";
        this.classList.remove("invalid");
      }
    })
  })
}

// function to generate a unique id for each invoice  
//and also check if the input already exist so it can recurse to generate a new one
//
function recieptIdGenerator() {

  const numbers = "1234567890";
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomNumberIndex = '';
  let randomLetterIndex = '';
// generating 2 random letters
  for (let x = 0; x < 2; x++) {
    let randomLetters = Math.floor(Math.random() * letters.length);
    randomLetterIndex += letters.charAt(randomLetters);
  }
  
// generating  4 random numbers 
  for (let i = 0; i < 4; i++) {
    let randomNumbers = Math.floor(Math.random() * numbers.length);
    randomNumberIndex += numbers.charAt(randomNumbers);
  }
  const recieptId = randomLetterIndex.concat(randomNumberIndex);

  // Check if the generated recieptId already exists in invoiceList
  const exists = invoiceList.some(invoice => invoice.id === recieptId);

  if (exists) {
    // Recurse to generate a new ID
    return recieptIdGenerator();
  } else {
    return recieptId;
  }
}
//
// inputs to get details to create an invoice  after the layout is display
//
const senderStreetAdressGetter = document.getElementById("sender-street-address");
const senderCityGetter = document.getElementById("sender-city");
const senderPostCodeGetter = document.getElementById("sender-post-code");
const senderCountryGetter = document.getElementById("sender-country");
const clientNameGetter = document.getElementById("client-name");
const clientEmailGetter = document.getElementById("client-email");
const clientStreetAddressGetter = document.getElementById("client-street-address");
const clientCityGetter = document.getElementById("client-city");
const clientPostCodeGetter = document.getElementById("client-post-code");
const clientCountryGetter = document.getElementById("client-country");
const projectDescriptionGetter = document.getElementById('project-description');
//
// funnction to generate and store and invoice from all the infos from the inputs 
//
function generateInvoice(creator) {

// to calculate the total items price from the itemList array 
let allItemsTotalPrice = 0;
for (let i = 0; i < itemList.length; i++) {
  allItemsTotalPrice += itemList[i].total;

}
//
// The  layout of invoice to be created in form of object to be stored in the invoiceList database
let invoice = {
    "id": recieptIdGenerator(),
  "createdAt": "",
  "paymentDue": "",
  "description": projectDescriptionGetter.value.toLocaleLowerCase(),
    "paymentTerms": paymentTermsGetter.placeholder,
  "clientName": clientNameGetter.value.toLocaleLowerCase(),
  "clientEmail": clientEmailGetter.value.toLocaleLowerCase(),
    "status": creator === "save"? "pending" : "draft",
    "senderAddress": {
      "street": senderStreetAdressGetter.value.toLocaleLowerCase(),
      "city": senderCityGetter.value.toLocaleLowerCase(),
      "postCode": senderPostCodeGetter.value.toLocaleLowerCase(),
      "country": senderCountryGetter.value.toLocaleLowerCase()
    },
    "clientAddress": {
      "street": clientStreetAddressGetter.value.toLocaleLowerCase(),
      "city": clientCityGetter.value.toLocaleLowerCase(),
      "postCode": clientPostCodeGetter.value.toLocaleLowerCase(),
      "country": clientCountryGetter.value.toLocaleLowerCase()
    },
    "items": itemList,
    "total": allItemsTotalPrice
  }

  // getting the date based on  the invoice status or how is created 

  if(creator === "save"){
    invoice.createdAt = new Date(invoiceCreatedAtGetter.value).toLocaleDateString() ;
  }else if( creator === "draft" && invoiceCreatedAtGetter.value === ""){
    invoice.createdAt = new Date().toLocaleDateString();
  }else if(creator === "draft" && invoiceCreatedAtGetter.value !== ""){
    invoice.createdAt = new Date(invoiceCreatedAtGetter.value).toLocaleDateString()
  }
  if(creator === "save"){
    invoice.paymentDue = getPaymentDue(invoiceCreatedAtGetter, paymentTermsGetter) ;
  } else if (creator === "draft" && paymentTermsGetter.value === ""){
    invoice.paymentDue = "";
  } else if (creator === "draft" && paymentTermsGetter.value !== ""){
    invoice.paymentDue = getPaymentDue(invoiceCreatedAtGetter, paymentTermsGetter);
  }


// storing the new invoice in the invoiceList database
invoiceList.push(invoice);
localStorage.setItem("invoiceList", JSON.stringify(invoiceList));

// clearing the inputs and setting the layout to display none 
for (let i = 0; i < infoGetters.length; i++) {
    infoGetters[i].value = "";
}
infoGettersContainer.style.display = "none";  
// function to create the basic info of the invoice created and displaying it in the invoice basic info displayer on the page 
createInvoiceHeading(invoiceList);
}
//
// button to set  the invoice lay to none is no invoice is not to be created 
//
let discardBtn = document.getElementById("discard-btn");
if (discardBtn) {
discardBtn.addEventListener("click", function () {

let alertMessage = document.querySelectorAll(".alert-message");
    infoGettersContainer.style.display = "none";
    itemAppender.innerHTML = "";

    for(let getter of infoGetters){
      getter.value = "";
      getter.classList.remove("invalid")
    }

    for( let alert of alertMessage){
      alert.textContent = ""
    }
    paymentTermsGetter.placeholder = "select payment terms";

 })
}

//
//create a new draft and add generateInvoice();it to the list of invoices (in memory only for now).
let saveDraftBtn = document.getElementById("save-draft-btn");
let formAlert = document.querySelector(".form-alert"); // to be use later in the editing section

if (saveDraftBtn)
saveDraftBtn.addEventListener("click", function () {
  let alertMessage = document.querySelectorAll(".alert-message");
  infoGettersContainer.style.display = "none";
  itemAppender.innerHTML = "";
  generateInvoice("draft");
  for (let getter of infoGetters) {
    getter.value = "";
    getter.classList.remove("invalid")
  }

  for (let alert of alertMessage) {
    alert.textContent = ""
  }
  paymentTermsGetter.placeholder = "select payment terms";
  itemList = [];
});
//
// save a newly created invoice
let createSaveBtn = document.getElementById("save-send-btn");
if (createSaveBtn) {
// checkimg if all inputs are valid before proceding to create and if all is valid it create an invoice 
createSaveBtn.addEventListener('click', function () {
    if (!testValidity()) {
      formAlert.textContent = "All fields must be added ";
      return;
    } else {
      generateInvoice("save");
      formAlert.textContent = "";
      let alertMessage = document.querySelectorAll(".alert-message");
      infoGettersContainer.style.display = "none";
      itemAppender.innerHTML = "";

      for (let getter of infoGetters) {
        getter.value = "";
        getter.classList.remove("invalid")
      }

      for (let alert of alertMessage) {
        alert.textContent = ""
      }
      paymentTermsGetter.placeholder = "select payment terms";
      itemList = []
    }
  })
  // updating the number of invoices created 
  //
}



// creating the basic info card for each invoice after creation 
//
function createInvoiceHeading(list) {

// getting the appender in the DOM and initially setting the innerHTML to empty 
//each the function is  called before now displaying each input in it 
let mainContainer = document.getElementById("invoice-container");
mainContainer.innerHTML = "";
// crating the layout for each invoices 
//
  list.forEach(invoice => {

// creating the box container for each input 
//
    const headingDiv = document.createElement('div');
    headingDiv.setAttribute("class", "invoice-head-container");
    const table = document.createElement('table');
    table.setAttribute("class", "invoice-heading-table");
    const tableRow = document.createElement("tr");
    const invoiceId = document.createElement('td');
    invoiceId.setAttribute("class", "heading-invoice-id");
    const dueDate = document.createElement('td');
    dueDate.setAttribute("class", "heading-due-date")
    const customerName = document.createElement('td');
    customerName.setAttribute("class", "heading-customer-name");
    // Create a span element for the id prefix
    const idPrefix = document.createElement("small");
    idPrefix.setAttribute("class", "id-prefix");
    idPrefix.textContent = "#";
//creating elements inside each cell of the table
//
    invoiceId.append(idPrefix)
    invoiceId.append(invoice.id)

    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const dateString = new Date(invoice.paymentDue).toLocaleDateString('en-US', options).replace(/,/g,""); 
    dueDate.textContent = "Due" + " " + dateString;
    customerName.textContent = invoice.clientName;


//appending rows to the table and appending it as a child element of div
//
    tableRow.appendChild(invoiceId)
    tableRow.appendChild(dueDate)
    tableRow.appendChild(customerName);
    table.appendChild(tableRow)
    //adding table as a child element of headingDiv
    headingDiv.appendChild(table);

// creating section tag with paragraph and status indicator
//
    const sectionTag = document.createElement('section');
    sectionTag.setAttribute("class", "invoice-heading-section")
    const pTag = document.createElement("p");
    pTag.textContent = "$" + " " + invoice.total.toLocaleString();
    const h4tag = document.createElement("h4");

// setting the class of the indicator based on the status of the invoice 
//
    if (invoice.status === "pending") {
      h4tag.setAttribute("class", "status-indicator status-indicator-pending");
    } else if (invoice.status === "paid") {
      h4tag.setAttribute("class", "status-indicator status-indicator-paid");
    } else if (invoice.status === "draft") {
      h4tag.setAttribute("class", "status-indicator status-indicator-draft");
    }
    h4tag.textContent = invoice.status;
    if (isDarkMode) {
      h4tag.classList.add("dark");
    }
// creating button to trigger and the display all the details of the invoice 
//
    const invoiceCardCreator = document.createElement("button");
    invoiceCardCreator.setAttribute("class", "invoice-card-creator");
    const invoiceCardCreatoricon = document.createElement('img');
    invoiceCardCreatoricon.setAttribute("src", "icon-arrow-right.svg");
// creating an A tag to retrive each invoice id and display the info in another html file 
//
    const aTag = document.createElement("a");
    aTag.setAttribute("href", `invoice.html?id=${invoice.id}`)
    aTag.appendChild(invoiceCardCreatoricon);

    invoiceCardCreator.append(aTag);

// appendindg elements into the section tag created above
//
    sectionTag.appendChild(pTag)
    sectionTag.appendChild(h4tag)
    sectionTag.appendChild(invoiceCardCreator);
// setting the style of the elements based on the theme selected 
//
    if (isDarkMode) {
      headingDiv.classList.add("dark");
      invoiceId.classList.add("dark")
      dueDate.classList.add("dark")
      pTag.classList.add("dark")
    } else if(!isDarkMode){
      headingDiv.classList.remove("dark")
      invoiceId.classList.remove("dark")
      dueDate.classList.remove("dark");
      pTag.classList.remove("dark")
    }

// adding all the children elements in the parent container
//
headingDiv.appendChild(sectionTag);

// adding event listner to the container to  display the invoice info in another html file 
//
    headingDiv.addEventListener("click", function () {
      window.location.href = aTag.getAttribute("href");
    })
//appening the whole card to the main container
//
    mainContainer.appendChild(headingDiv)

    let totalNumberOfInvoiceDisplayer = document.getElementById("invoice-total-displayer");
    if (totalNumberOfInvoiceDisplayer) {
      totalNumberOfInvoiceDisplayer.textContent = invoiceList.length;
    }
});

}
//

// displaying the content in the invoice basic displayer container 
//
let emptyInvoiceIllustration = document.querySelector(".empty-invoice-illustration");
if(emptyInvoiceIllustration){
  if (invoiceList.length === 0) {
    emptyInvoiceIllustration.style.display = "flex";
  } else {
    emptyInvoiceIllustration.style.display = "none";
    createInvoiceHeading(invoiceList)
  }
}


// function pathnameGETTER(){
//   let pathnameGet = document.querySelector(".path-name-getter");
//   return pathnameGet.innerHTML = window.location.pathname;
//   // return new URLSearchParams(window.location.search).get('pathname');
// }
// pathnameGETTER()
// displaying function based on the current location of the page so
// Element thats not on the current page doesnt cause an error 
let pathName = window.location.pathname;
if (pathName === "/starter-code/invoice.html" || pathName === "/invoice.html") {
  createInvoiceCard();
}


// function to display the filter box to filter the invoice based on the  status 
//
function invoiceFilterCheckBoxDisplay() {
  let filterDropDown = document.querySelector(".filter-drop-down");
  let dropDownIcon = document.querySelector(".icon-drop-down");
  filterDropDown.classList.toggle("display");
  dropDownIcon.classList.toggle("rotate");
}

// buton to trigger the filter box to display 
let dropDownBtn = document.querySelector(".drop-down-btn");
if (dropDownBtn) {
dropDownBtn.addEventListener("click",function(){
    invoiceFilterCheckBoxDisplay();
});
}


const selectedFilters = []; // array to store the status to  be filter 

// Function to apply filters based on selectedFilters array
//
function applyFilters() { 
  let valid = false;
// checking if the selectedFilters array is empty so as to display back the initial invoice list
//   
  if(selectedFilters .length === 0){
    createInvoiceHeading(invoiceList);
  }else{
    let filteredInvoices = invoiceList.filter((invoice) => {
      for(filter of selectedFilters){ if(invoice.status.includes(filter)){return valid = true;}else{valid  = false;}}
      return valid;
    })
    createInvoiceHeading(filteredInvoices);
  }
}

// Checkbox event listeners
//

// filtering the invoices by pending status 
//
const pendingCheckbox = document.getElementById("pending");
if (pendingCheckbox) {
  pendingCheckbox.addEventListener("click", function () {
    if (this.checked) {
      selectedFilters.push("pending");
    }else{
      selectedFilters.splice(selectedFilters.indexOf("pending"),1)
    }
    applyFilters();
    invoiceFilterCheckBoxDisplay();
  });
}
//
//filtering the invoices by paid status
//
const paidCheckBox = document.getElementById("paid");
if (paidCheckBox) {
  paidCheckBox.addEventListener("click", function () {
    if (this.checked) {
      selectedFilters.push("paid");
    } else {
      selectedFilters.splice(selectedFilters.indexOf("paid"),1)
    }
    applyFilters();
    invoiceFilterCheckBoxDisplay();
  });
}
// filtering the invoices by draft status 
//
const draftCheckBox = document.getElementById("draft");
if (draftCheckBox) {
  draftCheckBox.addEventListener('click', function(){
    if (this.checked) {
      selectedFilters.push("draft");
    } else {
      selectedFilters.splice(selectedFilters.indexOf("draft"), 1)
    }
    applyFilters();
    invoiceFilterCheckBoxDisplay();
  });
}

                                  // ///// END OF FIRST PAGE //////////


function createInvoiceCard() {
  // Get the invoice ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceId = urlParams.get('id');

  // Find the invoice to display based on the ID
  let invoiceToDisplay = invoiceList.find(invoice => invoice.id === invoiceId);

  // Get the container where the invoice card will be displayed
  let appender = document.getElementById("invoice-info-displayer-container");
  appender.innerHTML = "";

  // Check if there is an invoice to display
  if (invoiceToDisplay) {
    // Create the main invoice card container
    let invoiceCard = document.createElement("section");
    invoiceCard.setAttribute("class", "invoice-card");
    appender.appendChild(invoiceCard);

    // Create the container for the invoice editor
    let invoiceEditorContainer = document.createElement("section");
    invoiceEditorContainer.setAttribute("class", "invoice-editor-container");
    // Add a "dark" class for dark mode, if applicable
    if (isDarkMode) {
      invoiceEditorContainer.classList.add("dark");
    } else {
      invoiceEditorContainer.classList.remove("dark");
    }

    // Create the status bar container
    let statusBarContainer = document.createElement("div");
    statusBarContainer.setAttribute("class", "status-bar-container");

    // Create the status label
    let statusBarPtag = document.createElement("p");
    statusBarPtag.textContent = "Status";

    // Create the status indicator based on the invoice status
    let statusIndicator = document.createElement("h4");
    if (invoiceToDisplay.status === "pending") {
      statusIndicator.setAttribute("class", "status-indicator status-indicator-pending");
    } else if (invoiceToDisplay.status === "paid") {
      statusIndicator.setAttribute("class", "status-indicator status-indicator-paid");
    } else if (invoiceToDisplay.status === "draft") {
      statusIndicator.setAttribute("class", "status-indicator status-indicator-draft");
    }
    
    // Add a "dark" class for dark mode, if applicable
    if (isDarkMode) {
      statusIndicator.classList.add("dark");
    }

    statusIndicator.textContent = invoiceToDisplay.status;
    statusBarContainer.append(statusBarPtag, statusIndicator);

    // Create the status editing button container
    const statusEditingBtnContainer = document.createElement("div");
    statusEditingBtnContainer.setAttribute("class", "status-editing-btn-container");

    // Create the Edit button
    const editInvoiceButton = document.createElement("button");
    editInvoiceButton.setAttribute("class", "edit-btn");
    editInvoiceButton.textContent = "Edit";

    // Hide the Edit button for paid invoices
    if (invoiceToDisplay.status === "paid") {
      editInvoiceButton.style.display = "none";
    }

    // Create the Delete button
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete-btn");
    deleteButton.textContent = "Delete";

    // Show the Delete button conditionally for paid invoices on mobile
    if (invoiceToDisplay.status === "paid" && isMobile) {
      deleteButton.classList.add("translate");
    }

    // Create the Mark as Paid button
    const statusMarkerBtn = document.createElement("button");
    statusMarkerBtn.setAttribute("class", "status-marker-btn");
    statusMarkerBtn.textContent = "Mark as paid";

    // Hide the Mark as Paid button for paid invoices
    if (invoiceToDisplay.status === "paid") {
      statusMarkerBtn.style.display = "none";
    }

    // Append buttons to the status editing button container
    statusEditingBtnContainer.append(editInvoiceButton, deleteButton, statusMarkerBtn);

    // Append status bar and buttons to the invoice editor container
    invoiceEditorContainer.append(statusBarContainer, statusEditingBtnContainer);
    invoiceCard.appendChild(invoiceEditorContainer);

    // Create the container for invoice information
    const infosSection = document.createElement("section");
    infosSection.setAttribute("class", "infos-container");

    // Add a "dark" class for dark mode, if applicable
    if (isDarkMode) {
      infosSection.classList.add('dark');
    }

    // Create the sender info section
    let senderInfoSection = document.createElement("div");
    senderInfoSection.setAttribute("class", "sender-info");

    // Create the invoice ID display
    let senderSectionFirstSpan = document.createElement("span");
    let invoiceId = document.createElement("h2");
    const idPrefix = document.createElement("small");
    idPrefix.setAttribute("class", "id-prefix");
    idPrefix.textContent = "#";
    invoiceId.append(idPrefix);
    invoiceId.append(invoiceToDisplay.id);

    // Create the invoice description display
    let invoiceDescription = document.createElement("p");
    invoiceDescription.setAttribute("class", "invoice-description");
    invoiceDescription.textContent = invoiceToDisplay.description;
    senderSectionFirstSpan.append(invoiceId, invoiceDescription);

    // Create a <span> element to group sender's address details
    let senderSectionSecondSpan = document.createElement("span");

    // Create a <p> element to display the sender's street address
    let senderStreet = document.createElement("p");
    senderStreet.setAttribute("class", "sender-address-displayer"); // Add a CSS class for styling
    senderStreet.textContent = invoiceToDisplay.senderAddress.street; // Set the text content

    // Create a <p> element to display the sender's city
    let senderCity = document.createElement("p");
    senderCity.setAttribute("class", "sender-city-displayer"); // Add a CSS class for styling
    senderCity.textContent = invoiceToDisplay.senderAddress.city; // Set the text content

    // Create a <p> element to display the sender's postal code
    let senderPostCode = document.createElement("p");
    senderPostCode.setAttribute("class", "sender-postcode-displayer"); // Add a CSS class for styling
    senderPostCode.textContent = invoiceToDisplay.senderAddress.postCode; // Set the text content

    // Create a <p> element to display the sender's country
    let senderCountry = document.createElement("p");
    senderCountry.setAttribute("class", "sender-country-displayer"); // Add a CSS class for styling
    senderCountry.textContent = invoiceToDisplay.senderAddress.country; // Set the text content

    // Append all address-related <p> elements to the sender's address display section
    senderSectionSecondSpan.append(senderStreet, senderCity, senderPostCode, senderCountry);

    // Append the entire sender's address section to the sender info section
    senderInfoSection.append(senderSectionFirstSpan, senderSectionSecondSpan);


    // Create the client info section
    let clientInfoSection = document.createElement("div");
    clientInfoSection.setAttribute("class", "client-info");

    // Create the invoice date and due date section
    let invoiceDateContainer = document.createElement("section");
    invoiceDateContainer.setAttribute("class", "invoice-date-container");

    // Create a <span> element to group the invoice date details
    let invoiceDateFirstSpan = document.createElement("span");

    // Create a <p> element for the "Invoice Date" label
    let infoTitle = document.createElement("p");
    infoTitle.setAttribute("class", "info-title"); // Add a CSS class for styling
    infoTitle.textContent = "Invoice Date"; // Set the label text

    // Create an <h2> element to display the invoice creation date
    let invoiceCreatedDate = document.createElement("h2");
    invoiceCreatedDate.setAttribute("class", "invoice-created-date"); // Add a CSS class for styling

    // get the created date 
    let invoiceCreated = new Date(invoiceToDisplay.createdAt);

    // Increase the day by one
    invoiceCreated.setDate(invoiceCreated.getDate() + 1);

        // Convert to ISO string in local time zone
    let createdISOString = invoiceCreated.toISOString().split("T")[0]

    // Display the local ISO string
    invoiceCreatedDate.textContent = createdISOString; // Set the invoice creation date

    // Append the "Invoice Date" label and the actual date to the first span
    invoiceDateFirstSpan.append(infoTitle, invoiceCreatedDate);

    // Create a <span> element to group the due date details
    let invoiceDateSecondSpan = document.createElement("span");

    // Create a <p> element for the "Payment due" label
    let dueDateTitle = document.createElement("p");
    dueDateTitle.setAttribute("class", "info-title"); // Add a CSS class for styling
    dueDateTitle.textContent = "Payment due"; // Set the label text

    // Create an <h2> element to display the payment due date
    let invoiceDueDate = document.createElement("h2");
    invoiceDueDate.setAttribute("class", "invoice-due-date"); // Add a CSS class for styling

    // get the date due 
    const invoiceDue = new Date(invoiceToDisplay.paymentDue);
    // Increase the day by one
    invoiceDue.setDate(invoiceDue.getDate() + 1);

    // Convert to ISO string in local time zone
    const dueISOString = invoiceDue.toISOString().split("T")[0];

    // Display the local ISO string
    invoiceDueDate.textContent = dueISOString; // Set the payment due date

    // invoiceDueDate.textContent = new Date(invoiceToDisplay.paymentDue).toISOString(); 

    // Append the "Payment due" label and the actual due date to the second span
    invoiceDateSecondSpan.append(dueDateTitle, invoiceDueDate);


    // Append date sections to the invoice date container
    invoiceDateContainer.append(invoiceDateFirstSpan, invoiceDateSecondSpan);

    // Create the second section to append the client name, postcode, address, and country
    let clientNameAndAddressContainer = document.createElement("section");

    // Create a title for the client info section
    const pinfoTitle = document.createElement("p");
    pinfoTitle.setAttribute("class", "info-title");
    pinfoTitle.textContent = "bill to";

    // Create a container for displaying the client's name
    const clientName = document.createElement("h2");
    clientName.setAttribute("class", "client-name");
    clientName.textContent = invoiceToDisplay.clientName;

    // Create a container for displaying the client's street address
    const clientStreetAddress = document.createElement("p");
    clientStreetAddress.setAttribute("class", "client-street-address-displayer");
    clientStreetAddress.textContent = invoiceToDisplay.clientAddress.street;

    // Create a container for displaying the client's city
    const clientCityDisplayer = document.createElement("p");
    clientCityDisplayer.setAttribute("class", "client-city-displayer");
    clientCityDisplayer.textContent = invoiceToDisplay.clientAddress.city;

    // Create a container for displaying the client's postal code
    const clientPostcodeDisplay = document.createElement("p");
    clientPostcodeDisplay.setAttribute("class", "client-postal-code-displayer");
    clientPostcodeDisplay.textContent = invoiceToDisplay.clientAddress.postCode;

    // Create a container for displaying the client's country
    const clientCountryDisplay = document.createElement("p");
    clientCountryDisplay.setAttribute("class", "client-country-dispayer");
    clientCountryDisplay.textContent = invoiceToDisplay.clientAddress.country;

    // Append all client info elements to the client info container
    clientNameAndAddressContainer.append(
      pinfoTitle,
      clientName,
      clientStreetAddress,
      clientCityDisplayer,
      clientPostcodeDisplay,
      clientCountryDisplay
    );

    // Create the third div to append client email address
    let clientEmailDiv = document.createElement("div");
    clientEmailDiv.setAttribute("class", "client-email-container");

    // Create a title for the client's email address
    const emailTitle = document.createElement("p");
    emailTitle.setAttribute("class", "info-title");
    emailTitle.textContent = "send to";

    // Create a container for displaying the client's email address
    const clientEmailDisplayer = document.createElement("h2");
    clientEmailDisplayer.setAttribute("class", "client-email-displayer");
    clientEmailDisplayer.textContent = invoiceToDisplay.clientEmail;

    // Append title and email address to the client email div
    clientEmailDiv.append(emailTitle, clientEmailDisplayer);

    // Append all client info sections to the client info section
    clientInfoSection.append(invoiceDateContainer, clientNameAndAddressContainer, clientEmailDiv);



    // Create items info container to display the items and their total amount
    let itemsInfoContainer = document.createElement("div");
    itemsInfoContainer.setAttribute("class", "item-info-container");
    itemsInfoContainer.innerHTML = "";

    // Create a table to display item details (name, quantity, price, total)
    const itemContainer = document.createElement("table");
    itemContainer.setAttribute("class", "item-container");

    // Check for dark mode and apply appropriate styling
    if (isDarkMode) {
      itemContainer.classList.add("dark");
    } else {
      itemContainer.classList.remove("dark");
    }

    // Create the table header for item details
    let itemHeader = document.createElement("tr");
    itemHeader.setAttribute("class", "item-header");
    itemHeader.classList.add("item-container-heading");

    // Create table headers for item name, quantity, price, and total
    const itemNameHeader = document.createElement("th");
    itemNameHeader.setAttribute("class", "item-name-header section-name");
    itemNameHeader.textContent = "Item Name";
    const itemQuantityHeader = document.createElement("th");
    itemQuantityHeader.setAttribute("class", "item-quantity-header section-quantity");
    itemQuantityHeader.textContent = "Qty.";
    const itemPriceHeader = document.createElement("th");
    itemPriceHeader.setAttribute("class", "item-price-header section-price");
    itemPriceHeader.textContent = "Price";
    const itemTotalHeader = document.createElement("th");
    itemTotalHeader.setAttribute("class", "item-total-header section-total");
    itemTotalHeader.textContent = "Total";

    // Append table headers to the table header row
    itemHeader.append(itemNameHeader, itemQuantityHeader, itemPriceHeader, itemTotalHeader);

    // Append the table header to the item container
    itemContainer.appendChild(itemHeader);

    // Loop through and display invoice items
    invoiceToDisplay.items.forEach(item => {
      let eachItemRow = document.createElement("tr");
      eachItemRow.setAttribute("class", "item-header");

      // Create a cell for displaying the item name
      const itemNameDisplayer = document.createElement("td");
      itemNameDisplayer.setAttribute("class", "item-name-displayer section-name");
      itemNameDisplayer.textContent = item.name;

      // Create a cell for displaying the item quantity
      const itemQuantityDisplayer = document.createElement("td");
      itemQuantityDisplayer.setAttribute("class", "item-quantity-displayer section-quantity");
      const quantityPrefix = document.createElement("small");
      quantityPrefix.setAttribute("class", "quantity-prefix");
      quantityPrefix.textContent = "X";
      itemQuantityDisplayer.append(item.quantity);
      itemQuantityDisplayer.append(quantityPrefix);

      // Create a cell for displaying the item price
      const itemPriceDisplayer = document.createElement("td");
      itemPriceDisplayer.setAttribute("class", "item-price-displayer section-price");
      itemPriceDisplayer.textContent = "$" + " " + item.price.toLocaleString();

      // Create a cell for displaying the item total
      const itemTotalDisplayer = document.createElement("td");
      itemTotalDisplayer.setAttribute("class", "item-total-displayer section-total");
      itemTotalDisplayer.textContent = "$" + " " + item.total.toLocaleString();

      // Append all item details to the item row
      eachItemRow.append(itemNameDisplayer, itemQuantityDisplayer, itemPriceDisplayer, itemTotalDisplayer);

      // Append the item row to the table
      itemContainer.appendChild(eachItemRow);

      // Check for dark mode and apply appropriate styling
      if (isDarkMode) {
        itemNameDisplayer.classList.add("dark");
        itemTotalDisplayer.classList.add("dark");
      } else {
        itemNameDisplayer.classList.remove("dark");
        itemTotalDisplayer.classList.remove("dark");
      }
    });

    // Create a section to display the total amount due
    let amountDueDisplayContainer = document.createElement("section");
    amountDueDisplayContainer.setAttribute("class", "amount-due-display-container");

    // Create a title for the amount due section
    const amountDueP = document.createElement("p");
    amountDueP.textContent = "Amount Due";

    // Create a container for displaying the total amount due
    const mainAmountDue = document.createElement("h2");
    mainAmountDue.setAttribute("class", "amount-due");
    mainAmountDue.textContent = "$" + " " + invoiceToDisplay.total.toLocaleString();

    // Append the title and total amount due to the amount due section
    amountDueDisplayContainer.append(amountDueP, mainAmountDue);

    // Append the item container and amount due section to the items info container
    itemsInfoContainer.append(itemContainer, amountDueDisplayContainer);

// End of the items info container


// Append invoice information section to the main invoice card
    infosSection.append(senderInfoSection, clientInfoSection, itemsInfoContainer);
    invoiceCard.appendChild(infosSection);



 // Add event listeners for the buttons
 
    // Add an event listener to the edit invoice button 
    editInvoiceButton.addEventListener("click", function () {
      editInvoice(invoiceToDisplay);
    });


    // Add an event listener to the deleteButton element
    deleteButton.addEventListener("click", function () {
      // Create a modal container element
      let modalContainer = document.createElement("div");
      modalContainer.setAttribute("class", "modal");

      // Create a modal box element
      let modalBox = document.createElement("section");
      modalBox.setAttribute("class", "modal-box");

      // Create a modal header with a confirmation message
      let modalBoxHeader = document.createElement("h1");
      modalBoxHeader.setAttribute("class", "modal-header");
      modalBoxHeader.textContent = "Confirm Deletion";

      // Create a modal message element with a deletion confirmation message
      let modalMessage = document.createElement("p");
      modalMessage.setAttribute("class", "modal-message");
      modalMessage.textContent = `Are you sure you want to delete invoice #${invoiceToDisplay.id}? This action cannot be undone.`;

      // Create a container for modal buttons
      let modalBtnContainer = document.createElement("div");
      modalBtnContainer.setAttribute("class", "modal-button-container");

      // Create a cancel button for the modal
      let modalCancelBtn = document.createElement("button");
      modalCancelBtn.setAttribute('type', "button");
      modalCancelBtn.setAttribute("class", "modal-cancel-btn");
      modalCancelBtn.textContent = "Cancel";

      // Create a delete button for the modal
      let modalDeleteBtn = document.createElement("button");
      modalDeleteBtn.setAttribute("type", "submit");
      modalDeleteBtn.setAttribute("class", "modal-delete-btn");
      modalDeleteBtn.textContent = "Delete";

      // Append cancel and delete buttons to the modal button container
      modalBtnContainer.append(modalCancelBtn, modalDeleteBtn);

      // Append modal header, message, and button container to the modal box
      modalBox.append(modalBoxHeader, modalMessage, modalBtnContainer);

      // Append the modal box to the modal container
      modalContainer.appendChild(modalBox);

      // Prepend the modal container to the document body
      document.body.prepend(modalContainer);

      // Check if the dark mode is enabled and apply appropriate styling
      if (isDarkMode) {
        modalBox.classList.add("dark");
        modalMessage.classList.add("dark");
      }

      // Add an event listener to the cancel button to close the modal
      modalCancelBtn.addEventListener("click", function () {
        modalContainer.style.display = "none";
      });

      // Add an event listener to the delete button to perform the deletion action
      modalDeleteBtn.addEventListener("click", function () {
        // Find the index of the invoice to delete in the invoiceList
        let invoiceToDelete = invoiceList.findIndex(invoice => invoice.id === invoiceToDisplay.id);
        // Remove the invoice from the invoiceList
        invoiceList.splice(invoiceToDelete, 1);
        // Update the localStorage with the modified invoiceList
        localStorage.setItem("invoiceList", JSON.stringify(invoiceList));
        // Clear the appender content
        appender.innerHTML = "";
        // Navigate back to the previous page
        window.history.back();
        // Recreate the invoice heading and cards
        createInvoiceHeading();
      });
    });

    // Event listener for the "Mark as paid" button
    statusMarkerBtn.addEventListener("click", function () {
      // Check if the invoice status is "pending"
      if (invoiceToDisplay.status === "pending") {
        // If it's pending, update the status to "paid"
        invoiceToDisplay.status = "paid";
        // Update the invoice list in local storage to save the changes
        localStorage.setItem("invoiceList", JSON.stringify(invoiceList));
        // Refresh the displayed invoice card and the invoice heading
        createInvoiceCard();
         applyTheme()
      }
    });

    // end of Elements 

   } //end of invoice card layout 
}

// Get the "Go Back" button element
let windowNavigatorButton = document.querySelector(".go-back-btn");

// Check if the button element exists
if (windowNavigatorButton) {
  // Add a click event listener to the "Go Back" button
  windowNavigatorButton.addEventListener("click", function () {
    // Navigate back to the previous page in the browser's history
    window.history.back();
    location.reload();
    // Refresh the invoice heading
    createInvoiceHeading();
  });
}
                                                              /////////  END OF INVOICE CARD FUNCTION ///////////



function editInvoice(invoice) {
  
  // Get the edit invoice container element and display it
  let editInvoiceContainer = document.querySelector(".edit-invoice-info-container");
  editInvoiceContainer.style.display = "block";

  // Check if the edit invoice container exists
  if (editInvoiceContainer) {
    // Update invoice header with "Edit" and the invoice ID
    const invoiceHeader = editInvoiceContainer.querySelector(".id-displayer");
    invoiceHeader.innerHTML = "Edit" + " " + "#" + invoice.id;

    // Update sender's address fields with the invoice data
    const senderAddressEditer = document.querySelector(".sender-street-address-editer");
    senderAddressEditer.value = invoice.senderAddress.street;

    const senderCityEditer = document.querySelector(".sender-city-editer");
    senderCityEditer.value = invoice.senderAddress.city;

    const senderPostCodeEditer = document.querySelector(".sender-post-code-editer");
    senderPostCodeEditer.value = invoice.senderAddress.postCode;

    const senderCountryEditer = document.querySelector(".sender-country-editer");
    senderCountryEditer.value = invoice.senderAddress.country;

    // Update client information fields (name, email, address) with the invoice data
    const clientNameEditer = document.querySelector(".client-name-editer");
    clientNameEditer.value = invoice.clientName;

    const clientEmailEditer = document.querySelector(".client-email-editer");
    clientEmailEditer.value = invoice.clientEmail;

    const clientStreetAddressEditer = document.querySelector(".client-street-address-editer");
    clientStreetAddressEditer.value = invoice.clientAddress.street;

    const clientCityEditer = document.querySelector(".client-city-editer");
    clientCityEditer.value = invoice.clientAddress.city;

    const clientPostCodeEditer = document.querySelector(".client-post-code-editer");
    clientPostCodeEditer.value = invoice.clientAddress.postCode;

    const clientCountryEditer = document.querySelector(".client-country-editer");
    clientCountryEditer.value = invoice.clientAddress.country;

    // Update invoice creation date field with the invoice data
    const createdAtEditor = document.querySelector(".created-at-editor");
    createdAtEditor.value = invoice.createdAt;

    // Update payment terms field with the invoice data
    const paymentTermEditor = document.querySelector(".payment-terms-editor");
    paymentTermEditor.value = `Net ${invoice.paymentTerms} days`;
    paymentTermEditor.placeholder = invoice.paymentTerms;

    // Add event listener to show/hide payment terms options
    let paymentTermsOptionEditor = document.querySelector(".options-container")
    paymentTermEditor.addEventListener("click", function () {
      paymentTermsOptionEditor.classList.toggle("visible");
    })

    // Add event listeners to payment term options and update the selected option
    let paymentOptions = paymentTermsOptionEditor.getElementsByTagName("option");
    for (let i = 0; i < paymentOptions.length; i++) {
      paymentOptions[i].addEventListener("click", function () {
        paymentTermEditor.value = this.textContent;
        paymentTermEditor.placeholder = this.value;
        getPaymentDue(createdAtEditor, paymentTermEditor);
      })
    }

    // Update project description field with the invoice data
    const projectDescriptionEditor = document.querySelector(".project-description-editor");
    projectDescriptionEditor.value = invoice.description;

    // Add event listener to the "Add Item" button
    const addItemEditorBtn = document.querySelector(".add-item-editor-btn");

    // Get the item appender container and add an event listener to the "Add Item" button
    let itemAppender = document.querySelector(".item-editor-appender");
    addItemEditorBtn.addEventListener("click", function () {
      createItem(invoice.items, itemAppender);
    });

    // Loop through each item in the invoice
    invoice.items.forEach(item => {
      // Create a new section for each item
      let itemToEdit = document.createElement("section");
      itemToEdit.setAttribute("class", "item list");

      // Create input fields for item name, quantity, price, and total price
      const itemName = document.createElement("input");
      itemName.setAttribute("class", "item-name name info-getters");
      itemName.value = item.name;

      const itemQuantity = document.createElement("input");
      itemQuantity.setAttribute("class", "item-quantity quantity info-getters");
      itemQuantity.value = item.quantity;

      const itemPrice = document.createElement("input");
      itemPrice.setAttribute("class", "item-price price info-getters");
      itemPrice.value = item.price;

      const itemTotalPrice = document.createElement("input");
      itemTotalPrice.setAttribute("class", " total item-total-price item-total info-getters");
      itemTotalPrice.disabled = true;
      itemTotalPrice.value = item.total;

      // Create a delete button for each item
      let deleteButton = document.createElement("button");
      deleteButton.setAttribute("class", "delete-item item-edit-delete-btn");
      const iconDelete = document.createElement("img");
      iconDelete.src = "icon-delete.svg";
      deleteButton.append(iconDelete);

      // Append input fields and delete button to the item section
      itemToEdit.append(itemName, itemQuantity, itemPrice, itemTotalPrice, deleteButton);

      // Append the item section to the item appender container
      itemAppender.append(itemToEdit);

      // Function to calculate the total price for an item based on quantity and price
      function calcualteTotalPrice(unitQuantity, price) {
        if (this.value === "") {
          itemTotalPrice.value = "";
        } else {
          let totalPrice = parseInt(unitQuantity.value) * parseInt(price.value);
          itemTotalPrice.value = totalPrice.toFixed(2);
        }
      }

      // Add input event listeners to recalculate total price when quantity or price changes
      itemQuantity.addEventListener("input", function () {
        calcualteTotalPrice(this, itemPrice);
      });
      itemPrice.addEventListener("input", function () {
        calcualteTotalPrice(itemQuantity, this);
      });

      // Function to update item indices
      function updateIndices() {
        for (let i = 0; i < invoice.items.length; i++) {
          invoice.items[i].index = i;
        }
      }

      // Add event listener to delete button to remove the item and update indices
      deleteButton.addEventListener("click", function () {
        updateIndices();
        let findIndex = Array.from(itemAppender.children).indexOf(this.parentNode);
        let removeIndex = invoice.items.findIndex(item => item.index === findIndex);
        invoice.items.splice(removeIndex, 1);
        this.parentNode.remove();
        console.log(itemList);
      });

      // Apply theme (assuming this function sets the theme for the item section)
      applyTheme();
    });

    // Function to validate the input fields
    function testValidity() {
      valid = true;

      // Validate sender's address fields
      validityCheck(senderAddressEditer, /^(?:[a-zA-Z0-9 ]+[a-zA-Z ]+)$/, "words"); // Checks if the sender's address contains words

      validityCheck(senderCityEditer, /^[A-Za-z ]+$/, "letters"); // Checks if the sender's city contains only letters

      validityCheck(senderPostCodeEditer, /^[0-9]+$/, "numbers"); // Checks if the sender's postal code contains only numbers

      validityCheck(senderCountryEditer, /^[a-zA-Z]+$/, "letters"); // Checks if the sender's country contains only letters

      // Validate client's information fields
      validityCheck(clientNameEditer, /^([a-zA-Z ])+$/, "letters"); // Checks if the client's name contains only letters

      validityCheck(clientEmailEditer, /\S+@\S*\.\S*/, "email address"); // Checks if the client's email is a valid email address

      validityCheck(clientStreetAddressEditer, /^(?:[a-zA-Z0-9 ]+[a-zA-Z ]+)$/, "words"); // Checks if the client's street address contains words

      validityCheck(clientCityEditer, /^[A-Za-z ]+$/, "letters"); // Checks if the client's city contains only letters

      validityCheck(clientPostCodeEditer, /^[0-9]+$/, "number"); // Checks if the client's postal code contains only numbers

      validityCheck(clientCountryEditer, /^[A-za-z]+$/, "letters"); // Checks if the client's country contains only letters

      validityCheck(projectDescriptionEditor, /^[a-zA-Z ]+$/, "letters"); // Checks if the project description contains only letters

      validityCheck(paymentTermEditor, "", ""); // Checks the payment term (no specific validation provided)

      // validity check on item if created
      const nameOfItem = document.getElementsByClassName("item-name");
      const quantityOfItem = document.getElementsByClassName("item-quantity");
      const priceOfItem = document.getElementsByClassName("item-price");

      // Check validity of item names, quantities, and prices if they exist
      if (nameOfItem) {
        Array.from(nameOfItem).forEach(input => {
          return validityCheck(input, /^([a-zA-Z ])+$/, ""); // Checks if item names contain only letters
        });
      }
      if (quantityOfItem) {
        Array.from(quantityOfItem).forEach(input => {
          return validityCheck(input, /^[0-9]+$/, ""); // Checks if item quantities contain only numbers
        });
      }
      if (priceOfItem) {
        Array.from(priceOfItem).forEach(input => {
          return validityCheck(input, /^[0-9]+$/, ""); // Checks if item prices contain only numbers
        });
      }
      // checking if  theres no item added to the input 
      if (itemAppender.innerHTML === "") {
        itemAlert.textContent = "An item must be added";
        valid = false;
      } else {
        itemAlert.textContent = "";
      }

      return valid; // Returns true if all validation checks pass
    } // function to check validity ends here 

    function updateInvoice() {
      // Update the invoice object with the edited values
      invoice.id = invoice.id; // This line doesn't change anything as you're assigning the same value to itself

      invoice.createdAt = invoice.createdAt; // This line also doesn't change anything

      invoice.paymentDue = invoice.paymentDue; // This line doesn't change anything

      invoice.paymentTerms = invoice.paymentTerms; // This line doesn't change anything

      invoice.status = "pending"; // Update the invoice status to "pending"

      // Update the sender's address details
      invoice.senderAddress.street = senderAddressEditer.value;
      invoice.senderAddress.city = senderCityEditer.value;
      invoice.senderAddress.postCode = senderPostCodeEditer.value;
      invoice.senderAddress.country = senderCountryEditer.value;

      // Update the client's details
      invoice.clientName = clientNameEditer.value;
      invoice.clientEmail = clientEmailEditer.value;
      invoice.clientAddress.street = clientStreetAddressEditer.value;
      invoice.clientAddress.city = clientCityEditer.value;
      invoice.clientAddress.postCode = clientPostCodeEditer.value;
      invoice.clientAddress.country = clientCountryEditer.value;

      // Update the project description and payment due date
      invoice.description = projectDescriptionEditor.value;
      invoice.createdAt = createdAtEditor.value;
      invoice.paymentDue = getPaymentDue(createdAtEditor, paymentTermEditor);

      // Update the items array with the edited item values
      const editedItems = itemAppender.getElementsByClassName("item");
      Array.from(editedItems).forEach((itemToEdit, index) => {
        let itemToEditName = itemToEdit.querySelector(".item-name");
        let itemToEditQuantity = itemToEdit.querySelector(".item-quantity");
        let itemToEditPrice = itemToEdit.querySelector(".item-price");
        let itemToEditTotalPrice = itemToEdit.querySelector(".item-total-price");

        // Update the item details in the invoice
        invoice.items[index].name = itemToEditName.value;
        invoice.items[index].quantity = parseInt(itemToEditQuantity.value);
        invoice.items[index].price = parseInt(itemToEditPrice.value);
        invoice.items[index].total = parseFloat(itemToEditTotalPrice.value);
      });

      // Recalculate the total amount for the invoice based on updated item values
      let allItemsTotalPrice = 0;
      for (let i = 0; i < invoice.items.length; i++) {
        allItemsTotalPrice += invoice.items[i].total;
      }
      invoice.total = allItemsTotalPrice;

      // Update local storage with the updated invoice data
      localStorage.setItem("invoiceList", JSON.stringify(invoiceList));

      // Hide the edit invoice container
      editInvoiceContainer.style.display = "none";

      // Update the UI by creating the invoice card
      createInvoiceCard();
    }// end of updating function

    // Cancel button to cancel editing and discard changes
    const editCancelBtn = document.querySelector(".edit-cancel-btn");
    editCancelBtn.addEventListener("click", function () {
      // Hide the edit invoice container
      editInvoiceContainer.style.display = "none";

      // Clear any previous item-related error messages and input values
      itemAppender.innerHTML = "";
      itemAlert.textContent = "";

      // Clear the input fields' values
      for (let i = 0; i < infoGetters.length; i++) {
        infoGetters.value = "";
      }

      // Update the invoice with any changes made (essentially discarding changes)
      updateInvoice();

      // Apply any theme-related logic (if present)
      applyTheme();
    });

    // Save button to save the edited invoice
    const saveButton = document.querySelector(".save-edited-invoice");
    saveButton.addEventListener("click", function () {
      if (!testValidity()) {
        // If the form validation fails, display an error message
        formAlert.textContent = "All fields must be added ";
        return; // Exit the function to prevent further execution
      } else {
        // If the form is valid:
        itemAppender.innerHTML = ""; // Clear the item appender (where item inputs are added)
        itemAlert.textContent = ""; // Clear any previous item-related error messages
        formAlert.textContent = ""; // Clear the form-level error message
        for (let i = 0; i < infoGetters.length; i++) {
          infoGetters.value = ""; // Clear the input fields' values
        }
        updateInvoice(); // Call the updateInvoice function to save the edited invoice
        applyTheme(); // Apply the theme (if there is any theme-related logic here)
      }
    });

  } //end of components 
}
 
                                                        ////// //////// END OF UPDATING FUNCTION //////////









const themeChanger = document.querySelector(".theme-changer");

// Function to apply the selected theme
function applyTheme() {
  // Select various elements to apply theme to
  let nav = document.querySelector(".nav");
  let mainHeading = document.querySelector(".invoice-manager-main-heading");
  let filterContainer = document.querySelector(".filter-container");
  let infoGettersContainer = document.querySelectorAll(".info-getters-container");
  let calendarContainer = document.querySelector(".calendar-container");
  let option = document.querySelectorAll("option");
  let goBackBtn = document.querySelector(".go-back-btn");
  let Headers = document.querySelectorAll("h2");
  let filterDropDown = document.querySelector(".filter-drop-down");
  let detailsHeader = document.querySelector(".details-header");
  let addItemBtn = document.querySelector(".add-item-btn");

  // Check if dark mode is enabled
  if (!isDarkMode) {
    // Remove dark mode classes from elements
    document.body.classList.remove("dark");
    nav.classList.remove("dark");
    if (mainHeading) {
      mainHeading.classList.remove("dark");
    }
    if (filterContainer) {
      filterContainer.classList.remove("dark");
    }
    if (infoGettersContainer) {
      for (x of infoGettersContainer) {
        x.classList.remove("dark");
      }
    }
    if (infoGetters) {
      for (x of infoGetters) {
        x.classList.remove("dark");
      }
    }
    if (calendarContainer) {
      calendarContainer.classList.remove("dark");
    }
    if (option) {
      for (x of option) {
        x.classList.remove("dark");
      }
    }
    if (goBackBtn) {
      goBackBtn.classList.remove("dark");
    }
    for (x of Headers) {
      x.classList.remove("dark");
    }
    if (filterDropDown) {
      filterDropDown.classList.remove("dark");
    }
    if (detailsHeader) {
      detailsHeader.classList.remove('dark');
    }
    if(addItemBtn){
      addItemBtn.classList.remove("dark")
    }
    if(saveDraftBtn){
      saveDraftBtn.classList.remove("dark")
    }
    if(discardBtn){
      discardBtn.classList.remove("dark")
    }
    // Toggle the theme changer icon
    if (themeChanger.getAttribute("src") === "icon-moon.svg") {
      themeChanger.setAttribute("src", "icon-sun.svg");
    }
  } else if (isDarkMode) {
    // Add dark mode classes to elements
    document.body.classList.add("dark");
    nav.classList.add("dark");
    if (mainHeading) {
      mainHeading.classList.add("dark");
    }
    if (filterContainer) {
      filterContainer.classList.add("dark");
    }
    if (infoGettersContainer) {
      for (x of infoGettersContainer) {
        x.classList.add("dark");
      }
    }
    if (infoGetters) {
      for (x of infoGetters) {
        x.classList.add("dark");
      }
    }
    if (calendarContainer) {
      calendarContainer.classList.add("dark");
    }
    for (x of option) {
      x.classList.add("dark");
    }
    if (goBackBtn) {
      goBackBtn.classList.add("dark");
    }
    for (x of Headers) {
      x.classList.add("dark");
    }
    if (filterDropDown) {
      filterDropDown.classList.add("dark");
    }
    if (detailsHeader) {
      detailsHeader.classList.add('dark');
    }
    if (addItemBtn) {
      addItemBtn.classList.add("dark")
    }
    if(saveDraftBtn){
      saveDraftBtn.classList.add("dark")
    }
    if(discardBtn){
    }
  }
}

// Event listener for theme changer button
if (themeChanger) {
  themeChanger.addEventListener("click", function () {
    // Toggle dark mode
    isDarkMode = !isDarkMode;
    // Save the dark mode preference in local storage
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    // Reload the page to apply the new theme
    location.reload();
    // Apply the theme
    applyTheme();
  });
}

// Apply the theme when the page loads initially 
applyTheme();

                   ////////// // END OF APPLY THEME FUNCTION ////////////

