import pandas as pd
from sklearn.linear_model import LinearRegression
from datetime import datetime
import numpy as np

# Function to load and preprocess the dataset with multiple date format handling
def load_data(filename):
    df = pd.read_csv(filename)
    
    # Attempt to parse dates in multiple formats
    df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%Y', errors='coerce')
    df['Date'] = df['Date'].fillna(pd.to_datetime(df['Date'], format='%m-%d-%Y', errors='coerce'))
    
    # Drop rows where Date couldn't be parsed
    df = df.dropna(subset=['Date'])
    
    if df.empty:
        raise ValueError("Dataset is empty after processing or all dates are invalid.")
    
    # Convert dates to ordinals for model compatibility
    df['Date'] = df['Date'].map(datetime.toordinal)
    
    # Convert Close/Last column to float after removing any dollar signs
    df['Close/Last'] = df['Close/Last'].replace(r'[\$,]', '', regex=True).astype(float)
    
    return df[['Date', 'Close/Last']]

# Function to train on the entire dataset and predict future stock prices
def train_and_predict(filename, future_date):
    df = load_data(filename)
    
    # Ensure there's enough data for training
    if df.shape[0] < 1:
        raise ValueError("Not enough data to train the model.")
    
    X = df[['Date']]
    y = df['Close/Last']
    
    model = LinearRegression()
    model.fit(X, y)  # Train on the entire dataset
    
    # Predict the stock price for a future date
    future_date_ordinal = datetime.strptime(future_date, '%m/%d/%Y').toordinal()
    predicted_price = model.predict(np.array([[future_date_ordinal]]))
    return predicted_price[0]
