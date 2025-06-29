import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Tooltip, Button, Image, Alert, Slider, NumberInput, Skeleton } from "@heroui/react";
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

export function HelpIcon({ content }) {
  return <Tooltip content={content} closeDelay={0}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="size-6 -ml-8 -mt-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </Tooltip>;
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
      <div className="flex justify-center flex-col items-center lg:ml-32">
        <Alert color="primary" className="my-8 w-fit">Coming from Hack Club? Check out the tutorial section from the navbar above to learn more about this project.</Alert>
        <h1>Input Variables</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex">
            <NumberInput className="mr-2" label="Stock Price" labelPlacement="outside" defaultValue={100} startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            } onChange={(value) => {
              setStockPrice(value);
            }}></NumberInput>
            
            <HelpIcon content={"Current price of the stock"} />
          </div>
          <div className="flex">
            <NumberInput label="Strike Price" labelPlacement="outside" defaultValue={100} startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            } onChange={(value) => {
              setStrikePrice(value);
            }}></NumberInput>

            <HelpIcon content={"Price you want to be able to buy the stock at"} />
          </div>
          <div className="flex">
            <NumberInput label="Time to Expiration" labelPlacement="outside" defaultValue={1} onChange={(value) => {
              setTimeToExpiration(value);
            }}></NumberInput>

            <HelpIcon content={"How long before the option expires (in years)"} />
          </div>
          <div className="flex">
            <NumberInput label="Risk-free Interest Rate" labelPlacement="outside" defaultValue={0.05} onChange={(value) => {
              setInterestRate(value);
            }}></NumberInput>

            <HelpIcon content={"Interest rate (in decimals) with no risk"} />
          </div>
          <div className="flex">
            <NumberInput label="Volatility" labelPlacement="outside" defaultValue={0.2} onChange={(value) => {
              setVolatility(value);
            }}></NumberInput>

            <HelpIcon content={"Estimate of how much the stock moves (in decimals)"} />
          </div>
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
        
        {isNaN(callValue) && <Alert color="danger" className="my-8 w-fit">Getting NaN? Click away from the input box.</Alert>}
        
        <h1 className="my-8">Heatmap</h1>

        {!isNaN(stockPrice) && (<Slider
          key={stockPrice}
          className="lg:max-w-md max-w-sm"
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
        />)}

        <Slider
          className="lg:max-w-md max-w-sm"
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