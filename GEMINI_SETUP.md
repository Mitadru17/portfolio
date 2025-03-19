# Setting Up Google's Gemini AI in Your Portfolio

This portfolio now includes integration with Google's Gemini AI model, providing advanced natural language understanding for the voice and chat assistant.

## Getting Started with Gemini

### 1. Get Your API Key

1. Visit [Google AI Studio](https://ai.google.dev/) and sign in with your Google account
2. Navigate to the "Get API Key" section
3. Either create a new API key or use an existing one
4. Copy the API key

### 2. Add Your API Key to the Project

1. Open the `.env.local` file in the root directory
2. Add your API key to the `NEXT_PUBLIC_GEMINI_API_KEY` variable:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
3. Save the file
4. Restart your development server if it's running

### 3. Testing the Integration

1. Run your development server
2. Open the portfolio in your browser
3. Use the microphone button or chat interface
4. Check the debug panel (Ctrl+Alt+D) to see if Gemini is active

If Gemini couldn't initialize (due to an invalid or missing API key), the system will automatically fall back to the rule-based response system.

## Customizing Gemini Behavior

You can customize the Gemini AI behavior by modifying the following files:

- `app/components/VoiceNavigation.tsx` - Contains the Gemini initialization and integration logic
  - Look for the `generateAIResponse` function to modify prompt engineering
  - Adjust the safety settings in `initializeGeminiAI` function

## Troubleshooting

If you encounter issues with Gemini integration:

1. **API Key Issues**:

   - Make sure your API key is correctly added to the `.env.local` file
   - Check that the API key is active and has not reached request limits

2. **Fallback Mode**:

   - The system will automatically use fallback mode if Gemini isn't available
   - You can toggle between Gemini and fallback mode in the debug panel

3. **Response Format Issues**:
   - If responses don't contain expected actions, check the prompt in `generateAIResponse`
   - Adjust the temperature and other generation parameters for better JSON formatting

## Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs/gemini_api)
- [Gemini Models Overview](https://ai.google.dev/models/gemini)
- [Google Generative AI SDK for JavaScript](https://www.npmjs.com/package/@google/generative-ai)
