# AI Tutor Integration Testing Guide

This guide will help you test both Ollama (local LLM) and Claude API integration in Code Tutor.

## Overview

Code Tutor supports dual LLM functionality:
- **Ollama** - Free, runs locally on your machine
- **Claude API** - Cloud-based, requires API key from Anthropic

## Architecture

The AI integration is located in:
- `src/lib/ai/index.ts` - Main AI service manager
- `src/lib/ai/ollama.ts` - Ollama provider implementation
- `src/lib/ai/claude.ts` - Claude API provider implementation
- `src/lib/ai/prompts.ts` - Socratic tutoring prompts
- `src/types/ai.ts` - TypeScript interfaces

## Testing Ollama (Local LLM)

### Prerequisites

1. **Install Ollama**
   - Visit: https://ollama.ai
   - Download and install for your platform (Windows/Mac/Linux)

2. **Pull a Model**
   ```bash
   # Recommended models for coding assistance:
   ollama pull llama3.2:latest          # General purpose, fast
   ollama pull codellama:latest         # Code-focused
   ollama pull llama2:latest            # Alternative option
   ```

3. **Verify Ollama is Running**
   ```bash
   # Check if Ollama is running (should return list of models)
   ollama list

   # Or test the API endpoint
   curl http://localhost:11434/api/tags
   ```

### Testing Steps

1. **Start the Code Tutor App**
   ```bash
   npm run dev
   ```

2. **Configure Ollama in Settings**
   - Open Settings (gear icon in top right)
   - Under "AI Tutor" section:
     - Select "Ollama (Local)" from the AI Provider dropdown
   - Click "Save Changes"

   You should see a blue info box: "Make sure Ollama is running locally with a model installed"

3. **Test the AI Tutor**
   - Load any lesson from the dashboard
   - Click the chat bubble icon (bottom right) to open AI Tutor
   - The chat should show: "Using: Ollama (Local)"
   - Type a question like: "What does the print() function do?"
   - Click Send (or press Enter)

4. **Verify Response**
   - You should see "Thinking..." appear briefly
   - Then the AI should respond in a Socratic teaching style
   - Response should NOT give direct answers, but ask guiding questions

### Troubleshooting Ollama

**Problem**: "Ollama is not available" error

**Solutions**:
- Ensure Ollama is running: `ollama serve` (usually runs as background service)
- Check the model is installed: `ollama list`
- Verify the API is accessible: `curl http://localhost:11434/api/tags`
- Check browser console for CORS or network errors

**Problem**: Slow responses

**Solutions**:
- Try a smaller model (e.g., `llama3.2` instead of `codellama`)
- Check your system resources (Ollama uses CPU/RAM)
- Consider using Claude API for faster responses

**Problem**: Poor quality responses

**Solutions**:
- Try different models optimized for code (codellama)
- The prompts in `src/lib/ai/prompts.ts` can be adjusted
- Ollama responses may be less sophisticated than Claude

## Testing Claude API

### Prerequisites

