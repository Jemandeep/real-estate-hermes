/*const express = require("express");
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Enable CORS
app.use(cors());

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Route for property estimation
app.post("/predict", (req, res) => {
  const scriptPath = path.resolve(__dirname, "app/backend/predict.py");

  // Prepare the input JSON as a string
  const input = JSON.stringify(req.body);

  console.log("Input to Python script:", input); // Debugging input

  // Spawn the Python process
  const pythonProcess = spawn("python", [scriptPath, input]);

  let stdout = "";
  let stderr = "";

  // Capture stdout and stderr
  pythonProcess.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  // Handle the close event
  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Python script error:", stderr);
      res.status(500).json({ error: "Failed to execute prediction", details: stderr });
      return;
    }

    try {
      console.log("Python script output:", stdout); // Debugging output
      const prediction = JSON.parse(stdout); // Parse the Python script's JSON response
      res.json(prediction); // Send prediction back to the client
    } catch (parseError) {
      console.error("Error parsing Python script output:", stdout);
      res.status(500).json({ error: "Invalid prediction result", details: stdout });
    }
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Server is running. Use POST /predict for property estimation.");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/
