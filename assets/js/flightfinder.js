/* jshint esversion: 8 */
/* jshint browser: true */
/* jshint unused: true */

// =============================================================================
// SECTION 1: CONFIGURATION
// API keys and constants used throughout the application
// =============================================================================

// Travelpayouts API authentication key (public key, safe in frontend)


// =============================================================================
// SECTION 2: LOGIN SYSTEM
// Manages user authentication and personalization using browser localStorage
// localStorage persists data even after browser is closed
// =============================================================================

/**
 * Displays personalized greeting with user's name
 * Called after successful login or when page loads if user already logged in
 * @param {string} name - User's name from localStorage
 */
function showGreeting(name) {
  const greetingDiv = document.getElementById('user-greeting'); // Get greeting container element
  greetingDiv.textContent = `Welcome back, ${name}!`; // Set greeting text using template literal
  greetingDiv.style.display = 'block'; // Make greeting visible (change from display:none)
}

/**
 * Shows or hides the login form container
 * @param {boolean} show - True to display form, false to hide it
 */
function showLogin(show) {
  const loginContainer = document.getElementById('login-form-container');
  loginContainer.style.display = show ? 'block' : 'none'; // Ternary operator for conditional display
  // If show is true, set display to 'block' (visible)
  // If show is false, set display to 'none' (hidden)
}

/**
 * Checks if user is already logged in by looking for saved name in localStorage
 * Runs automatically when page loads to restore previous login state
 */
function checkLogin() {
  const name = localStorage.getItem('flight_username'); // Try to retrieve saved username
  // localStorage.getItem() returns null if key doesn't exist
  
  if (name) { // If name exists (user has logged in before)
    showGreeting(name); // Display "Welcome back, [Name]!" message
    showLogin(false); // Hide the login form (user already logged in)
  } else { // If no name found (first time visitor or storage cleared)
    showGreeting(''); // Clear any existing greeting text
    showLogin(true); // Show the login form
  }
}

/**
 * DOM Content Loaded Event Listener
 * Fires when initial HTML document has been completely loaded and parsed
 * Perfect time to set up event listeners and initialize functionality
 * CRITICAL: Ensures all HTML elements exist before JavaScript tries to access them
 */
document.addEventListener('DOMContentLoaded', function() {
  // This event fires when DOM is ready but before images/stylesheets finish loading
  // Prevents errors from trying to access elements that haven't loaded yet
  
  checkLogin(); // Check and restore login state on page load
  
  // ---------------------------------------------------------------------------
  // LOGIN FORM SUBMISSION HANDLER
  // Intercepts form submission to save name to localStorage without page reload
  // ---------------------------------------------------------------------------
  const loginForm = document.getElementById('login-form');
  if (loginForm) { // Safety check - only proceed if form exists in DOM
    loginForm.addEventListener('submit', function(e) {
      // 'submit' event fires when:
      // - User clicks submit button
      // - User presses Enter key in form field
      
      e.preventDefault(); // Prevent default form submission (which would reload page)
      // Critical for single-page app behavior
      
      const usernameInput = document.getElementById('username');
      const name = usernameInput.value.trim(); // Get input value and remove whitespace
      // .trim() removes leading/trailing spaces: "  John  " becomes "John"
      
      if (name) { // If name is not empty string
        localStorage.setItem('flight_username', name); // Save name to browser storage
        // localStorage.setItem(key, value) stores data that persists across sessions
        // Data remains even after closing browser
        
        showGreeting(name); // Display personalized greeting
        showLogin(false); // Hide login form (user is now logged in)
      }
    });
  }
  
  // ---------------------------------------------------------------------------
  // NAVIGATION SMOOTH SCROLL SETUP
  // Makes clicking navigation links scroll smoothly instead of jumping instantly
  // Enhances user experience with animated scrolling
  // ---------------------------------------------------------------------------
  document.querySelectorAll('.nav-link').forEach(link => {
    // querySelectorAll() returns NodeList of all elements with class "nav-link"
    // forEach() loops through each element
    
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default anchor behavior (instant jump to section)
      
      const href = this.getAttribute('href'); // Get href attribute value (e.g., "#search-section")
      // 'this' refers to the clicked link element
      const target = document.querySelector(href); // Find element with matching ID
      // Example: if href="#search-section", finds element with id="search-section"
      
      if (target) { // If target section exists in DOM
        target.scrollIntoView({ 
          behavior: 'smooth', // Smooth animated scroll instead of instant jump
          block: 'start' // Align element to top of viewport
        });
        
        // UPDATE ACTIVE NAV LINK STYLING
        // Remove 'active' class from all links, then add to clicked link
        document.querySelectorAll('.nav-link').forEach(l => {
          l.classList.remove('active'); // Remove 'active' class from all navigation links
        });
        this.classList.add('active'); // Add 'active' class to clicked link
        // CSS uses .nav-link.active to style the active/current link differently
      }
    });
  });

  // ---------------------------------------------------------------------------
  // INITIALIZE CLEAR BUTTONS
  // Set up functionality for X buttons that appear in input fields
  // ---------------------------------------------------------------------------
  setupClearButtons(); // Call function defined below
});

