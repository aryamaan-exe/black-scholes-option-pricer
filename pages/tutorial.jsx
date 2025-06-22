import { Navbar } from "../components/navbar";
import { Alert } from "@heroui/react";

export default function Tutorial() {
    return (
        <>
            <Navbar />
            <div className="ml-32">
                <Alert color="primary" className="my-8 w-fit">Coming from Hack Club? Welcome! I hope you vote for my project, and if you didn't know about the Black-Scholes model, I hope you learned something new!</Alert>
                <h1>What is the Black-Scholes Model?</h1>
                <p>The</p>
            </div>
        </>
    );
}