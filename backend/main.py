from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from imagekitio import ImageKit
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import math
from scipy.stats import norm
import io
import os
import secrets
import base64

class Request(BaseModel):
    minStockPrice: float
    maxStockPrice: float
    minVolatility: float
    maxVolatility: float
    strikePrice: float
    interestRate: float
    timeToExpiration: float

def black_scholes(stock_price, strike_price, interest_rate, time_to_expiration, volatility):
    call_price = 0
    d1 = d2 = interest_rate
    term = volatility ** 2 / 2
    d1 += term
    d2 -= term
    d1 *= time_to_expiration
    d2 *= time_to_expiration
    term = math.log(stock_price / strike_price)
    d1 += term
    d2 += term
    term = volatility * math.sqrt(time_to_expiration)
    d1 /= term
    d2 /= term
    call_price = stock_price * norm.cdf(d1)
    call_price -= strike_price * math.exp(-interest_rate * time_to_expiration) * norm.cdf(d2)
    return round(call_price, 2)



def black_scholes_map(min_stock_price, max_stock_price, min_volatility, max_volatility, strike_price, interest_rate, time_to_expiration):
    z_values = []
    current_z = []
    x_values = np.round(np.linspace(min_stock_price, max_stock_price, 10), 2)
    y_values = np.round(np.linspace(min_volatility, max_volatility, 10), 2)

    for j in range(len(x_values)):
        for i in range(len(y_values)):
            current_z.append(black_scholes(x_values[i], strike_price, interest_rate, time_to_expiration, y_values[j]))

        z_values.append(current_z)
        current_z = []
    
    return z_values
    

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/heatmap")
async def heatmap(params: Request):
    plt.clf()
    plt.close('all')
    fig, ax = plt.subplots(figsize=(10, 8))
    fig.tight_layout()
    x_labels = np.round(np.linspace(params.minStockPrice, params.maxStockPrice, 10), 2)
    y_labels = np.round(np.linspace(params.minVolatility, params.maxVolatility, 10), 2)
    plot = sns.heatmap(black_scholes_map(params.minStockPrice, params.maxStockPrice,
                                         params.minVolatility, params.maxVolatility,
                                         params.strikePrice, params.interestRate,
                                         params.timeToExpiration),
                                         cmap=sns.color_palette("Spectral", as_cmap=True),
                                         xticklabels=x_labels, yticklabels=y_labels, ax=ax,
                                         annot=True, fmt=".2f")
    ax.set_xlabel("Stock Price")
    ax.set_ylabel("Volatility")
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", bbox_inches="tight", dpi=200)
    buffer.seek(0)
    image = base64.b64encode(buffer.read()).decode("utf-8")

    imagekit = ImageKit(
        public_key=os.getenv("IMGPUB"),
        private_key=os.getenv("IMGPRIV"),
        url_endpoint="https://ik.imagekit.io/nivarana/"
    )
    
    url = imagekit.upload(
        file=f"data:image/png;base64,{image}",
        file_name=f"{secrets.token_hex(16)}.png",
    ).url

    plt.close('all') # for some reason it was opening the plot?

    return {"url": url}