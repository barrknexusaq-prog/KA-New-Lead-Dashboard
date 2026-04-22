/**
 * Setup.gs - Initialization and setup functions for Keystone Acquisitions Dashboard
 *
 * This file contains functions to set up the Google Sheets dashboard,
 * create sheets, apply formatting, set up data validation, and initialize
 * the system for first use.
 */

// Global configuration access
var CONFIG;

/**
 * Initialize setup with config
 */
function initializeSetup() {
  CONFIG = getConfig();
}

/**
 * Complete setup function - runs all setup tasks
 */
function setupDashboard() {
  try {
    Logger.log('Starting dashboard setup...');

    // Validate configuration
    if (!validateConfig()) {
      throw new Error('Configuration validation failed. Please check config.gs');
    }

    // Create sheets if they don't exist
    createSheets();

    // Set up Leads Database sheet
    setupLeadsDatabase();

    // Set up Dashboard sheet
    setupDashboardSheet();

    // Apply formatting
    applyFormatting();

    // Set up data validation
    setupDataValidation();

    // Set up triggers
    setupTriggers();

    // Add sample data (optional)
    addSampleData();

    Logger.log('Dashboard setup completed successfully!');
    SpreadsheetApp.getUi().alert('Dashboard setup completed successfully!');

  } catch (error) {
    Logger.log('Setup failed: ' + error.toString());
    SpreadsheetApp.getUi().alert('Setup failed: ' + error.toString());
  }
}

/**
 * Create required sheets if they don't exist
 */
function createSheets() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Create Leads Database sheet
  var leadsSheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);
  if (!leadsSheet) {
    leadsSheet = spreadsheet.insertSheet(CONFIG.LEADS_SHEET_NAME);
    Logger.log('Created sheet: ' + CONFIG.LEADS_SHEET_NAME);
  }

  // Create Dashboard sheet
  var dashboardSheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);
  if (!dashboardSheet) {
    dashboardSheet = spreadsheet.insertSheet(CONFIG.DASHBOARD_SHEET_NAME);
    Logger.log('Created sheet: ' + CONFIG.DASHBOARD_SHEET_NAME);
  }

  // Move Dashboard sheet to first position
  spreadsheet.setActiveSheet(dashboardSheet);
  spreadsheet.moveActiveSheet(1);
}

/**
 * Set up the Leads Database sheet structure
 */
function setupLeadsDatabase() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);

  if (!sheet) {
    throw new Error('Leads Database sheet not found');
  }

  // Clear existing content
  sheet.clear();

  // Set up headers
  var headers = [
    'Lead ID',
    'Date Received',
    'Date Entered',
    'Property Name',
    'Address',
    'City',
    'State',
    'Asset Type',
    'Asking Price',
    'Number of Units/Pads/Sites',
    'Acreage',
    'NOI',
    'Occupancy / Vacancy',
    'Broker Name',
    'Broker Phone',
    'Sender Name',
    'Sender Email',
    'Attachments Received',
    'Missing Docs Flag',
    'Missing Docs List',
    'Seller Financing Mention',
    'Summary of Opportunity',
    'Intake Status',
    'Follow-Up Status',
    'Human Review Flag',
    'Last Follow-Up Date',
    'Assigned To',
    'Notes'
  ];

  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground(CONFIG.FORMATTING.COLORS.TABLE_HEADER_BACKGROUND);
  headerRange.setFontColor('#000000');

  // Set column widths
  sheet.setColumnWidth(1, 100); // Lead ID
  sheet.setColumnWidth(4, 200); // Property Name
  sheet.setColumnWidth(5, 150); // Address
  sheet.setColumnWidth(6, 120); // City
  sheet.setColumnWidth(7, 80);  // State
  sheet.setColumnWidth(8, 100); // Asset Type
  sheet.setColumnWidth(9, 120); // Asking Price
  sheet.setColumnWidth(14, 150); // Broker Name
  sheet.setColumnWidth(15, 120); // Broker Phone
  sheet.setColumnWidth(16, 120); // Sender Name
  sheet.setColumnWidth(17, 150); // Sender Email
  sheet.setColumnWidth(18, 200); // Attachments Received
  sheet.setColumnWidth(20, 250); // Missing Docs List
  sheet.setColumnWidth(21, 200); // Summary of Opportunity
  sheet.setColumnWidth(22, 120); // Intake Status
  sheet.setColumnWidth(23, 120); // Follow-Up Status
  sheet.setColumnWidth(27, 120); // Assigned To
  sheet.setColumnWidth(28, 300); // Notes

  // Freeze header row
  sheet.setFrozenRows(1);

  Logger.log('Leads Database sheet setup completed');
}

