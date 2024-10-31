import pandas as pd
from datetime import datetime

def parse_date(date_str):
    for fmt in ('%m/%d/%Y', '%d/%m/%Y', '%m-%d-%Y'):
        try:
            return datetime.strptime(date_str, fmt).strftime('%m-%d-%Y')
        except ValueError:
            continue
    return date_str 
file_names = ['AMZN.csv', 'DSNY.csv', 'META.csv', 'MSFT.csv' ,'NIKE.csv', 'NVDA.csv', 'RELI.csv', 'TSLA.csv']

for file in file_names:
    # Load the dataset
    df = pd.read_csv(file)

    df['Date'] = df['Date'].apply(parse_date)

    updated_file = file.replace('.csv', '_updated.csv')
    df.to_csv(updated_file, index=False)

    print(f"Date format conversion to 'mm-dd-yyyy' is complete for {file}. The updated file is saved as {updated_file}.")
