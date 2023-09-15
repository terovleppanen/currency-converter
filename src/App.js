// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [targetCurrency, setTargetCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [output, setOutput] = useState("");

  useEffect(
    function () {
      const abortController = new AbortController();

      async function handleConversion() {
        try {
          if (!amount) return;

          const API_URL = `https://api.frankfurter.app/latest?amount=${amount}&from=${baseCurrency}&to=${targetCurrency}`;

          const response = await fetch(API_URL, {
            signal: abortController.signal,
          });

          if (!response.ok) return;

          const data = await response.json();

          setOutput(Object.values(data.rates)[0]);
        } catch (error) {
          if (error.name !== "AbortError") console.error(error.message);
        }
      }

      if (baseCurrency === targetCurrency) return setOutput(amount);

      handleConversion();

      return function () {
        abortController.abort();
      };
    },
    [amount, baseCurrency, targetCurrency]
  );

  return (
    <div>
      <input
        type="text"
        value={amount}
        onChange={(event) => setAmount(+event.target.value)}
      />
      <select
        value={baseCurrency}
        onChange={(event) => setBaseCurrency(event.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={targetCurrency}
        onChange={(event) => setTargetCurrency(event.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        {output} {output && targetCurrency}
      </p>
    </div>
  );
}
