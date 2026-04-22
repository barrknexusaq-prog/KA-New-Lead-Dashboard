/**
 * Helpers.gs - Utility functions for Keystone Acquisitions Dashboard
 *
 * This file contains helper functions used throughout the Google Apps Script
 * project. These include data formatting, validation, email utilities,
 * date calculations, and other common operations.
 */

// Global configuration access
var CONFIG;

/**
 * Initialize helpers with config
 */
function initializeHelpers() {
  CONFIG = getConfig();
}

/**
 * Send follow-up email to broker
 * @param {string} email - Broker email address
 * @param {string} brokerName - Broker name
 * @param {string} propertyName - Property name
 * @param {string} missingDocsList - List of missing documents
 */
function sendFollowUpEmail(email, brokerName, propertyName, missingDocsList) {
  try {
    var template = CONFIG.EMAIL_TEMPLATES.FOLLOW_UP_REMINDER;

    var subject = template.SUBJECT
      .replace('{PROPERTY_NAME}', propertyName);

    var body = template.BODY
      .replace('{BROKER_NAME}', brokerName || 'Valued Partner')
      .replace('{PROPERTY_NAME}', propertyName)
      .replace('{DATE_RECEIVED}', formatDate(new Date()))
      .replace('{MISSING_DOCS_LIST}', missingDocsList || 'Please check our previous communication for details');

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      name: CONFIG.EMAIL_FROM_NAME
    });

    Logger.log('Follow-up email sent to: ' + email + ' for property: ' + propertyName);

  } catch (error) {
    Logger.log('Error sending follow-up email to ' + email + ': ' + error.toString());
    throw error;
  }
}

/**
 * Format date for display
 * @param {Date} date - Date object to format
 * @return {string} Formatted date string
 */
function formatDate(date) {
  if (!date) return '';

  var config = CONFIG || getConfig();
  return Utilities.formatDate(date, Session.getScriptTimeZone(), config.FORMATTING.DATE_FORMAT);
}

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @return {string} Formatted currency string
 */
function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '';

  var config = CONFIG || getConfig();
  return Utilities.formatString(config.FORMATTING.CURRENCY_FORMAT, value);
}

/**
 * Format percentage
 * @param {number} value - Decimal value (0.15 for 15%)
 * @return {string} Formatted percentage string
 */
function formatPercentage(value) {
  if (value === null || value === undefined || isNaN(value)) return '';

  var config = CONFIG || getConfig();
  return (value * 100).toFixed(1) + '%';
}

/**
 * Calculate days since a date
 * @param {Date} pastDate - The past date
 * @param {Date} currentDate - Current date (optional, defaults to today)
 * @return {number} Number of days since the past date
 */
