/**
 * config.gs - Configuration settings for Keystone Acquisitions Dashboard
 *
 * This file contains all configuration constants, settings, and parameters
 * used throughout the Google Apps Script project. Centralizing configuration
 * here makes it easy to customize the dashboard for different environments.
 */

// Configuration object
function getConfig() {
  return {
    // Sheet names
    LEADS_SHEET_NAME: 'Leads Database',
    DASHBOARD_SHEET_NAME: 'New Leads Dashboard',

    // Column mapping for Leads Database
    COLUMNS: {
      LEAD_ID: 'A',
      DATE_RECEIVED: 'B',
      DATE_ENTERED: 'C',
      PROPERTY_NAME: 'D',
      ADDRESS: 'E',
      CITY: 'F',
      STATE: 'G',
      ASSET_TYPE: 'H',
      ASKING_PRICE: 'I',
      UNITS_PADS_SITES: 'J',
      ACREAGE: 'K',
      NOI: 'L',
      OCCUPANCY_VACANCY: 'M',
      BROKER_NAME: 'N',
      BROKER_PHONE: 'O',
      SENDER_NAME: 'P',
      SENDER_EMAIL: 'Q',
      ATTACHMENTS_RECEIVED: 'R',
      MISSING_DOCS_FLAG: 'S',
      MISSING_DOCS_LIST: 'T',
      SELLER_FINANCING_MENTION: 'U',
      SUMMARY_OF_OPPORTUNITY: 'V',
      INTAKE_STATUS: 'W',
      FOLLOW_UP_STATUS: 'X',
      HUMAN_REVIEW_FLAG: 'Y',
      LAST_FOLLOW_UP_DATE: 'Z',
      ASSIGNED_TO: 'AA',
      NOTES: 'AB'
    },

    // Asset types
    ASSET_TYPES: ['RV Park', 'Campground', 'Resort'],

    // Intake statuses
    INTAKE_STATUSES: [
      'New',
      'In Progress',
      'Waiting on Docs',
      'Ready for Review',
      'Human Review Needed',
      'Completed'
    ],

    // Follow-up statuses
    FOLLOW_UP_STATUSES: [
      'No Follow-up Sent',
      'Follow-up Sent',
      'Follow-up in Progress',
      'Completed'
    ],

    // Email configuration
    NOTIFICATION_EMAIL: 'acquisitions@keystoneacquisitions.com', // Change this to your email
    EMAIL_FROM_NAME: 'Keystone Acquisitions Dashboard',

    // Email templates
    EMAIL_TEMPLATES: {
      FOLLOW_UP_REMINDER: {
        SUBJECT: 'Follow-up Required: Missing Documents for {PROPERTY_NAME}',
        BODY: `Dear {BROKER_NAME},

We received your inquiry about {PROPERTY_NAME} on {DATE_RECEIVED}, but we still need the following documents to proceed:

{MISSING_DOCS_LIST}

Please send these documents as soon as possible so we can move forward with the evaluation.

If you have any questions, please don't hesitate to contact us.

Best regards,
Keystone Acquisitions Team
acquisitions@keystoneacquisitions.com`
      },

      DAILY_SUMMARY: {
        SUBJECT: 'Daily Lead Intake Summary - {DATE}',
        BODY: `Keystone Acquisitions - Daily Lead Intake Summary

Date: {DATE}

KEY METRICS:
- Total Leads: {TOTAL_LEADS}
- Leads Today: {LEADS_TODAY}
- Leads This Week: {LEADS_THIS_WEEK}
- Missing Docs: {MISSING_DOCS}
- Human Review: {HUMAN_REVIEW}

STATUS BREAKDOWN:
{STATUS_BREAKDOWN}

Please review the dashboard for detailed information.
Dashboard Link: {DASHBOARD_LINK}`
      }
    },

    // Business rules
    BUSINESS_RULES: {
      FOLLOW_UP_REMINDER_DAYS: 3, // Send reminder after 3 days
      STALE_LEAD_DAYS: 30, // Flag leads older than 30 days for review
      MAX_MISSING_DOCS_DAYS: 14, // Escalate if docs missing > 14 days
      AUTO_COMPLETE_DAYS: 60 // Auto-complete leads older than 60 days
    },

    // Data validation rules
    VALIDATION_RULES: {
      REQUIRED_FIELDS: ['leadId', 'dateReceived', 'propertyName', 'assetType'],
      EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
      PRICE_MIN: 10000, // Minimum asking price $10K
      PRICE_MAX: 100000000, // Maximum asking price $100M
      ACREAGE_MAX: 10000, // Maximum acreage
      UNITS_MAX: 10000 // Maximum units/sites
    },

    // Formatting options
    FORMATTING: {
      DATE_FORMAT: 'MMM dd, yyyy',
      CURRENCY_FORMAT: '$#,##0',
      PERCENTAGE_FORMAT: '0.0%',
      COLORS: {
        HEADER_BACKGROUND: '#1a3a5f',
        KPI_BACKGROUND: '#e8f1f8',
        SECTION_HEADER_BACKGROUND: '#d3d3d3',
        TABLE_HEADER_BACKGROUND: '#f0f0f0',
        ALTERNATING_ROW_BACKGROUND: '#f9f9f9',
        WARNING_BACKGROUND: '#ffd966', // Amber
        CRITICAL_BACKGROUND: '#f4cccc', // Red
        SUCCESS_BACKGROUND: '#d9ead3' // Green
      }
    },

    // Dashboard layout constants
    DASHBOARD_LAYOUT: {
      HEADER_ROWS: 3,
      KPI_ROWS: { START: 5, END: 9 },
      STATUS_ROWS: { START: 10, END: 17 },
      MISSING_DOCS_ROWS: { START: 18, END: 40 },
      HUMAN_REVIEW_ROWS: { START: 42, END: 62 },
      ASSET_BREAKDOWN_ROWS: { START: 64, END: 72 },
      RECENT_LEADS_ROWS: { START: 74, END: 94 }
    },

    // API and external service configurations
    EXTERNAL_SERVICES: {
      ENABLE_EMAIL_NOTIFICATIONS: true,
      ENABLE_SLACK_NOTIFICATIONS: false, // Set to true if you want Slack integration
      SLACK_WEBHOOK_URL: '', // Add your Slack webhook URL here
      ENABLE_GOOGLE_ANALYTICS: false,
      GOOGLE_ANALYTICS_ID: ''
    },

    // Logging and debugging
    LOGGING: {
      ENABLE_VERBOSE_LOGGING: true,
      LOG_LEVEL: 'INFO', // DEBUG, INFO, WARN, ERROR
      MAX_LOG_ENTRIES: 1000,
      LOG_RETENTION_DAYS: 30
    },

    // Performance settings
    PERFORMANCE: {
      BATCH_SIZE: 100, // Process data in batches of 100 rows
      TIMEOUT_SECONDS: 300, // 5 minutes max execution time
      CACHE_EXPIRY_MINUTES: 60 // Cache expiry time
    },

    // Security settings
    SECURITY: {
      ALLOW_PUBLIC_ACCESS: false,
      REQUIRE_LOGIN: true,
      ENCRYPT_SENSITIVE_DATA: false,
      AUDIT_TRAIL_ENABLED: true
    },

    // Feature flags (enable/disable features)
    FEATURES: {
      AUTO_STATUS_UPDATES: true,
      EMAIL_NOTIFICATIONS: true,
      DATA_VALIDATION: true,
      DAILY_SUMMARY: true,
      FOLLOW_UP_REMINDERS: true,
      EXPORT_REPORTS: true,
      CLEANUP_TOOLS: true
    }
  };
}

