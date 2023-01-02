const navigationLinks = document.querySelectorAll(".navigation__link");
const calcElems = document.querySelectorAll(".calc")
// console.log(navigationLinks);
// const formatCurrency =(n) => {
//     const currency =  new Intl.NumberFormat('ru-Ru', {
//         style: 'currency',
//         currency: 'RUB',
//         maximumFractionDigits: 2,

//     })
//     return currency.format(n);
// };

const formatCurrency = n => new Intl.NumberFormat('ru-Ru', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
}).format(n);

const debounceTimer = (fn, msec) => {
    let lastCall = 0;
    let lastCallTimer;
    return (...arg) => {
        const previosCall = lastCall;
        lastCall = Date.now();
        if ( previosCall && ((lastCall - previosCall) <= msec)) {
            clearTimeout()
        }
        lastCallTimer = setTimeout(() => {
            fn(...arg);
        }, msec);
    }
}

for (let i = 0; i < navigationLinks.length; i++) {

    navigationLinks[i].addEventListener('click', (e) => {
        e.preventDefault();
        for (let j = 0; j < calcElems.length; j++) {
            if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
                calcElems[j].classList.add('calc_active');
                navigationLinks[j].classList.add('navigation__link_active');
            } else {
                calcElems[j].classList.remove('calc_active');
                navigationLinks[j].classList.remove('navigation__link_active');
            }


        }
        // console.log(navigationLinks[i], navigationLinks[i].dataset.tax);

    })

}
{
    const ausn = document.querySelector('.ausn');
    const formAusn = ausn.querySelector('.calc__form');
    const resultTaxTotal = ausn.querySelector('.result__tax_total')
    const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');
    calcLabelExpenses.style.display = 'none';
    formAusn.addEventListener('input', debounceTimer((e) => {
        if (formAusn.type.value === 'income') {
            calcLabelExpenses.style.display = 'none';
            resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
            formAusn.expenses.value = "";
        }
        if (formAusn.type.value === 'expenses') {
            calcLabelExpenses.style.display = 'block';
            resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
        }

    }, 300));

}

