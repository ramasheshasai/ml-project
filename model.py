import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from datetime import datetime
import numpy as np

# Function to load and preprocess the dataset
def load_data(filename):
    df = pd.read_csv(filename)
    df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%Y')  # Change format to match your CSV
    df = df[['Date', 'Close/Last']]  # Select only necessary columns
    df['Date'] = df['Date'].map(datetime.toordinal)  # Convert dates to ordinals
    return df

# Function to train the model and predict future stock prices
def train_and_predict(filename, future_date):
    df = load_data(filename)
    X = df[['Date']]
    y = df['Close/Last']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Predict the stock price for a future date
    future_date_ordinal = datetime.strptime(future_date, '%m/%d/%Y').toordinal()  # Change to match user input
    predicted_price = model.predict([[future_date_ordinal]])
    return predicted_price[0]
