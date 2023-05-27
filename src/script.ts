
const form = <HTMLFormElement>document.getElementById("age-calculator-form")
const dayEl = <HTMLInputElement>document.getElementById('day')
const monthEl = <HTMLInputElement>document.getElementById('month')
const yearEl = <HTMLInputElement>document.getElementById('year')

const requiredFieldErrorMesage = 'This field is required';
const mustBeInThePastErrorMessage = 'Must be in the past';
const invalidMonthErrorMessage = 'Must be a valid month';
const invalidDayErrorMessage = 'Must be a valid day';

const isLeapYear = (year: number) => (0 == year % 4) && (0 != year % 100) || (0 == year % 400)

const isValidMonth = (month: number) => month < 1 || month > 12

interface CheckYearParams {
    readonly year: number;
    readonly currentDate: Date;
}

const checkYear = ({year, currentDate}: CheckYearParams) => {
    const currentYear = currentDate.getFullYear()
    if(!year) {
        return requiredFieldErrorMesage;
    }
    if(year > currentYear){
        return mustBeInThePastErrorMessage;
    }
    return ''
};

interface CheckMonthParams extends CheckYearParams{
    readonly month: number;
}

const checkMonth = ({year, month, currentDate}: CheckMonthParams) => {
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    if(!month) {
        return requiredFieldErrorMesage;
    }
    if(isValidMonth(month)) {
        return invalidMonthErrorMessage;
    }
    if(year === currentYear && month > currentMonth){ 
        return mustBeInThePastErrorMessage;
    }
    return ''
}

interface CheckDayParams extends CheckMonthParams {
    readonly day: number;
}

const checkDay = ({year, month, day, currentDate}: CheckDayParams) => {
    const noOfDaysInFeb = isLeapYear(year) ? 29 : 28
    const daysInMonths = [31, noOfDaysInFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDay()

    if(!day) {
        return requiredFieldErrorMesage;
    }
    if(day < 1 || (isValidMonth(month) && day > daysInMonths[month-1])) {
        return invalidDayErrorMessage;
    }
    if(year === currentYear && month ===  currentMonth && day > currentDay){ 
        return mustBeInThePastErrorMessage;
    }
    return ''
}

const removeErrorClassFromInput = (input: HTMLInputElement) => {
    const formField = input.parentElement;
    // remove the error class
    formField?.classList.remove('error-element');
}

const addErrorClassToInput = (input: HTMLInputElement) => {
    const formField = input.parentElement;
    // add the error class
    formField?.classList.add('error-element');
}

const removeError = (input: HTMLInputElement) => {
     // get the form-field element
     const formField = input.parentElement;
     // show the error message
     const errorMsgElement = formField?.querySelector('.error-msg');
     if(errorMsgElement) {errorMsgElement.textContent = '';}
}

const showError = (input: HTMLInputElement, message: string) => {
    // get the form-field element
    const formField = input.parentElement;
    // show the error message
    const errorMsgElement = formField?.querySelector('.error-msg');
    if(errorMsgElement) {errorMsgElement.textContent = message;}
};

const extractNumbers = (str?: string) => {
    // Use regular expression to match only numbers
    const numbers = str?.match(/\d+/g);
  
    // Join the matched numbers into a single string
    return numbers?.join('') ?? '';
}

interface CalculateAgeParams {
    readonly day: number;
    readonly month: number;
    readonly year: number;
}

const calculateAge = ({day, month, year}: CalculateAgeParams) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0-11)
    const currentDay = currentDate.getDate();

    const years  = currentYear - year;
    const months = currentMonth - month;
    const days = currentDay - day;

    return {years, months, days};
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    const day = Number(extractNumbers(formData.get('day')?.toString()))
    const month = Number(extractNumbers(formData.get('month')?.toString()))
    const year = Number(extractNumbers(formData.get('year')?.toString()))

    const currentDate = new Date()

    const yearErrorMessage = checkYear({year, currentDate})
    if(yearErrorMessage) {
        showError(yearEl, yearErrorMessage)
    } else {
        removeError(yearEl)
    }
    const monthErrorMessage = checkMonth({year, month, currentDate})
    if(monthErrorMessage) {
        showError(monthEl, monthErrorMessage)
    } else {
        removeError(monthEl)
    }
    const dayErrorMessage = checkDay({year, month, day, currentDate})
    if(monthErrorMessage) {
        showError(dayEl, dayErrorMessage)
    } else {
        removeError(dayEl)
    }
    const isValid = !yearErrorMessage && !monthErrorMessage && !dayErrorMessage

    if(!isValid) {
        addErrorClassToInput(yearEl)
        addErrorClassToInput(monthEl)
        addErrorClassToInput(dayEl)
        return;
    }

    removeErrorClassFromInput(yearEl)
    removeErrorClassFromInput(monthEl)
    removeErrorClassFromInput(dayEl)
    
    
    const {years, months, days} = calculateAge({day, month, year});
    const ageValues = document.getElementsByClassName('age-value');
    ageValues[0].textContent = years.toString();
    ageValues[1].textContent = months.toString();
    ageValues[2].textContent = days.toString();
})