/**
 * Set up the Dashboard sheet with all sections
 */
function setupDashboardSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);

  if (!sheet) {
    throw new Error('Dashboard sheet not found');
  }

  // Clear existing content
  sheet.clear();

  // Set up basic structure - we'll add formulas in the next step
  setupDashboardLayout(sheet);

  Logger.log('Dashboard sheet basic layout completed');
}

/**
 * Set up dashboard layout with headers and labels
 */
function setupDashboardLayout(sheet) {
  // SECTION A — Header (Rows 1-3)
  sheet.getRange('A1:G1').merge().setValue('New Leads Dashboard');
  sheet.getRange('A2:G2').merge().setValue('Keystone Acquisitions Intake Monitoring');
  sheet.getRange('A3').setValue('Last Updated:');
  sheet.getRange('B3').setFormula('=TEXT(NOW(),"MMM DD, YYYY at h:mm AM/PM")');

  // SECTION B — KPI Cards (Rows 5-9)
  var kpiLabels = [
    'Total New Leads',
    'Leads Today',
    'Leads This Week',
    'Leads This Month',
    'Missing Docs',
    'Awaiting Follow-Up',
    'Human Review'
  ];

  for (var i = 0; i < kpiLabels.length; i++) {
    sheet.getRange(5, i + 1).setValue(kpiLabels[i]);
  }

  // Add secondary KPI labels
  sheet.getRange('A7').setValue('RV Park Leads');
  sheet.getRange('B7').setValue('Campground Leads');
  sheet.getRange('C7').setValue('Resort Leads');
  sheet.getRange('D7').setValue('Seller Financing Mentions');
  sheet.getRange('E7').setValue('% Missing Docs');
  sheet.getRange('F7').setValue('% Human Review');
  sheet.getRange('G7').setValue('Leads Added (Last 7 Days)');

  // SECTION C — Status Breakdown (Rows 10-17)
  sheet.getRange('A10:C10').merge().setValue('INTAKE STATUS SUMMARY');
  sheet.getRange('A11').setValue('Status');
  sheet.getRange('B11').setValue('Count');
  sheet.getRange('C11').setValue('% of Total');

  var statuses = [
    'New',
    'In Progress',
    'Waiting on Docs',
    'Ready for Review',
    'Human Review Needed',
    'Completed'
  ];

  for (var i = 0; i < statuses.length; i++) {
    sheet.getRange(12 + i, 1).setValue(statuses[i]);
  }

  // SECTION D — Missing Docs / Follow-Up Monitoring (Rows 18-40)
  sheet.getRange('A18:I18').merge().setValue('MISSING DOCS & FOLLOW-UP MONITORING');

  var summaryLabels = [
    'Total Missing Docs:',
    'Waiting >3 Days:',
    'No Follow-up Sent:',
    'Follow-up Sent:',
    'Needs Immediate Attention:'
  ];

  for (var i = 0; i < summaryLabels.length; i++) {
    sheet.getRange(19 + i, 1).setValue(summaryLabels[i]);
  }

  // Exception table headers
  var exceptionHeaders = [
    'Lead ID',
    'Property Name',
    'City',
    'Broker Name',
    'Date Received',
    'Days Since',
    'Missing Docs List',
    'Follow-Up Status',
    'Human Review'
  ];

  for (var i = 0; i < exceptionHeaders.length; i++) {
    sheet.getRange(25, i + 1).setValue(exceptionHeaders[i]);
  }

  // SECTION E — Human Review Queue (Rows 42-62)
  sheet.getRange('A42:I42').merge().setValue('HUMAN REVIEW QUEUE (Priority Items)');

  var reviewHeaders = [
    'Lead ID',
    'Date Received',
    'Property Name',
    'Asset Type',
    'Asking Price',
    'Broker Name',
    'Intake Status',
    'Flag Reason',
    'Notes'
  ];

  for (var i = 0; i < reviewHeaders.length; i++) {
    sheet.getRange(43, i + 1).setValue(reviewHeaders[i]);
  }

  // SECTION F — Asset Type Breakdown (Rows 64-72)
  sheet.getRange('A64:C64').merge().setValue('ASSET TYPE BREAKDOWN');
  sheet.getRange('A65').setValue('Asset Type');
  sheet.getRange('B65').setValue('Count');
  sheet.getRange('C65').setValue('% of Total');

  var assetTypes = ['RV Park', 'Campground', 'Resort'];
  for (var i = 0; i < assetTypes.length; i++) {
    sheet.getRange(66 + i, 1).setValue(assetTypes[i]);
  }

  // SECTION G — Recent Leads Snapshot (Rows 74-94)
  sheet.getRange('A74:I74').merge().setValue('RECENT LEADS (Last 30 Days)');

  var recentHeaders = [
    'Date Received',
    'Property Name',
    'City',
    'State',
    'Asset Type',
    'Asking Price',
    'Intake Status',
    'Missing Docs',
    'Human Review'
  ];

  for (var i = 0; i < recentHeaders.length; i++) {
    sheet.getRange(75, i + 1).setValue(recentHeaders[i]);
  }

  Logger.log('Dashboard layout structure created');
}

