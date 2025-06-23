import { Navbar } from "../components/navbar";
import { Alert, Slider, NumberInput } from "@heroui/react";
import { useEffect, useState } from "react";
import { jStat } from "jstat";
import { Heatmap } from "../components/heatmap";
import dynamic from "next/dynamic";

function cumulativeDistribution(x) {
  return jStat.normal.cdf(x, 0, 1);
}

function blackScholes(stockPrice, strikePrice, timeToExpiration, interestRate, volatility) {
  function calculateBSTerm(d1, d2, call=1) {
    let x = (stockPrice * cumulativeDistribution(call * d1));
    x -= (strikePrice * (Math.pow(Math.E, -interestRate * timeToExpiration)) * cumulativeDistribution(call * d2));
    return Math.abs(x);
  }

  let callValue;
  let putValue;
  let [d1, d2] = [interestRate, interestRate]; // why isn't d1 = d2 = interestRate working :(
  let term = Math.pow(volatility, 2) / 2;

  d1 += term;
  d2 -= term;
  d1 *= timeToExpiration;
  d2 *= timeToExpiration;
  term = Math.log1p(stockPrice / strikePrice - 1);
  d1 += term;
  d2 += term;
  term = volatility * Math.sqrt(timeToExpiration);
  d1 /= term;
  d2 /= term;

  callValue = calculateBSTerm(d1, d2);
  putValue = calculateBSTerm(d1, d2, -1);
  
  
  return [callValue.toFixed(2), putValue.toFixed(2)];
}

export default function Index() {
  const [callValue, setCallValue] = useState(10.45);
  const [putValue, setPutValue] = useState(5.57);
  const [stockPrice, setStockPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(100);
  const [timeToExpiration, setTimeToExpiration] = useState(1);
  const [interestRate, setInterestRate] = useState(0.05);
  const [volatility, setVolatility] = useState(0.2);

  const Heatmap = dynamic(() => import("../components/heatmap"), {
    ssr: false,
  });


  useEffect(
    () => {
      const [calculatedCallValue, calculatedPutValue] = blackScholes(stockPrice, strikePrice, timeToExpiration, interestRate, volatility);
      setCallValue(calculatedCallValue);
      setPutValue(calculatedPutValue);
    }, [stockPrice, strikePrice, timeToExpiration, interestRate, volatility]
  );

  return (
    <>
      <Navbar />
      <div className="flex justify-center flex-col items-center ml-32">
        <Alert color="primary" className="my-8 w-fit">Coming from Hack Club? Check out the tutorial section from the navbar above to learn more about this project.</Alert>
        <h1>Input Variables</h1>
        <div className="flex *:p-4">
          <NumberInput label="Stock Price" defaultValue={100} startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          } onChange={(value) => {
            setStockPrice(value);
          }}></NumberInput>
          <NumberInput label="Strike Price" defaultValue={100} startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          } onChange={(value) => {
            setStrikePrice(value);
          }}></NumberInput>
          <NumberInput label="Time to Expiration" defaultValue={1} onChange={(value) => {
            setTimeToExpiration(value);
          }}></NumberInput>
          <NumberInput label="Risk-free Interest Rate" defaultValue={0.05} onChange={(value) => {
            setInterestRate(value);
          }}></NumberInput>
          <NumberInput label="Volatility" defaultValue={0.2} onChange={(value) => {
            setVolatility(value);
          }}></NumberInput>
        </div>
        <div className="flex *:p-2">
          <div>
            <Alert hideIcon variant="faded" color="success">
              <p>Call Value</p>
              <p className="text-4xl">${callValue}</p>
            </Alert>
          </div>
          <div>
            <Alert hideIcon variant="faded" color="danger">
              <p>Put Value</p>
              <p className="text-4xl">${putValue}</p>
            </Alert>
          </div>
        </div>
        {isNaN(callValue) ? <Alert color="danger" className="my-8 w-fit">Getting NaN? Click away from the input box.</Alert> : ""}
        <h1 className="my-8">Heatmap</h1>
        <Slider
          className="max-w-md"
          defaultValue={[stockPrice - 100 ? stockPrice > 100 : 0, stockPrice + 100]}
          formatOptions={{style: "currency", currency: "USD"}}
          label="Stock Price"
          minValue={stockPrice - 500 ? stockPrice > 500 : 0}
          maxValue={stockPrice + 500}
          step={10}
        />

        <Slider
          className="max-w-md"
          defaultValue={[0.01, 0.1]}
          label="Volatility"
          minValue={0.01}
          maxValue={1.00}
          step={0.01}
        />

        <Heatmap />
      </div>
    </>
  );
}