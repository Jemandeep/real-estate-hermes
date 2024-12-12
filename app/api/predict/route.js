import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate input data
    if (!data.squareFootage || !data.bedrooms || !data.bathrooms || !data.propertyType || !data.postalCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the absolute path to the Python script and the model
    const scriptPath = path.join(process.cwd(), 'app', 'backend', 'predict.py');
    const modelPath = path.join(process.cwd(), 'app', 'backend', 'property_value_estimator_xgboost.joblib');

    // Check if the model file exists
    if (!fs.existsSync(modelPath)) {
      return NextResponse.json({ error: 'Model file not found at the specified path' }, { status: 500 });
    }

    console.log('Data received from frontend:', data);

    const pythonProcess = spawn('python', [scriptPath, modelPath, JSON.stringify(data)]);

    let predictionData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (chunk) => {
      predictionData += chunk;
    });

    pythonProcess.stderr.on('data', (chunk) => {
      errorData += chunk;
    });

    return new Promise((resolve) => {
      pythonProcess.on('close', (code) => {
        console.log('Raw input to Python script:', JSON.stringify(data));
        
        if (code !== 0) {
          // Non-zero exit means an error occurred.
          console.error('Error from Python script:', errorData);
          // Try to parse errorData as JSON
          try {
            const errorObj = JSON.parse(errorData);
            return resolve(
              NextResponse.json({
                error: errorObj.error || 'Error from Python script',
                details: errorObj.details,
                raw_input: errorObj.raw_input,
                model_path: modelPath
              }, { status: 500 })
            );
          } catch (parseError) {
            // If parsing fails, return raw errorData
            console.error('Error parsing error data:', parseError);
            return resolve(NextResponse.json({ error: 'Error in property value prediction', details: errorData }, { status: 500 }));
          }
        }

        // If code === 0, process succeeded
        // There might still be logs in stderr, but they are not fatal errors.
        try {
          const prediction = JSON.parse(predictionData);
          return resolve(NextResponse.json(prediction));
        } catch (err) {
          console.error('Failed to parse prediction data as JSON:', err);
          return resolve(NextResponse.json({ error: 'Invalid JSON output from Python' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
