# Stock Price Predictor

A Flask-based web application that predicts future stock prices using linear regression machine learning models. The application allows users to select from various stocks and predict their prices for future dates.

## Features

- **Multiple Stock Support**: Predict prices for 7 different stocks (MSFT, AMZN, DSNY, META, NIKE, RELI, TSLA)
- **Machine Learning**: Uses scikit-learn's Linear Regression model for predictions
- **Web Interface**: Clean, user-friendly web interface built with Flask
- **Date Flexibility**: Supports multiple date formats for robust data processing
- **Real-time Predictions**: Get instant predictions for any future date

## Supported Stocks

- **MSFT** - Microsoft Corporation
- **AMZN** - Amazon.com Inc.
- **DSNY** - The Walt Disney Company
- **META** - Meta Platforms Inc.
- **NIKE** - Nike Inc.
- **RELI** - Reliance Industries
- **TSLA** - Tesla Inc.

## Project Structure

```
stock-price-predictor/
├── app.py              # Main Flask application
├── model.py            # Machine learning model and data processing
├── preprocess.py       # Data preprocessing script
├── templates/
│   └── index.html      # Web interface template
├── *.csv              # Original stock data files
├── *_updated.csv      # Preprocessed stock data files
└── README.md          # Project documentation
```

## Installation

1. **Clone the repository** (or download the files)

2. **Install required dependencies**:
   ```bash
   pip install flask pandas scikit-learn numpy
   ```

3. **Ensure data files are present**:
   - The project includes CSV files for each supported stock
   - Preprocessed files with `_updated.csv` suffix should be available

## Usage

### Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. **Open your web browser** and navigate to:
   ```
   http://localhost:5000
   ```

3. **Make predictions**:
   - Select a stock from the dropdown menu
   - Enter a future date in MM-DD-YYYY format
   - Click "Predict" to get the predicted stock price

### Data Preprocessing

If you need to preprocess new data files:

```bash
python preprocess.py
```

This script will:
- Convert date formats to a standardized MM-DD-YYYY format
- Create updated CSV files with the `_updated.csv` suffix

## Technical Details

### Machine Learning Model

- **Algorithm**: Linear Regression
- **Features**: Date (converted to ordinal format)
- **Target**: Stock closing price
- **Training**: Uses entire historical dataset for each prediction

### Data Processing

- **Date Handling**: Supports multiple date formats (MM/DD/YYYY, DD/MM/YYYY, MM-DD-YYYY)
- **Price Cleaning**: Removes dollar signs and commas from price data
- **Error Handling**: Robust error handling for invalid dates and missing data

### Web Framework

- **Backend**: Flask (Python)
- **Frontend**: HTML with Jinja2 templating
- **Form Handling**: POST requests for prediction submissions

## API Endpoints

- **GET /**: Main page with prediction form
- **POST /predict**: Processes prediction requests and returns results

## Error Handling

The application includes comprehensive error handling for:
- Invalid stock symbols
- Malformed dates
- Missing or corrupted data files
- Insufficient training data
- Model training failures

## File Formats

### Input CSV Format
```csv
Date,Close/Last,Volume,Open,High,Low
01/03/2023,$150.25,1000000,$149.50,$151.00,$149.00
```

### Supported Date Formats
- MM/DD/YYYY (e.g., 01/15/2024)
- DD/MM/YYYY (e.g., 15/01/2024)
- MM-DD-YYYY (e.g., 01-15-2024)

## Limitations

- **Linear Model**: Uses simple linear regression, which may not capture complex market patterns
- **Single Feature**: Only uses date as a feature; doesn't consider other market factors
- **Historical Data**: Predictions are based solely on historical price trends
- **No Real-time Data**: Uses static CSV files rather than live market data

## Future Enhancements

- Integration with real-time stock APIs
- More sophisticated ML models (LSTM, ARIMA)
- Additional features (volume, market indicators)
- Interactive charts and visualizations
- Portfolio prediction capabilities
- Technical analysis indicators

## Dependencies

- **Flask**: Web framework
- **pandas**: Data manipulation and analysis
- **scikit-learn**: Machine learning library
- **numpy**: Numerical computing
- **datetime**: Date and time handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Disclaimer

This application is for educational and demonstration purposes only. Stock price predictions should not be used as the sole basis for investment decisions. Always consult with financial professionals and conduct thorough research before making investment choices.

## Support

For questions, issues, or contributions, please create an issue in the project repository or contact the development team.