/**
 * Get column index by name
 * @param {string} columnName - The column name (e.g., 'LEAD_ID')
 * @return {number} The column index (0-based)
 */
function getColumnIndex(columnName) {
  var config = getConfig();
  var columnLetter = config.COLUMNS[columnName];

  if (!columnLetter) {
    throw new Error('Column not found: ' + columnName);
  }

  return columnLetterToIndex(columnLetter);
}

/**
 * Convert column letter to 0-based index
 * @param {string} letter - Column letter (A, B, C, etc.)
 * @return {number} 0-based column index
 */
function columnLetterToIndex(letter) {
  var index = 0;
  var length = letter.length;

  for (var i = 0; i < length; i++) {
    index += (letter.charCodeAt(length - 1 - i) - 64) * Math.pow(26, i);
  }

  return index - 1; // Convert to 0-based
}

/**
 * Get all column indices as an object
 * @param {Array} headers - Array of header strings
 * @return {Object} Object with column indices
 */
function getColumnIndices(headers) {
  var config = getConfig();
  var indices = {};

  // Map column letters to indices
  for (var key in config.COLUMNS) {
    var letter = config.COLUMNS[key];
    var index = columnLetterToIndex(letter);
    indices[key.toLowerCase()] = index;
  }

  return indices;
}

/**
 * Validate configuration
 * @return {boolean} True if configuration is valid
 */
function validateConfig() {
  var config = getConfig();
  var errors = [];

  // Check required sheet names
  if (!config.LEADS_SHEET_NAME) {
    errors.push('LEADS_SHEET_NAME is required');
  }

  if (!config.DASHBOARD_SHEET_NAME) {
    errors.push('DASHBOARD_SHEET_NAME is required');
  }

  // Check email configuration
  if (config.FEATURES.EMAIL_NOTIFICATIONS && !config.NOTIFICATION_EMAIL) {
    errors.push('NOTIFICATION_EMAIL is required when email notifications are enabled');
  }

  // Check asset types
  if (!config.ASSET_TYPES || config.ASSET_TYPES.length === 0) {
    errors.push('ASSET_TYPES must be defined');
  }

  // Check intake statuses
  if (!config.INTAKE_STATUSES || config.INTAKE_STATUSES.length === 0) {
    errors.push('INTAKE_STATUSES must be defined');
  }

  if (errors.length > 0) {
    Logger.log('Configuration validation errors: ' + errors.join(', '));
    return false;
  }

  return true;
}
