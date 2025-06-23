import { Navbar } from "../components/navbar";
import { Alert } from "@heroui/react";

export default function Tutorial() {
    return (
        <>
            <Navbar />
            <div className="mx-32">
                <Alert color="primary" className="my-8 w-fit">Coming from Hack Club? Welcome! I hope you vote for my project, and if you didn't know about the Black-Scholes model, I hope you learned something new!</Alert>
                <h1>What are Options?</h1>
                <div className="*:mb-2">
                    <p>Imagine you want to buy an apple from Farmer John. John says he will give you an apple for $5. If you pay him $5, he gives you the apple, and it's a successful transaction.
                    However, you don't have a fridge to store the apples. If you buy the apple now, you'll have to eat it immediately or else it will go bad. So you make a deal with John. You'll pay John $1 now, and in a year, John will sell you the apple for $5, and here's the important part, regardless of the price of the apple.
                    </p>
                    <p>Now one year has passed, and you and John meet again. John tells you that his apples are $10 now. You remind him, however, that you had paid him $1 for the right to buy the apple for $5. John hands you the apple for $5 (plus the $1 you already paid a year back). And you just made a profit of (10 - (5 + 1)) = $4. 🔥</p>
                    <p>There is also a very real chance that John sells his apples for $2 instead of $10. Now if you went to buy it, you would lose (5 + 1) - 2 = $4. Instead, you don't buy the apple from him at all. You just lose $1 that you initially paid.</p>
                    <p>You spent $1 buying something called an option, and in fact, it's known as a call option.</p>
                    <p>"But wait", you might ask, "I still don't understand the terms in your calculator." Well, the $5 price of the apple initially is the strike price. The $10 price of the apple today is the stock price. The time to expiration is 1 year. The next two variables are a bit harder.</p>
                    <p>Imagine you put $5 in the bank instead of giving it to John. The bank gives you 5% interest rate. You would have $5.25 after a year. You made a "profit" of $0.25. But, if you bought the $10 apple for $5, you know you can earn a profit of $4 ($5 if you exclude the $1 you initially gave). So, it's a better idea to buy the apple. The risk-free interest rate (5% here) helps you compare these choices. You could earn $0.25 with NO risk, or $5 with SOME risk.</p>
                    <p>If John's apple prices fluctuate a lot, you have the potential to earn a lot more from the option. This makes the option itself more valuable. The higher the volatility, the higher your call price.</p>
                    <p>What about the $1 you paid initially? That's known as an option premium. John knows he can potentially lose out on making a better deal later, so he charges you $1 as compensation for that risk. He can't just give the options away - apples don't grow on trees (wait a minute 🗿).</p>
                    <p>Last thing before we move on to the model itself. Imagine you're an apple seller yourself, and John wants to buy some of your apples (he knows they taste better). So, you give HIM a deal now. "Here's $1. A year from now, I want the option to sell you an apple for $5, even if they're only worth $2 then." This is known as a put option. Short quiz: What is the $1 in this case?</p>
                </div>
                <h1 className="my-4">What is the Black-Scholes Model?</h1>
                <p>Work in progress - for now imagine a function that takes 5 inputs and gives 2 outputs.</p>
            </div>
        </>
    );
}