function getDaysSinceDate(pastDate, currentDate) {
  if (!pastDate) return 0;

  var current = currentDate || new Date();
  var past = new Date(pastDate);

  var diffTime = Math.abs(current - past);
  var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Calculate days since last follow-up
 * @param {Date|string} lastFollowUpDate - Last follow-up date
 * @return {number} Days since last follow-up
 */
function getDaysSinceLastFollowUp(lastFollowUpDate) {
  if (!lastFollowUpDate) return 999; // No follow-up means it's overdue

  return getDaysSinceDate(lastFollowUpDate);
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @return {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (!email) return false;

  var config = CONFIG || getConfig();
  var regex = config.VALIDATION_RULES.EMAIL_REGEX;

  return regex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @return {boolean} True if valid phone format
 */
function isValidPhone(phone) {
  if (!phone) return false;

  var config = CONFIG || getConfig();
  var regex = config.VALIDATION_RULES.PHONE_REGEX;

  // Remove common formatting characters
  var cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');

  return regex.test(cleanPhone);
}

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @return {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
  if (!phone) return '';

  // Remove all non-digit characters
  var cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return '(' + cleaned.substring(0, 3) + ') ' + cleaned.substring(3, 6) + '-' + cleaned.substring(6);
  } else if (cleaned.length === 11 && cleaned.charAt(0) === '1') {
    // Handle 1 + 10 digit numbers
    return '(' + cleaned.substring(1, 4) + ') ' + cleaned.substring(4, 7) + '-' + cleaned.substring(7);
  }

  return phone; // Return original if can't format
}

/**
 * Standardize state abbreviations
 * @param {string} state - State name or abbreviation
 * @return {string} Standardized 2-letter state code
 */
function standardizeState(state) {
  if (!state) return '';

  var stateMap = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY'
  };

  var normalizedState = state.toLowerCase().trim();

  // If it's already a 2-letter code, return uppercase
  if (normalizedState.length === 2 && stateMap[normalizedState]) {
    return normalizedState.toUpperCase();
  }

  // If it's a full state name, return the abbreviation
  if (stateMap[normalizedState]) {
    return stateMap[normalizedState];
  }

  // If it's already uppercase 2-letter, return as-is
  if (state.length === 2) {
    return state.toUpperCase();
  }

  return state; // Return original if can't standardize
}

/**
 * Generate unique lead ID
 * @param {string} prefix - Optional prefix (defaults to 'KSA')
 * @return {string} Unique lead ID
 */
function generateLeadId(prefix) {
  var prefixStr = prefix || 'KSA';
  var timestamp = new Date().getTime();
  var random = Math.floor(Math.random() * 1000);

  return prefixStr + '-' + timestamp + '-' + random;
}

/**
 * Validate lead data
 * @param {Object} leadData - Lead data object
 * @return {Object} Validation result with isValid and errors array
 */
function validateLeadData(leadData) {
  var config = CONFIG || getConfig();
  var errors = [];
  var warnings = [];

  // Required fields validation
  config.VALIDATION_RULES.REQUIRED_FIELDS.forEach(function(field) {
    if (!leadData[field]) {
      errors.push('Missing required field: ' + field);
    }
  });

  // Email validation
  if (leadData.senderEmail && !isValidEmail(leadData.senderEmail)) {
    errors.push('Invalid email format: ' + leadData.senderEmail);
  }

  // Phone validation
  if (leadData.brokerPhone && !isValidPhone(leadData.brokerPhone)) {
    warnings.push('Phone number format may be incorrect: ' + leadData.brokerPhone);
  }

  // Price validation
  if (leadData.askingPrice) {
    if (leadData.askingPrice < config.VALIDATION_RULES.PRICE_MIN) {
      warnings.push('Price seems low: ' + formatCurrency(leadData.askingPrice));
    }
    if (leadData.askingPrice > config.VALIDATION_RULES.PRICE_MAX) {
      warnings.push('Price seems high: ' + formatCurrency(leadData.askingPrice));
    }
  }

  // Acreage validation
  if (leadData.acreage && leadData.acreage > config.VALIDATION_RULES.ACREAGE_MAX) {
    warnings.push('Large acreage: ' + leadData.acreage + ' acres');
  }

  // Units validation
  if (leadData.unitsPadsSites && leadData.unitsPadsSites > config.VALIDATION_RULES.UNITS_MAX) {
    warnings.push('Large number of units: ' + leadData.unitsPadsSites);
  }

  // Asset type validation
  if (leadData.assetType && !config.ASSET_TYPES.includes(leadData.assetType)) {
    errors.push('Invalid asset type: ' + leadData.assetType + '. Must be one of: ' + config.ASSET_TYPES.join(', '));
  }

  // Intake status validation
  if (leadData.intakeStatus && !config.INTAKE_STATUSES.includes(leadData.intakeStatus)) {
    errors.push('Invalid intake status: ' + leadData.intakeStatus);
  }

  // Follow-up status validation
  if (leadData.followUpStatus && !config.FOLLOW_UP_STATUSES.includes(leadData.followUpStatus)) {
    errors.push('Invalid follow-up status: ' + leadData.followUpStatus);
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    warnings: warnings
  };
}

/**
 * Clean and normalize text
 * @param {string} text - Text to clean
 * @return {string} Cleaned text
 */
function cleanText(text) {
  if (!text) return '';

  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .substring(0, 10000); // Limit length
}

/**
 * Get sheet by name with error handling
 * @param {string} sheetName - Name of the sheet
 * @return {Sheet} The sheet object
 */
function getSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }

  return sheet;
}

