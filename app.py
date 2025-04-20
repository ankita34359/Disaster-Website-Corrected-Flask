from flask import Flask, request, jsonify
import joblib
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Load the saved model and vectorizer
model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Get the text from the request
    data = request.get_json()
    text = data['text']

    # Preprocess and vectorize the input text
    text_vectorized = vectorizer.transform([text])

    # Make prediction using the model
    prediction = model.predict(text_vectorized)

    # Return the prediction as a JSON response
    return jsonify({'prediction': int(prediction[0])})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
