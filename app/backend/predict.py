import sys
import os
import json
import joblib
import pandas as pd

# Get the absolute path of the directory where predict.py is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the model path relative to the script's directory
# This assumes that the model file is in the same directory as predict.py
model_path = os.path.join(script_dir, "property_value_estimator_xgboost.joblib")

if not os.path.isfile(model_path):
    error_msg = f"Model file not found at: {model_path}"
    print(json.dumps({"error": error_msg}), file=sys.stderr)
    sys.exit(1)

# Check if JSON data is provided as an environment variable or command-line argument
if "INPUT_DATA" in os.environ:
    raw_input = os.environ["INPUT_DATA"]
    print(f"Using environment variable for input data", file=sys.stderr)
elif len(sys.argv) == 2:
    raw_input = sys.argv[1]
    print(f"Using command-line argument for input data", file=sys.stderr)
elif len(sys.argv) == 3:
    # In the API case, we overwrite the default model_path with the one from argv
    model_path = sys.argv[1]
    raw_input = sys.argv[2]
    print(f"Using command-line arguments for model path and input data", file=sys.stderr)
else:
    error_msg = "Incorrect number of arguments provided. Expected either 1 or 2 arguments."
    print(json.dumps({"error": error_msg}), file=sys.stderr)
    sys.exit(1)

# Load the trained model
try:
    model = joblib.load(model_path)
    print(f"Model loaded successfully from: {model_path}", file=sys.stderr)
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {str(e)}", "model_path": model_path}), file=sys.stderr)
    sys.exit(1)

# Define average price per square foot by zone
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

print(f"Raw input: {raw_input}", file=sys.stderr)

# Parse and validate the input data
try:
    input_data = json.loads(raw_input)
except json.JSONDecodeError as e:
    print(json.dumps({"error": f"Error decoding JSON: {e}", "raw_input": raw_input}), file=sys.stderr)
    sys.exit(1)

# Validate the presence of required fields
required_fields = ["squareFootage", "bedrooms", "bathrooms", "propertyType", "postalCode"]
missing_fields = [field for field in required_fields if field not in input_data]
if missing_fields:
    print(json.dumps({"error": f"Missing required fields: {', '.join(missing_fields)}"}), file=sys.stderr)
    sys.exit(1)

# Process the input data
try:
    square_footage = float(input_data["squareFootage"])
    bedrooms = int(input_data["bedrooms"])
    bathrooms = int(input_data["bathrooms"])
    property_type = input_data["propertyType"].strip().lower()
    postal_code = input_data["postalCode"].strip().upper()
    fsa = postal_code[:3]

    # Determine the zone based on FSA
    zone = next((z for z, fsa_list in fsa_zones.items() if fsa in fsa_list), "Unknown")
    avg_price_per_sqft = zone_avg_price_per_sqft.get(zone, zone_avg_price_per_sqft["Unknown"])

    # Prepare user data for prediction
    user_data = {
        "Floor Size (sq ft)": square_footage,
        "Number of Bedrooms": bedrooms,
        "Number of Bathrooms": bathrooms,
        "Type": property_type,
        "Zone": zone,
        "Avg Price per Sq Ft": avg_price_per_sqft,
    }

    # Convert to DataFrame
    user_df = pd.DataFrame([user_data])

    # One-hot encode categorical features
    user_df = pd.get_dummies(user_df, columns=["Type", "Zone"], drop_first=True)

    # Reindex to ensure it matches the model's expected input features
    user_df = user_df.reindex(columns=model.feature_names_in_, fill_value=0)

    # Make a prediction
    prediction = model.predict(user_df)
    print(json.dumps({"estimatedValue": float(prediction[0])}))
except Exception as e:
    print(json.dumps({"error": f"Error processing input or making prediction: {e}", "raw_input": raw_input}), file=sys.stderr)
    sys.exit(1)
