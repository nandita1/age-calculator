"use strict";
const form = document.getElementById("age-calculator-form");
const dayEl = document.getElementById('day');
const monthEl = document.getElementById('month');
const yearEl = document.getElementById('year');
const requiredFieldErrorMesage = 'This field is required';
const mustBeInThePastErrorMessage = 'Must be in the past';
const invalidMonthErrorMessage = 'Must be a valid month';
const invalidDayErrorMessage = 'Must be a valid day';
const isLeapYear = (year) => (0 == year % 4) && (0 != year % 100) || (0 == year % 400);
const isValidMonth = (month) => month < 1 || month > 12;
const checkYear = ({ year, currentDate }) => {
    const currentYear = currentDate.getFullYear();
    if (!year) {
        return requiredFieldErrorMesage;
    }
    if (year > currentYear) {
        return mustBeInThePastErrorMessage;
    }
    return '';
};
const checkMonth = ({ year, month, currentDate }) => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    if (!month) {
        return requiredFieldErrorMesage;
    }
    if (isValidMonth(month)) {
        return invalidMonthErrorMessage;
    }
    if (year === currentYear && month > currentMonth) {
        return mustBeInThePastErrorMessage;
    }
    return '';
};
const checkDay = ({ year, month, day, currentDate }) => {
    const noOfDaysInFeb = isLeapYear(year) ? 29 : 28;
    const daysInMonths = [31, noOfDaysInFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDay();
    if (!day) {
        return requiredFieldErrorMesage;
    }
    if (day < 1 || (isValidMonth(month) && day > daysInMonths[month - 1])) {
        return invalidDayErrorMessage;
    }
    if (year === currentYear && month === currentMonth && day > currentDay) {
        return mustBeInThePastErrorMessage;
    }
    return '';
};
const removeErrorClassFromInput = (input) => {
    const formField = input.parentElement;
    // remove the error class
    formField === null || formField === void 0 ? void 0 : formField.classList.remove('error-element');
};
const addErrorClassToInput = (input) => {
    const formField = input.parentElement;
    // add the error class
    formField === null || formField === void 0 ? void 0 : formField.classList.add('error-element');
};
const removeError = (input) => {
    // get the form-field element
    const formField = input.parentElement;
    // show the error message
    const errorMsgElement = formField === null || formField === void 0 ? void 0 : formField.querySelector('.error-msg');
    if (errorMsgElement) {
        errorMsgElement.textContent = '';
    }
};
const showError = (input, message) => {
    // get the form-field element
    const formField = input.parentElement;
    // show the error message
    const errorMsgElement = formField === null || formField === void 0 ? void 0 : formField.querySelector('.error-msg');
    if (errorMsgElement) {
        errorMsgElement.textContent = message;
    }
};
const extractNumbers = (str) => {
    var _a;
    // Use regular expression to match only numbers
    const numbers = str === null || str === void 0 ? void 0 : str.match(/\d+/g);
    // Join the matched numbers into a single string
    return (_a = numbers === null || numbers === void 0 ? void 0 : numbers.join('')) !== null && _a !== void 0 ? _a : '';
};
const calculateAge = ({ day, month, year }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0-11)
    const currentDay = currentDate.getDate();
    const years = currentYear - year;
    const months = currentMonth - month;
    const days = currentDay - day;
    return { years, months, days };
};
form.addEventListener('submit', (e) => {
    var _a, _b, _c;
    e.preventDefault();
    const formData = new FormData(form);
    const day = Number(extractNumbers((_a = formData.get('day')) === null || _a === void 0 ? void 0 : _a.toString()));
    const month = Number(extractNumbers((_b = formData.get('month')) === null || _b === void 0 ? void 0 : _b.toString()));
    const year = Number(extractNumbers((_c = formData.get('year')) === null || _c === void 0 ? void 0 : _c.toString()));
    const currentDate = new Date();
    const yearErrorMessage = checkYear({ year, currentDate });
    if (yearErrorMessage) {
        showError(yearEl, yearErrorMessage);
    }
    else {
        removeError(yearEl);
    }
    const monthErrorMessage = checkMonth({ year, month, currentDate });
    if (monthErrorMessage) {
        showError(monthEl, monthErrorMessage);
    }
    else {
        removeError(monthEl);
    }
    const dayErrorMessage = checkDay({ year, month, day, currentDate });
    if (monthErrorMessage) {
        showError(dayEl, dayErrorMessage);
    }
    else {
        removeError(dayEl);
    }
    const isValid = !yearErrorMessage && !monthErrorMessage && !dayErrorMessage;
    if (!isValid) {
        addErrorClassToInput(yearEl);
        addErrorClassToInput(monthEl);
        addErrorClassToInput(dayEl);
        return;
    }
    removeErrorClassFromInput(yearEl);
    removeErrorClassFromInput(monthEl);
    removeErrorClassFromInput(dayEl);
    const { years, months, days } = calculateAge({ day, month, year });
    const ageValues = document.getElementsByClassName('age-value');
    ageValues[0].textContent = years.toString();
    ageValues[1].textContent = months.toString();
    ageValues[2].textContent = days.toString();
});