// =============================================================================
// SECTION 3: CLEAR BUTTON FUNCTIONALITY
// X buttons that appear in input fields to quickly clear their content
// Buttons show when field has value, hide when empty
// Improves user experience by providing quick way to reset fields
// =============================================================================

/**
 * Sets up clear buttons for all text inputs (origin/destination) and date inputs
 * Adds event listeners to show/hide buttons based on field value
 * Adds click handlers to clear field when button is clicked
 */
function setupClearButtons() {
  // ---------------------------------------------------------------------------
  // TEXT INPUTS: Origin and destination autocomplete fields
  // ---------------------------------------------------------------------------
  const textInputs = ['origin', 'destination']; // Array of input IDs to process
  textInputs.forEach(inputId => {
    // Loop through each text input ID
    
    const input = document.getElementById(inputId); // Get input element from DOM
    const clearBtn = input.nextElementSibling; // Get next sibling element (clear button)
    // nextElementSibling: Gets the immediately following element in HTML structure
    // HTML structure: <input> <button class="clear-button"> (button comes right after input)
    
    // SHOW/HIDE CLEAR BUTTON BASED ON INPUT VALUE
    input.addEventListener('input', function() {
      // 'input' event fires every time user types, pastes, or deletes
      // Fires more frequently than 'change' event (which only fires on blur)
      
      if (this.value.trim()) { // If input has text content (after removing whitespace)
        clearBtn.style.display = 'flex'; // Show clear button
        // Using 'flex' because button uses flexbox for centering icon
      } else { // If input is empty
        clearBtn.style.display = 'none'; // Hide clear button
      }
    });
    
    // CLEAR BUTTON CLICK HANDLER
    clearBtn.addEventListener('click', function() {
      input.value = ''; // Clear input value (set to empty string)
      delete input.dataset.code; // Remove stored airport code from dataset
      // dataset.code is where autocomplete stores the selected airport code
      // Example: When "London (LON)" is selected, dataset.code = "LON"
      delete input.dataset.type; // Remove stored location type from dataset
      // Type can be 'airport', 'city', or 'country'
      clearBtn.style.display = 'none'; // Hide clear button (field is now empty)
      input.focus(); // Return focus to input field for user convenience
      // Allows user to immediately start typing again without clicking
    });
  });

  // ---------------------------------------------------------------------------
  // DATE INPUTS: Departure and return date fields
  // Similar logic to text inputs but for HTML5 date pickers
  // ---------------------------------------------------------------------------
  const dateInputs = ['depart-date', 'return-date']; // Array of date input IDs
  dateInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    const wrapper = input.parentElement; // Get parent div (date-input-wrapper)
    // parentElement: Gets the immediate parent element
    const clearBtn = wrapper.querySelector('.clear-button'); // Find clear button within wrapper
    // querySelector: Finds first element matching CSS selector within wrapper
    
    // SHOW/HIDE CLEAR BUTTON BASED ON DATE VALUE
    input.addEventListener('input', function() {
      if (this.value) { // If date is selected (value exists and is not empty)
        clearBtn.style.display = 'flex'; // Show clear button
      } else { // If no date selected (empty value)
        clearBtn.style.display = 'none'; // Hide clear button
      }
    });
    
    // CLEAR BUTTON CLICK HANDLER
    clearBtn.addEventListener('click', function() {
      input.value = ''; // Clear date value (set to empty string)
      // For date inputs, empty string removes the selected date
      clearBtn.style.display = 'none'; // Hide clear button
      input.focus(); // Focus input (may open date picker on some browsers)
    });
  });
}

