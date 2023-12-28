"use strict";

import 'core-js/stable';
////////////////////
//Selectors
const cardNumberFront = document.querySelector('.card__front-number');
const cardNameFront = document.querySelector('.card__front-name');
const cardExpFrontMonth = document.querySelector('.card__front-exp-month');
const cardExpFrontYear = document.querySelector('.card__front-exp-year');
const cardCvcBack = document.querySelector('.card__back-cvc');

const inputForm = document.querySelector(".details");
const btnConfirm = document.querySelector(".btn-confirm");
const btnContinue = document.querySelector(".btn-continue");

const errorMessages = document.querySelectorAll("span.error-message");
const formSubmitted = document.querySelector('.form-submitted');

const blankErrorMsg = "Can't be blank";
const nameFormatErrorMsg = "Wrong Format, full name only";
const numberFormatErrorMsg = "Wrong Format, positive numbers only";
const regexName = /([a-z]+\s+[a-z]+(\s+[a-z]+(\s+[a-z]+)?)?)/gi;
const regexNumber = /\b(?:\d{4} ){3}\d{4}\b/gi;

//Code

//Display Error message
const renderError = function (element, msg) {
  let errorEl;
  Array.from(element.parentNode.childNodes).forEach((node) => {
    if (node.tagName === "SPAN") errorEl = node;
  });
  errorEl.textContent = msg;
  errorEl.style.opacity = 1;
};

//Check for blank fields
const checkBlank = function(data){
  let value = false;
  data.forEach(inp => {
    if(!inp[1]) {
      renderError(document.querySelector(`#${inp[0]}`), blankErrorMsg);
      value = true;
    }
  });
  return value;
}

const checkError = function (data){
  console.log(data);
  let value = false;

  //Helper functions
  const validateInput = (regex, ...input) =>
    input.every((inp) => inp.match(regex));

  const validateInputNumber = (...inputs) => 
    inputs.every((input) => Number.isFinite(input) && input >= 0);
  
    //Data validation Code
  for (const inp of data) {

      if(inp[1] === '') continue;

      //Name format Error checking
      if(inp[0].startsWith('cardHold') && !validateInput(regexName, inp[1])) {
        renderError(document.querySelector(`#${inp[0]}`), nameFormatErrorMsg);
        value = true;
      }

      //Card number format checking
      if(inp[0].startsWith('card_') && !validateInput(regexNumber, inp[1])){
        renderError(document.querySelector(`#${inp[0]}`), numberFormatErrorMsg)
        value = true;
      }
      
      //EXP date validation
      if ((inp[0].startsWith('exp') && !validateInputNumber(+inp[1])) || 
            (inp[0] === 'exp_month' && +inp[1] > 12)){
        renderError(document.querySelector(`#${inp[0]}`), numberFormatErrorMsg);
        value = true;
      }

      //CVC number validation
      if(inp[0] === 'cvc' && !validateInputNumber(+inp[1])){
        renderError(document.querySelector(`#${inp[0]}`), numberFormatErrorMsg);
        value = true;
      }
    
  }
  return value;
}

inputForm.addEventListener("submit", (e) => {
  //Prevent page from reloading
  e.preventDefault();

  //Remove all the previous Error Messages
  errorMessages.forEach((span) => (span.style.opacity = 0));

  //DATA of form
  const formDetails = [...new FormData(inputForm)];

  //DATA validation
  const isBlank = checkBlank(formDetails);
  const isError = checkError(formDetails);

  //Return if found any errors
  if(isBlank || isError) return;

  inputForm.classList.add('hidden');
  formSubmitted.classList.remove('hidden');

});

//Real time data display
inputForm.addEventListener('input', function(e){
  const targetEl = e.target
  if(targetEl === inputNumber && targetEl.value.length <= 16) {
    console.log();
    const inputValue = targetEl.value.replaceAll(' ', '').toUpperCase(); // Remove space character
    const paddedValue = inputValue.padEnd(16, '0');
    const formattedValue = paddedValue.replace(/(.{4})/g, '$1 ').trim();
    cardNumberFront.textContent = formattedValue;
  }
  if(targetEl === inputName){
    cardNameFront.textContent = targetEl.value;
  }
  if(targetEl === inputMonth || targetEl === inputYear){
    document.querySelector(`.card__front-${targetEl.id}`).textContent = targetEl.value.padStart(2,'0');
  }
  if(targetEl === inputCvc){
    cardCvcBack.textContent = targetEl.value;
  }
  return;
})

//Rednder new form
btnContinue.addEventListener('click',function(){
  inputName.value = inputNumber.value = inputMonth.value = inputYear.value = inputCvc.value = '';
  cardNameFront.textContent = 'Yozan Kaphle';
  cardNumberFront.textContent = '0000 0000 0000 0000';
  cardExpFrontMonth.textContent = '00';
  cardExpFrontYear.textContent = '00';
  cardCvcBack.textContent = '000';
  inputForm.classList.remove('hidden');
  formSubmitted.classList.add('hidden');
});