/**
 * Log with timestamp
 * @param {string} message - Message to log
 * @param {string} level - Log level (DEBUG, INFO, WARN, ERROR)
 */
function logWithTimestamp(message, level) {
  var config = CONFIG || getConfig();
  var timestamp = formatDate(new Date()) + ' ' + new Date().toLocaleTimeString();
  var logLevel = level || 'INFO';

  if (config.LOGGING.ENABLE_VERBOSE_LOGGING || logLevel !== 'DEBUG') {
    Logger.log('[' + logLevel + '] ' + timestamp + ' - ' + message);
  }
}

/**
 * Send Slack notification (if enabled)
 * @param {string} message - Message to send
 * @param {string} channel - Slack channel (optional)
 */
function sendSlackNotification(message, channel) {
  var config = CONFIG || getConfig();

  if (!config.EXTERNAL_SERVICES.ENABLE_SLACK_NOTIFICATIONS ||
      !config.EXTERNAL_SERVICES.SLACK_WEBHOOK_URL) {
    return;
  }

  try {
    var payload = {
      text: message,
      channel: channel || '#general'
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    };

    UrlFetchApp.fetch(config.EXTERNAL_SERVICES.SLACK_WEBHOOK_URL, options);
    logWithTimestamp('Slack notification sent: ' + message);

  } catch (error) {
    logWithTimestamp('Error sending Slack notification: ' + error.toString(), 'ERROR');
  }
}

/**
 * Export data to CSV
 * @param {Array} data - 2D array of data
 * @param {string} filename - Filename for the export
 * @return {Blob} CSV blob
 */
function exportToCSV(data, filename) {
  var csvContent = '';

  data.forEach(function(row) {
    var csvRow = row.map(function(cell) {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
        return '"' + cell.replace(/"/g, '""') + '"';
      }
      return cell;
    });
    csvContent += csvRow.join(',') + '\n';
  });

  return Utilities.newBlob(csvContent, 'text/csv', filename);
}

/**
 * Batch process data to avoid timeouts
 * @param {Array} data - Array of data to process
 * @param {Function} processor - Function to process each item
 * @param {number} batchSize - Size of each batch
 */
function batchProcess(data, processor, batchSize) {
  var config = CONFIG || getConfig();
  var batch = batchSize || config.PERFORMANCE.BATCH_SIZE;

  for (var i = 0; i < data.length; i += batch) {
    var batchData = data.slice(i, i + batch);
    processor(batchData);

    // Check for timeout
    if ((new Date().getTime() - new Date().getTime()) > (config.PERFORMANCE.TIMEOUT_SECONDS * 1000)) {
      throw new Error('Processing timeout after ' + i + ' items');
    }
  }
}

/**
 * Cache data for performance
 * @param {string} key - Cache key
 * @param {*} data - Data to cache
 * @param {number} expiryMinutes - Minutes until expiry
 */
function setCache(key, data, expiryMinutes) {
  var config = CONFIG || getConfig();
  var expiry = expiryMinutes || config.PERFORMANCE.CACHE_EXPIRY_MINUTES;

  var cache = CacheService.getScriptCache();
  cache.put(key, JSON.stringify(data), expiry * 60);
}

/**
 * Get cached data
 * @param {string} key - Cache key
 * @return {*} Cached data or null
 */
function getCache(key) {
  var cache = CacheService.getScriptCache();
  var data = cache.get(key);

  if (data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      logWithTimestamp('Error parsing cached data for key: ' + key, 'ERROR');
      return null;
    }
  }

  return null;
}