// =============================================================================
// SECTION 4: AUTOCOMPLETE FUNCTIONALITY
// Provides airport/city suggestions as user types in From/To fields
// Uses Travelpayouts autocomplete API to fetch real-time suggestions
// =============================================================================

/**
 * Sets up autocomplete functionality for a text input field
 * Fetches suggestions from Travelpayouts API as user types (after 2+ characters)
 * Displays dropdown with clickable suggestions
 * Stores selected airport/city code in input's dataset for later use
 * 
 * @param {string} inputId - ID of the input element to add autocomplete to
 * @param {string} suggestionsId - ID of container element to display suggestions in
 */
function setupAutocomplete(inputId, suggestionsId) {
  const input = document.getElementById(inputId); // Get input element
  const suggestionsDiv = document.getElementById(suggestionsId); // Get suggestions container
  let currentList = null; // Track current suggestions list for cleanup
  // Using 'let' because value will be reassigned when new suggestions are created
  
  // INPUT EVENT LISTENER: Fires every time user types in the field
  input.addEventListener('input', function() {
    const term = input.value.trim(); // Get input value and remove leading/trailing whitespace
    
    // MINIMUM CHARACTER CHECK
    // Don't search with only 1 character (too many results, poor performance)
    if (term.length < 2) { // If less than 2 characters typed
      if (currentList) currentList.remove(); // Remove any existing suggestions dropdown
      return; // Exit function early (don't make API call)
    }
    
    // SHOW LOADING MESSAGE IMMEDIATELY
    // Provides instant visual feedback while waiting for API response
    if (currentList) currentList.remove(); // Remove previous suggestions first
    const loadingList = document.createElement('ul'); // Create new <ul> element in memory
    loadingList.className = 'suggestions-list'; // Add CSS class for styling
    loadingList.innerHTML = '<li class="autocomplete-loading">Searching...</li>'; // Set loading text
    suggestionsDiv.appendChild(loadingList); // Add to DOM (makes it visible)
    currentList = loadingList; // Store reference for later removal
    
    // FETCH SUGGESTIONS FROM TRAVELPAYOUTS AUTOCOMPLETE API
    // This is a direct browser call to Travelpayouts (not through backend)
    // Backend is not needed here because autocomplete API doesn't have CORS restrictions
    const apiUrl = `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(term)}&locale=en&types[]=country&types[]=city&types[]=airport`;
    // encodeURIComponent(): Safely encodes text for URL (handles spaces, special characters)
    // Example: "New York" becomes "New%20York"
    // &locale=en: Request English language results
    // &types[]=...: Request countries, cities, AND airports in results
    
    fetch(apiUrl) // Make HTTP GET request to API
      // fetch() returns a Promise representing the eventual completion of the request
      
      .then(r => r.json()) // Parse response body as JSON
      // .then() runs when fetch completes successfully
      // r.json() returns Promise that resolves to parsed JavaScript object/array
      
      .then(data => {
        // This block runs when JSON parsing completes
        // 'data' is an array of location objects from API
        // Each object contains: name, code, type, city_name, country_name, etc.
        
        if (currentList) currentList.remove(); // Remove loading message
        
        // CHECK IF NO RESULTS FOUND
        if (!data || data.length === 0) {
          // If data is null/undefined/empty array
          const noResultsList = document.createElement('ul');
          noResultsList.className = 'suggestions-list';
          noResultsList.innerHTML = '<li class="autocomplete-loading">No results found</li>';
          suggestionsDiv.appendChild(noResultsList);
          currentList = noResultsList;
          return; // Exit function early (no data to process)
        }
        
        // CREATE SUGGESTIONS LIST
        const ul = document.createElement('ul'); // Create <ul> element in memory
        ul.className = 'suggestions-list'; // Add CSS class for styling
        
        // LOOP THROUGH EACH LOCATION RESULT FROM API
        data.forEach(item => {
          // forEach: Executes function for each array element
          // item object has properties: name, code, type, city_name, country_name
          
          // BUILD DISPLAY LABEL FOR SUGGESTION
          // Format differently based on location type
          let label = item.name; // Start with location name
          if (item.type === 'airport') {
            // Airport: Show airport name, code, city, and country
            // Example: "Heathrow (LHR) - London, United Kingdom"
            label += ` (${item.code}) - ${item.city_name}, ${item.country_name}`;
          } else if (item.type === 'city') {
            // City: Show city name, code, and country
            // Example: "London (LON) - United Kingdom"
            label += ` (${item.code}) - ${item.country_name}`;
          } else if (item.type === 'country') {
            // Country: Show country name and code
            // Example: "United Kingdom (GB)"
            label += ` (${item.code})`;
          }
          
          // CREATE LIST ITEM ELEMENT FOR THIS SUGGESTION
          const li = document.createElement('li'); // Create <li> element
          li.textContent = label; // Set text content (automatically escapes HTML)
          
          // STORE DATA IN ELEMENT'S DATASET
          // Dataset attributes (data-*) allow storing custom data on elements
          li.dataset.code = item.code; // Store airport/city code (e.g., "LON")
          // Creates: <li data-code="LON">...</li>
          // Accessible via: element.dataset.code in JavaScript
          li.dataset.name = item.name; // Store location name
          li.dataset.type = item.type; // Store type (airport/city/country)
          
          // CLICK HANDLER: User selects this suggestion
          li.addEventListener('mousedown', function(e) {
            // Using mousedown instead of click is IMPORTANT
            // mousedown fires before blur event on input
            // This prevents dropdown from closing before click registers
            
            input.value = label; // Set input field to selected label text
            input.dataset.code = item.code; // Store code on input for form submission
            // This code is retrieved later when searching for flights
            // It's the airport/city code that the API needs (e.g., "LON", "NYC")
            input.dataset.type = item.type; // Store type on input
            ul.remove(); // Remove suggestions dropdown (selection complete)
          });
          
          ul.appendChild(li); // Add list item to unordered list
        });
        
        if (data.length > 0) {
          suggestionsDiv.appendChild(ul); // Add complete list to DOM (makes it visible)
        }
        currentList = ul; // Store reference for cleanup when user types again
      })
      
      .catch(error => {
        // CATCH BLOCK: Runs if any error occurs in the Promise chain
        // Examples: Network error, API down, JSON parsing error
        console.error('Autocomplete error:', error); // Log error to browser console
        // console.error() displays in red in DevTools console for easy identification
        
        if (currentList) currentList.remove(); // Remove loading message
        const errorList = document.createElement('ul');
        errorList.className = 'suggestions-list';
        errorList.innerHTML = '<li class="autocomplete-loading">Error loading results</li>';
        suggestionsDiv.appendChild(errorList);
        currentList = errorList;
      });
  });
  
  // BLUR EVENT LISTENER: Input loses focus (user clicks elsewhere)
  input.addEventListener('blur', function() {
    setTimeout(() => { 
      // setTimeout delays execution by specified milliseconds
      if (currentList) currentList.remove(); // Remove suggestions dropdown
    }, 200); // 200ms delay
    // Delay is CRITICAL: allows click event on suggestion to fire first
    // Without delay, blur would remove dropdown before mousedown registers
    // 200ms is enough time for click to complete but fast enough to feel instant to user
  });
}

