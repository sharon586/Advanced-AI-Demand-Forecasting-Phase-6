def validate_columns(columns):
    required_columns = ["date", "product", "sales"]

    for col in required_columns:
        if col not in columns:
            return False

    return True