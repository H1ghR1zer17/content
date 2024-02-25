document.getElementById('submit-button').addEventListener('click', function() {
            const fileInput = document.getElementById('file-upload');
            const file = fileInput.files[0];
            const apiKey = '{MY_SECRET}';
            if (!file) {
                alert('Please select a file.');
                return;
            }
              // Display loading message
            document.getElementById('display-window').textContent = 'Generating audio-to-text content...';
            const formData = new FormData();
            formData.append('file', file);
            formData.append('model', 'whisper-1');
            formData.append('type', 'text');
            fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ${MY_SECRET}',
                },
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Now send the text to GPT-4-turbo-preview for post-processing
                const textContent = data.text;
                return fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ${secrets.MY_SECRET}',
                    },
                    body: JSON.stringify({
                        model: "gpt-4-turbo-preview",
                        messages: [
                            {
                                role: "system",
                                content: "You are a speech-to-text post-processing assistant. Your task is to organize the output to class notes format. Since the display is in HTML,  replace  '**' and '###'' with appropriate HTML-formatting equivalent."
                            },
                            {
                                role: "user",
                                content: textContent
                            }
                        ]
                    }),
                });
            })
            .then(response => response.json())
            .then(data => {
                // Assuming the GPT-4-turbo-preview response is structured with the result in the last message
                const organizedNotes = data.choices[0].message.content; // Adjust according to actual response structure
                document.getElementById('display-window').innerHTML = organizedNotes;
            })
            .catch(error => {
                console.error('There was an error:', error);
            });
        });
        document.getElementById('clear-button').addEventListener('click', function() {
            document.getElementById('display-window').textContent = 'Cleared';
        });
