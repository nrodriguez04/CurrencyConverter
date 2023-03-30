const API_KEY = '4At3mQGmhT1ItxMLvBs1ntMucwcOBBs2'; // exchangeratesapi.io
const API_URL = `https://open.er-api.com/v6/latest?apikey=${API_KEY}`;

const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const currencyForm = document.getElementById('currency-form');
const resultDiv = document.getElementById('result');

async function fetchCurrencies() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        const currencies = Object.keys(data.rates).sort();

        for (const currency of currencies) {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            fromCurrencySelect.appendChild(option.cloneNode(true));
            toCurrencySelect.appendChild(option);
        }

        // Set default selected currencies
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'EUR';
    } catch (error) {
        console.error(error);
    }
}

async function convertCurrency(amount, fromCurrency, toCurrency) {
    try {
        const response = await fetch(`${API_URL}&base=${fromCurrency}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        const rate = data.rates[toCurrency];
        return amount * rate;
    } catch (error) {
        console.error(error);
    }
}

currencyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
        resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error(error);
        alert('Error occurred while converting currency');
    }
});

fetchCurrencies();