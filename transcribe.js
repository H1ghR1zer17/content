module.exports = async (req, res) => {
    const { MY_SECRET } = process.env; // Vercel allows you to set environment variables in their dashboard
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${MY_SECRET}`,
            // Add any other headers your API call requires
        },
        body: JSON.stringify(req.body), // Forward the incoming request body to the API
    });
    const data = await response.json();
    res.status(200).json(data); // Send the API response back to the frontend
};
