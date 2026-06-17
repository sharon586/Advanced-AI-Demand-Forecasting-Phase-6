import pandas as pd


def preprocess_data(df: pd.DataFrame):
    df.drop_duplicates(inplace=True)

    df.fillna(0, inplace=True)

    return df