{
    const selfEmployment = document.querySelector('.self-employment');
    const formSelfEmployment = selfEmployment.querySelector('.calc__form');
    const resultTaxSum = selfEmployment.querySelector('.result__tax_sum');
    const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
    const resultCompensation = selfEmployment.querySelectorAll('.result__block_compensation');

    const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
    const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
    const resultTaxResult = selfEmployment.querySelector('.result__tax_result');


    const checkCompensation = () => {
        const setDisplay = formSelfEmployment.addCompensation.checked ? 'block' : 'none';
        calcCompensation.style.display = setDisplay;
        resultCompensation.forEach((el) => {
            el.style.display = setDisplay;
        })
    }
    checkCompensation();
    formSelfEmployment.addEventListener('input', debounceTimer(() => {
        const private = formSelfEmployment.private.value * 0.04
        const legal = formSelfEmployment.legal.value * 0.06
        checkCompensation();

        const tax = private + legal;
        formSelfEmployment.compensation.value = +formSelfEmployment.compensation.value > 10_000 ? 10_000 : formSelfEmployment.compensation.value;
        const benefit = +formSelfEmployment.compensation.value;
        const resBenefit = formSelfEmployment.private.value * 0.01 + formSelfEmployment.legal.value * 0.02;
        const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
        const finalTax = tax - (benefit - finalBenefit);
        // if(formSelfEmployment.addCompensation.checked) {
        //     calcCompensation.style.display = 'block';
        // }else{calcCompensation.style.display = 'none';}
        tax > 0 ? resultTaxSum.textContent = formatCurrency(tax) : resultTaxSum.textContent = 0;
        (benefit - finalBenefit) > 0 ? resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit) : resultTaxCompensation.textContent = 0;
        finalBenefit > 0 ? resultTaxRestCompensation.textContent = formatCurrency(finalBenefit) : resultTaxRestCompensation.textContent = 0;
        finalTax > 0 ? resultTaxResult.textContent = formatCurrency(finalTax) : resultTaxResult.textContent = 0;


    }, 300));
}
/*ОСНО/ОСН*/
{
    const osno = document.querySelector('.osno');
    const formOSNO = osno.querySelector('.calc__form');
    const resultTaxNDS = osno.querySelector('.result__tax_NDS');
    const resultTaxProperty = osno.querySelector('.result__tax_tax-property');
    const resultTaxNDFL = osno.querySelector('.result__tax_NDFL');
    const resultTaxNDFL20 = osno.querySelector('.result__tax_NDFL20');
    const resultTaxProfit = osno.querySelector('.result__tax_profit');

    formOSNO.addEventListener('input', debounceTimer(() => {

        if (formOSNO.type.value === "individual") {

            resultTaxNDFL.parentElement.style.display = 'block';
            resultTaxNDFL20.parentElement.style.display = 'block';
            resultTaxProfit.parentElement.style.display = 'none';

        }
        if (formOSNO.type.value === "OOO") {

            resultTaxNDFL.parentElement.style.display = 'none';
            resultTaxNDFL20.parentElement.style.display = 'none';
            resultTaxProfit.parentElement.style.display = 'block';
        }


        const osnoIncome = +formOSNO.osnoIncome.value;
        const osnoProfit = +formOSNO.osnoProfit.value;
        const osnoProperty = +formOSNO.osnoProperty.value;

        const nds = osnoIncome * 0.2;
        nds > 0 ? resultTaxNDS.textContent = nds : resultTaxNDS.textContent = 0;
        const taxProperty = osnoProperty * 0.02;
        taxProperty > 0 ? resultTaxProperty.textContent = taxProperty : resultTaxProperty.textContent = 0;
        const profit = osnoIncome - osnoProfit;
        const ndflExpensesTotal = profit * 0.13;
        ndflExpensesTotal > 0 ? resultTaxNDFL.textContent = ndflExpensesTotal : resultTaxNDFL.textContent = 0;
        const ndflIncomeTotal = (osnoIncome - nds) * 0.13;
        ndflIncomeTotal > 0 ? resultTaxNDFL20.textContent = formatCurrency(ndflIncomeTotal) : resultTaxNDFL20.textContent = 0;

        profit > 0 ? resultTaxProfit.textContent = formatCurrency(profit * 0.2) : resultTaxProfit.textContent = 0;


    }, 300));
}
//УСН
{
    const LIMIT = 300000;
    const usn = document.querySelector('.usn');

    const formUsn = usn.querySelector('.calc__form');

    const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
    const calcLabelProperty = usn.querySelector('.calc__label_property');
    const resultBlockProperty = usn.querySelector('.result__block_property');
    const resultTaxTotal = usn.querySelector('.result__tax_total');
    const resultTaxProperty = usn.querySelector('.result__tax_property');

    /* Выполнение ерез switch
     const checkShopProperty = (typeTax) => {
         switch(typeTax) {
             case 'income': {
                 calcLabelExpenses.style.display = "none";
                 calcLabelProperty.style.display = "none";
                 resultBlockProperty.style.display = "none";
                 formUsn.expenses.value = "";
                 formUsn.property.value = "";
                 break;
             };
             case 'ip-expenses': {
                 calcLabelExpenses.style.display = "block";
                 calcLabelProperty.style.display = "none";
                 resultBlockProperty.style.display = "none";
                 formUsn.property.value = "";
                 break;
             };
             case 'ooo-expenses': {
                 calcLabelExpenses.style.display = "block";
                 calcLabelProperty.style.display = "block";
                 resultBlockProperty.style.display = "block";
                 break;
             };
         }
     }
     checkShopProperty(formUsn.typeTax.value);
     formUsn.addEventListener('input', () => {
         checkShopProperty(formUsn.typeTax.value);
     });
 */
    //Выплнение через объект
    const typeTax = {
        'income': () => {
            calcLabelExpenses.style.display = "none";
            calcLabelProperty.style.display = "none";
            resultBlockProperty.style.display = "none";
            formUsn.expenses.value = "";
            formUsn.property.value = "";
        },
        'ip-expenses': () => {
            calcLabelExpenses.style.display = "block";
            calcLabelProperty.style.display = "none";
            resultBlockProperty.style.display = "none";
            formUsn.property.value = "";
        },
        'ooo-expenses': () => {
            calcLabelExpenses.style.display = "block";
            calcLabelProperty.style.display = "block";
            resultBlockProperty.style.display = "block";
        },
    }
    const persent = {
        'income': 0.06,
        'ip-expenses': 0.15,
        'ooo-expenses': 0.15,
    }
    typeTax[formUsn.typeTax.value]();
    formUsn.addEventListener('input', debounceTimer(() => {
        typeTax[formUsn.typeTax.value]();

        const income = +formUsn.income.value;
        const expenses = +formUsn.expenses.value;
        const contributions = +formUsn.contributions.value;
        const property = +formUsn.property.value;

        let profit = income - contributions;
        if (formUsn.typeTax.value !== 'income') {
            profit -= expenses;

        }
        const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0
        const sum = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
        const taxProperty = property * 0.02;
        const tax = sum * persent[formUsn.typeTax.value];
        tax > 0 ? resultTaxTotal.textContent = formatCurrency(tax) : resultTaxTotal.textContent = 0;


        taxProperty > 0 ? resultTaxProperty.textContent = formatCurrency(taxProperty) : resultTaxProperty.textContent = 0;
    }, 300));




}
/*Налговый вычет 13% */
{

    const taxReturn = document.querySelector('.tax-return');
    const calcForm = taxReturn.querySelector('.calc__form');
    const resultNdfl = taxReturn.querySelector('.result__ndfl');



    const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl');
    const resultTaxDesiredDeduction = taxReturn.querySelector('.result__tax_desired-deduction');
    const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');
    let timer;

    calcForm.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => { 
         
            const expenses = +calcForm.expenses.value;
            const yearlyIncome = +calcForm.yearlyIncome.value;
            const sumExpenses = + calcForm.sumExpenses.value;
            const ndfl = yearlyIncome * 0.13;
            const possibleDeduction = expenses < sumExpenses ? expenses * 0.13 : sumExpenses * 0.13;
            const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl;
            resultTaxNdfl.textContent = formatCurrency(ndfl);
            resultTaxDesiredDeduction.textContent = formatCurrency(possibleDeduction);
            resultTaxDeduction.textContent = formatCurrency(deduction);
        }, 500)
    })


}