// INITIALIZE AUTOCOMPLETE FOR BOTH INPUT FIELDS
setupAutocomplete('origin', 'origin-suggestions'); // Setup for "From" field
setupAutocomplete('destination', 'destination-suggestions'); // Setup for "To" field

// =============================================================================
// SECTION 5: FLIGHT SEARCH FORM SUBMISSION
// Handles form submission, validation, API calls, and results display
// This is the most complex and important part of the application
// =============================================================================

document.getElementById('flight-form').addEventListener('submit', function(e) {
  // 'submit' event fires when:
  // 1. User clicks search button (type="submit")
  // 2. User presses Enter key in any form field
  // 3. JavaScript calls form.submit() programmatically
  
  e.preventDefault(); // Prevent default form submission behavior (page reload)
  // preventDefault() is CRITICAL for single-page app behavior
  // Without it, form would submit traditionally and reload the page
  
  // ---------------------------------------------------------------------------
  // GET FORM VALUES FROM INPUT FIELDS
  // ---------------------------------------------------------------------------
  const originInput = document.getElementById('origin');
  const destInput = document.getElementById('destination');
  const departDate = document.getElementById('depart-date').value; // YYYY-MM-DD format or empty string
  const returnDate = document.getElementById('return-date').value; // YYYY-MM-DD format or empty string
  const warningContainer = document.getElementById('warning-messages');
  
  // Get stored airport codes from input datasets
  // These codes were set by autocomplete when user clicked a suggestion
  const originCode = originInput.dataset.code; // Example: "LON" for London
  const destCode = destInput.dataset.code; // Example: "NYC" for New York
  
  // ---------------------------------------------------------------------------
  // CLEAR PREVIOUS WARNINGS
  // Important to remove old warnings before validating new submission
  // ---------------------------------------------------------------------------
  warningContainer.innerHTML = ''; // Remove all child elements
  warningContainer.style.display = 'none'; // Hide container
  
  // ---------------------------------------------------------------------------
  // VALIDATION: Check that user selected airports from autocomplete dropdown
  // User must click a suggestion, not just type and press enter
  // ---------------------------------------------------------------------------
  if (!originCode || !destCode) {
    // If either code is undefined/null (user typed but didn't select from dropdown)
    alert('Please select valid airports or cities from the suggestions.');
    // alert() displays browser popup (blocks further execution until dismissed)
    return; // Exit function early (don't proceed with search)
  }
  
  // ---------------------------------------------------------------------------
  // DATE VALIDATION: Check for past dates and invalid date order
  // Shows warnings for past dates but allows search (user might want historical data)
  // Blocks search if return is before departure (logically impossible)
  // ---------------------------------------------------------------------------
  const warnings = []; // Array to collect warning message objects
  const today = new Date(); // Current date and time
  today.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00.000)
  // This allows date-only comparison without time component
  // Otherwise: "2025-02-15 10:30" < "2025-02-15 14:00" would be true
  // With midnight: Both become "2025-02-15 00:00" for accurate comparison
  
  // CHECK DEPARTURE DATE FOR PAST DATE
  if (departDate) { // If departure date was selected
    const departDateObj = new Date(departDate); // Convert string to Date object
    // new Date("2025-02-15") creates Date object for that day at midnight
    
    if (departDateObj < today) { // If departure is before today
      warnings.push({ // Add warning object to array
        type: 'warning', // Yellow/orange warning (doesn't block search)
        icon: '⚠️', // Warning emoji symbol
        message: 'Departure date is in the past. Flights shown may no longer be available.'
      });
      // Note: We don't return here - past dates get warning but search continues
    }
  }
  
  // CHECK RETURN DATE
  if (returnDate) { // If return date was selected (optional field)
    const returnDateObj = new Date(returnDate);
    
    // Check if return date is in the past
    if (returnDateObj < today) {
      warnings.push({
        type: 'warning',
        icon: '⚠️',
        message: 'Return date is in the past. Flights shown may no longer be available.'
      });
    }
    
    // Check if return is before departure (logically impossible scenario)
    if (departDate) { // If both dates are set
      const departDateObj = new Date(departDate);
      if (returnDateObj < departDateObj) {
        warnings.push({
          type: 'error', // Red error (blocks search execution)
          icon: '❌', // Cross mark emoji
          message: 'Return date cannot be before departure date. Please adjust your dates.'
        });
        return; // STOP EXECUTION - don't search with invalid date order
        // This is the only validation that blocks search
      }
    }
  }
  
  // ---------------------------------------------------------------------------
  // DISPLAY WARNINGS TO USER
  // Build HTML for each warning and insert into warning container
  // ---------------------------------------------------------------------------
  if (warnings.length > 0) { // If any warnings were collected
    warningContainer.innerHTML = warnings.map(w => `
      <div class="warning-message ${w.type}">
        <span class="warning-icon">${w.icon}</span>
        <span class="warning-text">${w.message}</span>
      </div>
    `).join('');
    // .map(): Transforms each warning object into HTML string
    // Template literal: Allows embedding variables with ${}
    // .join(''): Combines all HTML strings into one with no separator
    // Result: Complete HTML string with all warning divs
    
    warningContainer.style.display = 'block'; // Make warnings visible
    // Warnings display but search continues (unless return < departure)
  }
  
  // ---------------------------------------------------------------------------
  // PREPARE FOR SEARCH
  // Get result containers and loading indicator, clear previous results
  // ---------------------------------------------------------------------------
  const flightsList = document.getElementById('flights-list');
  const returnFlightsList = document.getElementById('return-flights-list');
  const loadingIndicator = document.getElementById('loading-indicator');
  
  flightsList.innerHTML = ''; // Clear previous departure flight results
  returnFlightsList.innerHTML = ''; // Clear previous return flight results
  // Important to clear before showing loading state
  
  // SHOW LOADING INDICATOR
  loadingIndicator.setAttribute('aria-hidden', 'false'); // Make accessible to screen readers
  // Screen readers will now announce "Loading flights"
  loadingIndicator.style.display = 'flex'; // Make visually visible
  // Using 'flex' for flexbox centering of spinner
  
  /**
   * Hides the loading indicator (spinner and text)
   * Called when all API requests complete (success or error)
   * Always call this eventually to prevent infinite loading state
   */
  function hideLoading() {
    loadingIndicator.setAttribute('aria-hidden', 'true'); // Hide from screen readers
    loadingIndicator.style.display = 'none'; // Hide visually
  }
  
  // ---------------------------------------------------------------------------
  // HELPER FUNCTION: Format date for display
  // ---------------------------------------------------------------------------
  /**
   * Formats date string from API into user-friendly localized format
   * @param {string} dt - Date string from API (YYYY-MM-DD format)
   * @returns {string} Formatted date (DD/MM/YYYY in British format) or "N/A" if null
   */
  function formatDate(dt) {
    return dt ? new Date(dt).toLocaleDateString('en-GB') : 'N/A';
    // Ternary operator: condition ? valueIfTrue : valueIfFalse
    // toLocaleDateString('en-GB'): British English format (DD/MM/YYYY)
    // Example: "2025-02-15" → "15/02/2025"
    // en-GB locale uses day/month/year order (unlike US month/day/year)
    // If dt is null/undefined/empty, returns 'N/A' instead of error
  }
  
  // ---------------------------------------------------------------------------
  // HELPER FUNCTION: Create and add flight card to results list
  // ---------------------------------------------------------------------------
  /**
   * Creates HTML for a flight result card and adds it to the specified list
   * @param {string} type - "Departure" or "Return" (for card header label)
   * @param {object} flight - Flight data object from API response
   * @param {HTMLElement} listElem - <ul> element to append card to
   */
  function addFlightInfo(type, flight, listElem) {
    const li = document.createElement('li'); // Create new <li> element in memory
    li.className = 'flight-result-card'; // Add CSS class for styling
    
    // BUILD HTML FOR FLIGHT CARD using template literal
    // Template literals allow multi-line strings and ${} variable interpolation
    li.innerHTML = `
      <div class="flight-header"><strong>${type}</strong></div>
      <div class="flight-details">
        <div class="flight-route"><strong>From:</strong> ${flight.origin} <strong>To:</strong> ${flight.destination}</div>
        <div class="flight-date"><strong>Departure:</strong> ${formatDate(flight.departure_at)}</div>
        <div class="flight-price"><strong>Price:</strong> ${flight.value} ${flight.currency}</div>
        <div class="flight-airline"><strong>Airline:</strong> ${flight.airline || 'N/A'}</div>
        <div class="flight-number"><strong>Flight #:</strong> ${flight.flight_number || 'N/A'}</div>
        <div class="flight-booking"><a href="../assets/html/404.html" class="book-button">Book Now</a></div>
      </div>
    `;
    // flight.airline || 'N/A': If airline is null/undefined/empty, show 'N/A'
    // Logical OR operator: returns first truthy value or last value
    // This prevents displaying "undefined" or blank spaces
    
    listElem.appendChild(li); // Add card to list (makes it visible on page)
  }
  
  // ---------------------------------------------------------------------------
  // CORE FUNCTION: Fetch flights from backend API and display results
  // ---------------------------------------------------------------------------
  /**
   * Fetches flight data from backend API server and displays results
   * Handles loading state, network errors, API errors, and success scenarios
   * Backend server proxies request to Travelpayouts API to avoid CORS issues
   * 
   * @param {string} from - Origin airport code (e.g., "LON")
   * @param {string} to - Destination airport code (e.g., "NYC")
   * @param {string} date - Departure date in YYYY-MM-DD format
   * @param {string} typeLabel - "Departure" or "Return" for display label
   * @param {HTMLElement} listElem - <ul> element to display results in
   * @param {boolean} isLastRequest - True if this is the final API call
   */
  function fetchFlights(from, to, date, typeLabel, listElem, isLastRequest) {
    // BUILD API URL WITH QUERY PARAMETERS
    const url = `https://flightfinder-website.onrender.com/api/travelpayouts/flights?origin=${from}&destination=${to}&departure_at=${date}`;
    // This URL points to OUR backend server (not directly to Travelpayouts)
    // Backend acts as proxy to avoid CORS (Cross-Origin Resource Sharing) issues
    // Query parameters: ?key=value&key2=value2 (appended to URL)
    
    // MAKE HTTP GET REQUEST TO BACKEND API
    fetch(url)
      // fetch() returns Promise that resolves to Response object
      // Promise represents eventual completion (or failure) of async operation
      
      .then(async r => {
        // First .then(): Handle HTTP response status
        // async keyword allows use of await inside function
        
        if (!r.ok) { // If HTTP status is not 200-299 (success range)
          // Examples of not ok: 400 Bad Request, 404 Not Found, 500 Server Error
          const text = await r.text(); // Get error text from response body
          // await pauses execution until r.text() Promise resolves
          throw new Error(`HTTP ${r.status}: ${text}`);
          // throw creates error and immediately jumps to .catch() block
          // Error includes both status code and error message text
        }
        return r.json(); // Parse response body as JSON
        // Returns Promise that resolves to parsed JavaScript object/array
      })
      
      .then(data => {
        // Second .then(): Handle successful response with parsed flight data
        // data contains flight information object from backend API
        
        // CHECK FOR API ERROR MESSAGE
        if (data.error) {
          // Backend API returns {error: "message"} format for errors
          // This catches API-level errors (not HTTP errors)
          listElem.innerHTML = `<li class="error-message">API Error: ${data.error}</li>`;
          console.error('API Error:', data); // Log full error object to console for debugging
          if (isLastRequest) hideLoading(); // Hide spinner if this was last request
          return; // Exit function early (don't process flight data)
        }
        
        // CHECK FOR FLIGHT DATA IN RESPONSE
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          // data.data: Flight array (nested because API wraps it in data property)
          // Array.isArray(): Type check - ensures value is actually an array
          // .length > 0: Ensures array contains at least one flight
          
          // SORT FLIGHTS BY DATE PROXIMITY
          // Shows flights closest to requested date first (most relevant)
          const sorted = data.data.slice().sort((a, b) => {
            // .slice(): Creates shallow copy (don't mutate original array)
            // .sort(): Sorts array in-place using compare function
            // Compare function: (a, b) => number
            //   Return negative: a comes before b
            //   Return zero: order unchanged
            //   Return positive: b comes before a
            
            // Calculate absolute distance from each flight's date to requested date
            const dA = Math.abs(new Date(a.departure_at) - new Date(date));
            const dB = Math.abs(new Date(b.departure_at) - new Date(date));
            // Math.abs(): Absolute value (distance, always positive)
            // Date subtraction: Returns milliseconds difference
            // Example: Feb 15 - Feb 10 = 432000000 ms (5 days)
            
            return dA - dB; // Sort ascending (smallest distance first)
            // If dA < dB: negative number, so a comes first (closer to date)
            // If dA > dB: positive number, so b comes first
            // Result: Flights sorted with closest dates to requested date first
          });
          
          // DISPLAY FIRST 5 FLIGHTS
          sorted.slice(0, 5).forEach(flight => {
            // .slice(0, 5): Get first 5 elements (array indices 0-4)
            // .forEach(): Execute function for each element
            addFlightInfo(typeLabel, flight, listElem); // Add flight card to page
          });
          // Limiting to 5 prevents:
          // - Overwhelming user with too many options
          // - Page becoming too long to scroll
          // - Slow rendering with many DOM elements
          
        } else {
          // NO FLIGHTS FOUND IN API RESPONSE
          // This is not an error - just means no flights available
          listElem.innerHTML = `<li class="no-results">No ${typeLabel.toLowerCase()} flights found.</li>`;
          // .toLowerCase(): "Departure" → "departure" for better grammar
          console.warn('No flights found:', data); // Log to console (yellow warning)
          // console.warn(): Yellow warning in DevTools console
        }
        
        // HIDE LOADING INDICATOR IF THIS IS LAST REQUEST
        if (isLastRequest) {
          // isLastRequest: True for one-way trip OR for return flight in round-trip
          hideLoading(); // Hide spinner and loading text
          
          // SMOOTH SCROLL TO RESULTS
          setTimeout(() => {
            // setTimeout(): Delay execution by specified milliseconds
            flightsList.scrollIntoView({ 
              behavior: 'smooth', // Animated scrolling
              block: 'start' // Align to top of viewport
            });
          }, 100); // 100ms delay
          // Delay gives results time to render in DOM before scrolling
          // Scrolling too soon might scroll to empty space before cards appear
        }
      })
      
      .catch(err => {
        // CATCH BLOCK: Handles ANY error in entire Promise chain
        // Examples: Network failure, JSON parsing error, thrown Error objects
        // This is the last line of defense for error handling
        
        listElem.innerHTML = `<li class="error-message">Error fetching ${typeLabel.toLowerCase()} flights.<br><span style='color:#dc3545;'>${err.message}</span></li>`;
        // Display user-friendly error message in results list
        // err.message: Error message text
        // <br>: Line break for better readability
        // Inline style for red color (#dc3545 is Bootstrap danger color)
        
        console.error('Fetch error:', err); // Log full error object to console
        // console.error(): Red error in DevTools console with stack trace
        if (isLastRequest) hideLoading(); // Hide spinner even on error
        // IMPORTANT: Always hide loading state, even when request fails
        // Prevents infinite loading spinner
      });
  }
  
  // ---------------------------------------------------------------------------
  // EXECUTE SEARCH: Call API for departure and optionally return flights
  // ---------------------------------------------------------------------------
  
  // DETERMINE IF USER SELECTED RETURN DATE (round-trip vs one-way)
  const hasReturnDate = !!returnDate;
  // !! (double NOT): Converts any value to boolean
  // !!"" = false (empty string is falsy)
  // !!"2025-02-15" = true (non-empty string is truthy)
  // Result: true if return date selected, false if not
  
  // FETCH DEPARTURE/OUTBOUND FLIGHTS
  fetchFlights(
    originCode,      // From: Origin airport code (e.g., "LON")
    destCode,        // To: Destination airport code (e.g., "NYC")
    departDate,      // Date: Departure date (YYYY-MM-DD)
    'Departure',     // Label: "Departure" for display in results
    flightsList,     // List: <ul> element to display departure flights
    !hasReturnDate   // isLastRequest: true if one-way (no return to fetch)
  );
  // If one-way (!hasReturnDate = true): This is last request, hide loading after
  // If round-trip (!hasReturnDate = false): Don't hide loading yet, return flight coming
  
  // PREPARE RETURN FLIGHTS SECTION WITH HEADER
  returnFlightsList.innerHTML = '<li class="section-header"><strong>Return Flights</strong></li>';
  // Add section header regardless of whether flights will be fetched
  // Provides clear visual separation between departure and return sections
  
  if (hasReturnDate) {
    // ROUND-TRIP: User selected return date, fetch return flights
    fetchFlights(
      destCode,        // From: Destination becomes origin for return journey
      originCode,      // To: Origin becomes destination for return journey
      returnDate,      // Date: Return date
      'Return',        // Label: "Return" for display
      returnFlightsList, // List: Separate <ul> for return flights
      true             // isLastRequest: Always true (this is final request)
    );
    // Origin and destination are swapped for return journey
    // Always the last request in round-trip scenario
    
  } else {
    // ONE-WAY: No return date selected, show informational message
    returnFlightsList.innerHTML += '<li class="info-message">No return date selected.</li>';
    // += appends to existing innerHTML (adds to section header)
    // Informs user this is intentionally empty (not an error)
  }
});