/**
 * Apply formatting to the dashboard
 */
function applyFormatting() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);

  if (!sheet) {
    throw new Error('Dashboard sheet not found');
  }

  // Header formatting
  sheet.getRange('A1:G1').setFontSize(18).setFontWeight('bold')
    .setBackground(CONFIG.FORMATTING.COLORS.HEADER_BACKGROUND)
    .setFontColor('#FFFFFF');

  sheet.getRange('A2:G2').setFontSize(11).setFontStyle('italic')
    .setBackground(CONFIG.FORMATTING.COLORS.HEADER_BACKGROUND)
    .setFontColor('#CCCCCC');

  sheet.getRange('A3:B3').setBackground('#f9f9f9');

  // KPI cards formatting
  sheet.getRange('A5:G5').setFontWeight('bold')
    .setBackground(CONFIG.FORMATTING.COLORS.SECTION_HEADER_BACKGROUND);

  sheet.getRange('A6:G6').setFontSize(16).setFontWeight('bold')
    .setBackground(CONFIG.FORMATTING.COLORS.KPI_BACKGROUND)
    .setHorizontalAlignment('center');

  sheet.getRange('A7:G7').setFontWeight('bold')
    .setBackground(CONFIG.FORMATTING.COLORS.TABLE_HEADER_BACKGROUND)
    .setHorizontalAlignment('center');

  // Section headers
  var sectionRanges = ['A10:C10', 'A18:I18', 'A42:I42', 'A64:C64', 'A74:I74'];
  sectionRanges.forEach(function(range) {
    sheet.getRange(range).setFontWeight('bold')
      .setBackground(CONFIG.FORMATTING.COLORS.SECTION_HEADER_BACKGROUND);
  });

  // Table headers
  var tableHeaderRanges = ['A11:C11', 'A25:I25', 'A43:I43', 'A65:C65', 'A75:I75'];
  tableHeaderRanges.forEach(function(range) {
    sheet.getRange(range).setFontWeight('bold')
      .setBackground(CONFIG.FORMATTING.COLORS.TABLE_HEADER_BACKGROUND);
  });

  // Set column widths
  var columnWidths = [100, 150, 100, 120, 100, 120, 120, 120, 200];
  for (var i = 0; i < columnWidths.length; i++) {
    sheet.setColumnWidth(i + 1, columnWidths[i]);
  }

  // Freeze panes
  sheet.setFrozenRows(1);

  Logger.log('Dashboard formatting applied');
}

