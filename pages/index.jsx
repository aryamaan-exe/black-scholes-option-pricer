import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Button, Image, Alert, Slider, NumberInput, Skeleton } from "@heroui/react";
import { useEffect, useState } from "react";
import { jStat } from "jstat";

function cumulativeDistribution(x) {
  return jStat.normal.cdf(x, 0, 1);
}

async function generateHeatmap(minStockPrice, maxStockPrice, minVolatility, maxVolatility, strikePrice, timeToExpiration, interestRate) {
  const apiURL = process.env.NEXT_PUBLIC_API;
  const response = await fetch(`${apiURL}/heatmap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ minStockPrice, maxStockPrice, minVolatility, maxVolatility, strikePrice, interestRate, timeToExpiration})
  });

  const json = await response.json()
  console.log(json.url);
  
  return json.url;
}

export function blackScholes(stockPrice, strikePrice, timeToExpiration, interestRate, volatility) {
  function calculateBSTerm(d1, d2, call=1) {
    let x = (stockPrice * cumulativeDistribution(call * d1));
    x -= (strikePrice * (Math.pow(Math.E, -interestRate * timeToExpiration)) * cumulativeDistribution(call * d2));
    return Math.abs(x);
  }

  let callValue;
  let putValue;
  let d1 = interestRate;

  d1 += Math.pow(volatility, 2) / 2;
  d1 *= timeToExpiration;
  d1 += Math.log1p(stockPrice / strikePrice - 1);
  let term = volatility * Math.sqrt(timeToExpiration);
  d1 /= term;
  let d2 = d1 - term;
  

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
  const [minStockPrice, setMinStockPrice] = useState(80);
  const [maxStockPrice, setMaxStockPrice] = useState(120);
  const [minVolatility, setMinVolatility] = useState(0.1);
  const [maxVolatility, setMaxVolatility] = useState(0.4);
  const [heatmapSource, setHeatmapSource] = useState(null);
  const [loading, setLoading] = useState(false);

  const heatmapClicked = async () => {
    setLoading(true);
    const url = await generateHeatmap(minStockPrice, maxStockPrice, minVolatility, maxVolatility, strikePrice, timeToExpiration, interestRate);
    setHeatmapSource(url);
    setLoading(false);
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <NumberInput className="" label="Stock Price" defaultValue={100} startContent={
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
        <div className="mt-2 flex *:p-2">
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
          defaultValue={[stockPrice > 20 ? stockPrice - 20 : 10, stockPrice + 20]}
          formatOptions={{style: "currency", currency: "USD"}}
          label="Stock Price"
          minValue={stockPrice > 500 ? stockPrice - 500 : 10}
          maxValue={stockPrice + 500}
          step={10}
          onChange={([min, max]) => {
            setMinStockPrice(min);
            setMaxStockPrice(max);
          }}
        />

        <Slider
          className="max-w-md"
          defaultValue={[0.1, 0.4]}
          label="Volatility"
          minValue={0.01}
          maxValue={1.00}
          step={0.01}
          onChange={([min, max]) => {
            setMinVolatility(min);
            setMaxVolatility(max);
          }}
        />

        <Skeleton isLoaded={!loading} className="rounded-lg my-4">
          <div className="flex flex-col justify-center items-center">   
            { heatmapSource &&
              (<Image src={heatmapSource} width={500} height={500}></Image>)
            }
          </div>
        </Skeleton>

        <Button isLoading={loading} color="primary" onPress={heatmapClicked}>Generate Heatmap</Button>
      </div>

      <Footer />
    </>
  );
}