from flask import Flask, render_template, request
from model import train_and_predict

app = Flask(__name__, static_folder='static')

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    stock = request.form['stock']
    future_date = request.form['Date']
    filename = f"{stock.upper()}_updated.csv"  # Match filename format with '_updated' suffix

    try:
        predicted_price = train_and_predict(filename, future_date)
        return render_template('index.html', prediction=f"Predicted price for {stock} on {future_date} is ${predicted_price:.2f}")
    except Exception as e:
        return render_template('index.html', error=str(e))

if __name__ == '__main__':
    app.run(debug=True)