/**
 * Set up data validation rules
 */
function setupDataValidation() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var leadsSheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);

  if (!leadsSheet) {
    throw new Error('Leads Database sheet not found');
  }

  // Asset Type validation (Column H)
  var assetTypeRange = leadsSheet.getRange('H2:H1000');
  var assetTypeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.ASSET_TYPES)
    .setAllowInvalid(false)
    .build();
  assetTypeRange.setDataValidation(assetTypeRule);

  // Intake Status validation (Column W)
  var intakeStatusRange = leadsSheet.getRange('W2:W1000');
  var intakeStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.INTAKE_STATUSES)
    .setAllowInvalid(false)
    .build();
  intakeStatusRange.setDataValidation(intakeStatusRule);

  // Follow-Up Status validation (Column X)
  var followUpStatusRange = leadsSheet.getRange('X2:X1000');
  var followUpStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.FOLLOW_UP_STATUSES)
    .setAllowInvalid(false)
    .build();
  followUpStatusRange.setDataValidation(followUpStatusRule);

  Logger.log('Data validation rules set up');
}

/**
 * Set up triggers for automated functions
 */
function setupTriggers() {
  // Delete existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });

  // Set up onOpen trigger
  ScriptApp.newTrigger('onOpen')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onOpen()
    .create();

  Logger.log('Triggers set up');
}

/**
 * Add sample data for testing (optional)
 */
function addSampleData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var leadsSheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);

  if (!leadsSheet) {
    return;
  }

  // Check if sheet already has data
  var existingData = leadsSheet.getDataRange().getValues();
  if (existingData.length > 1) {
    Logger.log('Sample data not added - sheet already contains data');
    return;
  }

  // Add a few sample leads
  var sampleData = [
    [
      generateLeadId(),
      new Date(),
      new Date(),
      'Sunset RV Resort',
      '1234 Desert Blvd',
      'Phoenix',
      'AZ',
      'RV Park',
      2500000,
      150,
      45,
      425000,
      '92%',
      'John Smith',
      '(602) 555-0123',
      'Mary Johnson',
      'mary.j@broker.com',
      'Yes',
      false,
      '',
      false,
      '150-site RV park in Phoenix metro, performing well',
      'New',
      'No Follow-up Sent',
      false,
      '',
      'Sarah',
      'Good initial lead'
    ],
    [
      generateLeadId(),
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      new Date(),
      'Pine Valley Campground',
      '5678 Forest Ln',
      'Denver',
      'CO',
      'Campground',
      1800000,
      87,
      32,
      280000,
      '78%',
      'Jennifer Davis',
      '(303) 555-0456',
      'Robert Lee',
      'robert.lee@company.com',
      'No',
      true,
      'Broker Agreement, Financing Details',
      false,
      'Seasonal campground in CO Rockies, good reviews',
      'Waiting on Docs',
      'Follow-up Sent',
      false,
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      'Mark',
      'Waiting for updated financials'
    ]
  ];

  // Add sample data starting from row 2
  leadsSheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData);

  Logger.log('Sample data added to Leads Database');
}

/**
 * Reset dashboard to initial state
 */
function resetDashboard() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert(
    'Reset Dashboard',
    'This will clear all data and reset the dashboard to initial state. Are you sure?',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    try {
      var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

      // Delete and recreate sheets
      var leadsSheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);
      if (leadsSheet) {
        spreadsheet.deleteSheet(leadsSheet);
      }

      var dashboardSheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);
      if (dashboardSheet) {
        spreadsheet.deleteSheet(dashboardSheet);
      }

      // Run setup again
      setupDashboard();

      ui.alert('Dashboard has been reset to initial state.');

    } catch (error) {
      Logger.log('Error resetting dashboard: ' + error.toString());
      ui.alert('Error resetting dashboard: ' + error.toString());
    }
  }
}

/**
 * Add setup option to menu
 */
function onOpen() {
  CONFIG = getConfig();

  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Dashboard Setup')
    .addItem('Complete Setup', 'setupDashboard')
    .addItem('Reset Dashboard', 'resetDashboard')
    .addToUi();
}
