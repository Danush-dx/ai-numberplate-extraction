import axios from 'axios';
import { getApiKey } from '../utils/apiConfig';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

/**
 * Extracts license plate text from an image using Gemini API
 * @param {string} imageBase64 - Base64 encoded image data
 * @returns {Promise<string>} - Extracted license plate text
 */
export const extractLicensePlate = async (imageBase64) => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.error('API key not found');
      throw new Error('API key is not configured. Please check your .env file.');
    }
    
    console.log('Preparing Gemini API request');
    
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: "Extract only the license plate number from this image. Return only the plate number text as a single, continuous string without any spaces or hyphens, and without any additional information or explanation.",
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
      }
    };
    
    console.log('Sending request to Gemini API');
    
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`API attempt ${attempts}/${maxAttempts}`);
        
        const response = await axios.post(
          `${GEMINI_API_URL}?key=${apiKey}`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 20000 // Increased timeout to 20 seconds
          }
        );
        
        console.log('API response received', response.status);
        
        if (response.data && 
            response.data.candidates && 
            response.data.candidates[0] && 
            response.data.candidates[0].content && 
            response.data.candidates[0].content.parts && 
            response.data.candidates[0].content.parts[0] &&
            response.data.candidates[0].content.parts[0].text) {
          
          const extractedText = response.data.candidates[0].content.parts[0].text;
          
          // UPDATED CLEANING LOGIC: Remove all spaces and hyphens
          const cleanedText = extractedText.trim().replace(/[\s-]/g, ''); 
          console.log('Extracted text (cleaned):', cleanedText);
          
          return cleanedText || 'No plate detected';
        }
        
        // Handle cases where the expected response structure is not met
        let errorMessage = 'Failed to extract license plate from response.';
        if (response.data && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].finishReason) {
            errorMessage += ` Finish Reason: ${response.data.candidates[0].finishReason}`;
            if (response.data.candidates[0].safetyRatings) {
                errorMessage += ` Safety Ratings: ${JSON.stringify(response.data.candidates[0].safetyRatings)}`;
            }
        }
        console.error('API response parsing error:', errorMessage, response.data);
        throw new Error(errorMessage);

      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error.message);
        
        if (attempts >= maxAttempts) {
          // If it's an Axios error, provide more details
          if (error.isAxiosError) {
            console.error('Axios error details:', {
              message: error.message,
              url: error.config?.url,
              method: error.config?.method,
              data: error.config?.data,
              response_status: error.response?.status,
              response_data: error.response?.data
            });
          }
          throw error; // Rethrow the last error
        }
        
        // Wait before retrying (e.g., exponential backoff could be better)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    // This line should ideally not be reached if the loop logic is correct
    throw new Error('Failed to extract license plate after multiple attempts');
  } catch (error) {
    // Log the comprehensive error object for better debugging
    console.error('Error in extractLicensePlate function:', error);
    
    let displayError = 'An unexpected error occurred while extracting the license plate.';
    if (error.message.includes('API key is not configured')) {
        displayError = error.message;
    } else if (error.message.startsWith('API error:')) {
        displayError = error.message;
    } else if (error.message.startsWith('Network error:')) {
        displayError = error.message;
    } else if (error.isAxiosError && error.response) {
        displayError = `API request failed: ${error.response.status} - ${JSON.stringify(error.response.data)}. Check API key and model name.`;
    } else if (error.isAxiosError) {
        displayError = 'API request failed. No response from server or network issue.';
    }

    // Re-throw a more user-friendly or generic error if needed, or handle it appropriately
    throw new Error(displayError);
  }
}; 