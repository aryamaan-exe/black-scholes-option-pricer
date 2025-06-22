import { Navbar } from "../components/navbar";
import { Alert } from "@heroui/react";
import { NumberInput } from "@heroui/react";

export default function Index() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center flex-col items-center ml-32">
        <Alert color="primary" className="my-8 w-fit">Coming from Hack Club? Check out the tutorial section from the navbar above to learn more about this project.</Alert>
        <h1>Input Variables</h1>
        <div className="flex *:p-4">
          <NumberInput label="Current Asset Price"></NumberInput>
          <NumberInput label="Strike Price"></NumberInput>
          <NumberInput label="Time to Expiration"></NumberInput>
          <NumberInput label="Risk-free Interest Rate"></NumberInput>
          <NumberInput label="Volatility"></NumberInput>
        </div>
        <div className="flex *:p-2">
          <div>
            <Alert hideIcon variant="faded" color="success">
              <p>Call Value</p>
              <p className="text-4xl">$100</p>
            </Alert>
          </div>
          <div>
            <Alert hideIcon variant="faded" color="danger">
              <p>Put Value</p>
              <p className="text-4xl">$100</p>
            </Alert>
          </div>
        </div>
      </div>
    </>
  );
}