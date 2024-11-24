import sys
import json
import joblib
import pandas as pd
import numpy as np

# Load the trained model
try:
    model = joblib.load("app/backend/property_value_estimator_xgboost.joblib")
    print("Model loaded successfully.", file=sys.stderr)
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {e}"}), file=sys.stderr)
    sys.exit(1)

# Average price per square foot by zone
zone_avg_price_per_sqft = {
    "Calgary - NE": 250.0,
    "Calgary - NW": 300.0,
    "Calgary - SE": 275.0,
    "Calgary - SW": 320.0,
    "Unknown": 285.0,
}

# Map FSA to zone
fsa_zones = {
    "Calgary - NE": ["T1Y", "T2A", "T2B", "T2C"],
    "Calgary - NW": ["T3A", "T3B", "T3C", "T3G"],
    "Calgary - SE": ["T2G", "T2H", "T2J", "T2X"],
    "Calgary - SW": ["T2V", "T3H", "T3M", "T3Z"],
}

# Parse input data
try:
    if len(sys.argv) < 2:
        raise ValueError("No input data provided.")

    raw_input = sys.argv[1]
    print(f"Raw input: {raw_input}", file=sys.stderr)  # Debug log for raw input

    input_data = json.loads(raw_input)

    # Validate input fields
    required_fields = ["squareFootage", "bedrooms", "bathrooms", "propertyType", "postalCode"]
    for field in required_fields:
        if field not in input_data:
            raise ValueError(f"Missing required field: {field}")

    # Parse and process inputs
    square_footage = float(input_data["squareFootage"])
    bedrooms = int(input_data["bedrooms"])
    bathrooms = int(input_data["bathrooms"])
    property_type = input_data["propertyType"].strip()
    postal_code = input_data["postalCode"].strip().upper()
    fsa = postal_code[:3]

    # Determine the zone
    zone = "Unknown"
    for z, fsa_list in fsa_zones.items():
        if fsa in fsa_list:
            zone = z
            break

    avg_price_per_sqft = zone_avg_price_per_sqft.get(zone, zone_avg_price_per_sqft["Unknown"])

    # Prepare the input data
    user_data = {
        "Floor Size (sq ft)": square_footage,
        "Number of Bedrooms": bedrooms,
        "Number of Bathrooms": bathrooms,
        "Type": property_type,
        "Zone": zone,
        "Avg Price per Sq Ft": avg_price_per_sqft,
    }
    print(f"Processed input data: {user_data}", file=sys.stderr)  # Debug log for processed input

    user_df = pd.DataFrame([user_data])
    user_df = pd.get_dummies(user_df, columns=["Type", "Zone"], drop_first=True)
    user_df = user_df.reindex(columns=model.feature_names_in_, fill_value=0)
except Exception as e:
    print(json.dumps({"error": f"Error processing input: {e}"}), file=sys.stderr)
    sys.exit(1)

# Make prediction
# Make prediction
try:
    prediction = float(model.predict(user_df)[0])  # Cast to standard Python float
    print(json.dumps({"estimatedValue": prediction}))  # Serialize the float to JSON
except Exception as e:
    print(json.dumps({"error": f"Error making prediction: {e}"}), file=sys.stderr)
    sys.exit(1)