1. **Get a Claude API Key**
   - Visit: https://console.anthropic.com
   - Sign up or log in
   - Navigate to "API Keys"
   - Create a new API key (starts with `sk-ant-`)
   - Copy the key immediately (it won't be shown again)

2. **Add Credits (if needed)**
   - Claude API requires credits/payment
   - Check pricing: https://www.anthropic.com/pricing
   - Current model used: `claude-3-5-sonnet-20241022`

### Testing Steps

1. **Start the Code Tutor App**
   ```bash
   npm run dev
   ```

2. **Configure Claude API in Settings**
   - Open Settings (gear icon in top right)
   - Under "AI Tutor" section:
     - Select "Claude API" from the AI Provider dropdown
     - Paste your API key in the "Claude API Key" field
   - Click "Save Changes"

   Note: Your API key is stored locally in browser localStorage and never sent to our servers

3. **Test the AI Tutor**
   - Load any lesson from the dashboard
   - Click the chat bubble icon (bottom right) to open AI Tutor
   - The chat should show: "Using: Claude API"
   - Type a question like: "I'm stuck on this lesson. Can you help?"
   - Click Send (or press Enter)

4. **Verify Response**
   - You should see "Thinking..." appear briefly
   - Claude should respond quickly (usually 1-3 seconds)
   - Response should follow Socratic teaching principles:
     - Ask guiding questions
     - Point to relevant lesson content
     - Encourage thinking rather than giving answers

### Troubleshooting Claude API

**Problem**: "Claude API request failed" error

**Solutions**:
- Verify your API key is correct (starts with `sk-ant-`)
- Check your Anthropic account has credits
- Review browser Network tab for error details
- Ensure you're not hitting rate limits

**Problem**: "No AI provider selected" error

**Solutions**:
- Make sure you saved the API key in Settings
- Check browser localStorage: `localStorage.getItem('code-tutor-preferences')`
- Try setting the provider again in Settings

**Problem**: Responses are too direct (not Socratic)

**Solutions**:
- The prompts can be adjusted in `src/lib/ai/prompts.ts`
- Check the `SYSTEM_PROMPT` is being sent correctly
- Review the Claude API request in Network tab

## Testing the AI Context Awareness

The AI tutor should be aware of:
- Current lesson title and description
- User's code in the editor
- Console output (stdout/stderr)
- Previous chat history

### Test Context Awareness

1. **Write some code with an error**
   ```python
   print("Hello World"
   ```

2. **Run the code** (it will error: missing closing parenthesis)

3. **Ask the AI**: "Why did my code fail?"

4. **Expected Behavior**:
   - AI should reference your specific code
   - AI should see the error in the console
   - AI should ask guiding questions about Python syntax
   - AI should NOT directly say "add a )"

## Testing Streaming Responses

Both providers support streaming for real-time responses.

### Test Streaming

1. Configure either provider
2. Open AI chat
3. Ask a longer question: "Can you explain all the different data types in Python?"
4. Watch for text appearing incrementally (word by word)

Note: If streaming fails, the system falls back to non-streaming mode.

## API Usage Monitoring

### Ollama
- Free and unlimited (runs locally)
- Monitor system resources (CPU/RAM)
- Check Ollama logs: `ollama logs`

### Claude API
- Monitor usage at: https://console.anthropic.com
- Check API key quotas and rate limits
- Be aware of costs (pricing per 1M tokens)

## Testing Checklist

- [ ] Ollama is installed and running
- [ ] Can select Ollama in Settings
- [ ] Ollama responds to questions
- [ ] Ollama responses follow Socratic method
- [ ] Claude API key is obtained
- [ ] Can select Claude API in Settings
- [ ] Claude responds to questions
- [ ] Claude responses follow Socratic method
- [ ] AI sees user's code in context
- [ ] AI sees console output in context
- [ ] AI maintains chat history
- [ ] Can switch between providers
- [ ] Can disable AI (set to "None")
- [ ] Settings persist after page reload

## Developer Notes

### Adding New Providers

To add a new AI provider:

1. Create a new provider class in `src/lib/ai/your-provider.ts`
2. Implement the `AIProvider` interface from `src/types/ai.ts`
3. Add provider to `AIService` in `src/lib/ai/index.ts`
4. Update `AIProviderType` in `src/types/ai.ts`
5. Add UI controls in `src/components/SettingsModal.tsx`

### Customizing Prompts

Edit `src/lib/ai/prompts.ts`:
- `SYSTEM_PROMPT` - Overall teaching philosophy
- `buildChatPrompt()` - How context is formatted
- `buildHintPrompt()` - Progressive hint system

### Debugging

1. **Check AI Service State**
   ```javascript
   // In browser console
   import { aiService } from './lib/ai'
   console.log(aiService.getCurrentProvider())
   ```

2. **Check Provider Availability**
   ```javascript
   // Test Ollama
   fetch('http://localhost:11434/api/tags')
     .then(r => r.json())
     .then(console.log)

   // Test Claude (replace YOUR_KEY)
   fetch('https://api.anthropic.com/v1/messages', {
     method: 'POST',
     headers: {
       'x-api-key': 'YOUR_KEY',
       'anthropic-version': '2023-06-01',
       'content-type': 'application/json'
     },
     body: JSON.stringify({
       model: 'claude-3-5-sonnet-20241022',
       max_tokens: 100,
       messages: [{role: 'user', content: 'Hi'}]
     })
   })
   ```

3. **Monitor Network Requests**
   - Open DevTools > Network tab
   - Filter by "generate" (Ollama) or "messages" (Claude)
   - Inspect request/response payloads

## Security Notes

- **Claude API Keys**: Stored in browser localStorage only
- **Never commit**: Keep API keys out of git (already in .gitignore)
- **Ollama**: Runs locally, no data sent to external servers
- **User Code**: Sent to AI providers for context (be aware of privacy)

## Next Steps

After successful testing:
- [ ] Test with real students/users
- [ ] Monitor AI response quality
- [ ] Adjust prompts based on feedback
- [ ] Consider adding more providers (OpenAI, etc.)
- [ ] Implement cost tracking for Claude API
- [ ] Add model selection for Ollama

---

**Need Help?**
- Check browser console for errors
- Review `src/lib/ai/` implementation
- Test providers with curl/Postman first
- Check PROJECT_PLAN.md for AI tutor requirements
