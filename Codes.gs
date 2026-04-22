/**
 * Code.gs - Main Google Apps Script file for Keystone Acquisitions Dashboard
 *
 * This file contains the main functions, triggers, and menu handlers for the
 * New Leads Dashboard. It provides automated functionality to enhance the
 * spreadsheet dashboard.
 *
 * Features:
 * - Custom menu in Google Sheets
 * - Automated email notifications
 * - Data validation and cleanup
 * - Dashboard refresh functionality
 * - Lead status updates
 * - Follow-up reminders
 */

// Global variables
var CONFIG;

/**
 * onOpen trigger - runs when the spreadsheet is opened
 * Adds custom menu to the Google Sheets UI
 */
function onOpen() {
  CONFIG = getConfig();

  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Dashboard Tools')
    .addItem('Refresh Dashboard', 'refreshDashboard')
    .addItem('Send Follow-up Reminders', 'sendFollowUpReminders')
    .addItem('Update Lead Statuses', 'updateLeadStatuses')
    .addSeparator()
    .addItem('Validate Data', 'validateData')
    .addItem('Clean Up Data', 'cleanUpData')
    .addSeparator()
    .addItem('Send Daily Summary', 'sendDailySummary')
    .addItem('Export Report', 'exportReport')
    .addToUi();

  Logger.log('Dashboard Tools menu added');
}

/**
 * Refresh Dashboard - recalculates all formulas and updates timestamps
 */
function refreshDashboard() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var dashboardSheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);

    if (!dashboardSheet) {
      throw new Error('Dashboard sheet not found: ' + CONFIG.DASHBOARD_SHEET_NAME);
    }

    // Force recalculation by temporarily changing a cell
    var tempCell = dashboardSheet.getRange('A1');
    var originalValue = tempCell.getValue();
    tempCell.setValue('REFRESH');
    SpreadsheetApp.flush();
    tempCell.setValue(originalValue);

    // Update last updated timestamp
    var timestampCell = dashboardSheet.getRange('B3');
    timestampCell.setValue(new Date());

    SpreadsheetApp.getUi().alert('Dashboard refreshed successfully!');
    Logger.log('Dashboard refreshed at: ' + new Date());

  } catch (error) {
    Logger.log('Error refreshing dashboard: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error refreshing dashboard: ' + error.toString());
  }
}

/**
 * Send Follow-up Reminders - emails brokers about missing documents
 */
function sendFollowUpReminders() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var leadsSheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);

    if (!leadsSheet) {
      throw new Error('Leads sheet not found: ' + CONFIG.LEADS_SHEET_NAME);
    }

    var data = leadsSheet.getDataRange().getValues();
    var headers = data[0];
    var remindersSent = 0;

    // Find column indices
    var colIndices = getColumnIndices(headers);

    // Process each lead (skip header row)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];

      // Check if lead needs follow-up
      var missingDocs = row[colIndices.missingDocsFlag];
      var followUpStatus = row[colIndices.followUpStatus];
      var lastFollowUp = row[colIndices.lastFollowUpDate];
      var brokerEmail = row[colIndices.senderEmail];
      var brokerName = row[colIndices.brokerName];
      var propertyName = row[colIndices.propertyName];
      var missingDocsList = row[colIndices.missingDocsList];

      if (missingDocs === true && followUpStatus !== 'Completed' && brokerEmail) {
        // Check if it's been more than 3 days since last follow-up
        var daysSinceFollowUp = getDaysSinceLastFollowUp(lastFollowUp);

        if (daysSinceFollowUp >= 3) {
          // Send reminder email
          sendFollowUpEmail(brokerEmail, brokerName, propertyName, missingDocsList);
          remindersSent++;

          // Update last follow-up date
          leadsSheet.getRange(i + 1, colIndices.lastFollowUpDate + 1).setValue(new Date());
          leadsSheet.getRange(i + 1, colIndices.followUpStatus + 1).setValue('Follow-up Sent');
        }
      }
    }

    SpreadsheetApp.getUi().alert('Follow-up reminders sent: ' + remindersSent);
    Logger.log('Follow-up reminders sent: ' + remindersSent);

  } catch (error) {
    Logger.log('Error sending follow-up reminders: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error sending follow-up reminders: ' + error.toString());
  }
}

/**
 * Update Lead Statuses - automatically update statuses based on conditions
 */
function updateLeadStatuses() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var leadsSheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);

    if (!leadsSheet) {
      throw new Error('Leads sheet not found: ' + CONFIG.LEADS_SHEET_NAME);
    }

    var data = leadsSheet.getDataRange().getValues();
    var headers = data[0];
    var updatesMade = 0;

    // Find column indices
    var colIndices = getColumnIndices(headers);

    // Process each lead (skip header row)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var currentStatus = row[colIndices.intakeStatus];
      var missingDocs = row[colIndices.missingDocsFlag];
      var humanReview = row[colIndices.humanReviewFlag];
      var followUpStatus = row[colIndices.followUpStatus];
      var dateReceived = row[colIndices.dateReceived];

      var newStatus = currentStatus;

      // Auto-update logic
      if (humanReview === true && currentStatus !== 'Human Review Needed') {
        newStatus = 'Human Review Needed';
      } else if (missingDocs === true && currentStatus === 'New') {
        newStatus = 'Waiting on Docs';
      } else if (missingDocs === false && followUpStatus === 'Completed' && currentStatus === 'Waiting on Docs') {
        newStatus = 'Ready for Review';
      }

      // Check for stale leads (>30 days old)
      if (dateReceived && getDaysSinceDate(dateReceived) > 30 && currentStatus !== 'Completed') {
        newStatus = 'Human Review Needed'; // Flag for review
      }

      // Update if status changed
      if (newStatus !== currentStatus) {
        leadsSheet.getRange(i + 1, colIndices.intakeStatus + 1).setValue(newStatus);
        updatesMade++;
        Logger.log('Updated lead ' + row[colIndices.leadId] + ' status from ' + currentStatus + ' to ' + newStatus);
      }
    }

    SpreadsheetApp.getUi().alert('Lead statuses updated: ' + updatesMade);
    Logger.log('Lead statuses updated: ' + updatesMade);

  } catch (error) {
    Logger.log('Error updating lead statuses: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error updating lead statuses: ' + error.toString());
  }
}

/**
 * Validate Data - check for data integrity issues
 */
function validateData() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var leadsSheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);

    if (!leadsSheet) {
      throw new Error('Leads sheet not found: ' + CONFIG.LEADS_SHEET_NAME);
    }

    var data = leadsSheet.getDataRange().getValues();
    var headers = data[0];
    var issues = [];

    // Find column indices
    var colIndices = getColumnIndices(headers);

    // Validate each row
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var leadId = row[colIndices.leadId];

      // Check required fields
      if (!leadId) {
        issues.push('Row ' + (i + 1) + ': Missing Lead ID');
      }

      if (!row[colIndices.dateReceived]) {
        issues.push('Row ' + (i + 1) + ' (' + leadId + '): Missing Date Received');
      }

      if (!row[colIndices.propertyName]) {
        issues.push('Row ' + (i + 1) + ' (' + leadId + '): Missing Property Name');
      }

      if (!row[colIndices.assetType]) {
        issues.push('Row ' + (i + 1) + ' (' + leadId + '): Missing Asset Type');
      }

      // Validate asset type
      var assetType = row[colIndices.assetType];
      if (assetType && !['RV Park', 'Campground', 'Resort'].includes(assetType)) {
        issues.push('Row ' + (i + 1) + ' (' + leadId + '): Invalid Asset Type: ' + assetType);
      }

      // Validate email format
      var email = row[colIndices.senderEmail];
      if (email && !isValidEmail(email)) {
        issues.push('Row ' + (i + 1) + ' (' + leadId + '): Invalid email format: ' + email);
      }

      // Check for missing docs without list
      if (row[colIndices.missingDocsFlag] === true && !row[colIndices.missingDocsList]) {
        issues.push('Row ' + (i + 1) + ' (' + leadId + '): Missing docs flagged but no list provided');
      }
    }

    // Show results
    if (issues.length === 0) {
      SpreadsheetApp.getUi().alert('✅ Data validation passed! No issues found.');
    } else {
      var message = '⚠️ Data validation found ' + issues.length + ' issues:\n\n' +
                   issues.slice(0, 10).join('\n'); // Show first 10 issues

      if (issues.length > 10) {
        message += '\n\n... and ' + (issues.length - 10) + ' more issues.';
      }

      SpreadsheetApp.getUi().alert(message);
    }

    Logger.log('Data validation completed. Issues found: ' + issues.length);

  } catch (error) {
    Logger.log('Error validating data: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error validating data: ' + error.toString());
  }
}

/**
 * Clean Up Data - remove duplicates, fix formatting, etc.
 */
function cleanUpData() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var leadsSheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET_NAME);

    if (!leadsSheet) {
      throw new Error('Leads sheet not found: ' + CONFIG.LEADS_SHEET_NAME);
    }

    var data = leadsSheet.getDataRange().getValues();
    var headers = data[0];
    var changes = 0;

    // Find column indices
    var colIndices = getColumnIndices(headers);

    // Clean up each row
    for (var i = 1; i < data.length; i++) {
      var row = data[i];

      // Trim whitespace from text fields
      var textFields = [
        colIndices.leadId,
        colIndices.propertyName,
        colIndices.address,
        colIndices.city,
        colIndices.state,
        colIndices.brokerName,
        colIndices.senderName,
        colIndices.senderEmail,
        colIndices.attachmentsReceived,
        colIndices.missingDocsList,
        colIndices.summaryOfOpportunity,
        colIndices.assignedTo,
        colIndices.notes
      ];

      textFields.forEach(function(colIndex) {
        if (row[colIndex] && typeof row[colIndex] === 'string') {
          var cleaned = row[colIndex].trim();
          if (cleaned !== row[colIndex]) {
            leadsSheet.getRange(i + 1, colIndex + 1).setValue(cleaned);
            changes++;
          }
        }
      });

      // Standardize state abbreviations
      var state = row[colIndices.state];
      if (state) {
        var standardizedState = standardizeState(state);
        if (standardizedState !== state) {
          leadsSheet.getRange(i + 1, colIndices.state + 1).setValue(standardizedState);
          changes++;
        }
      }

      // Format phone numbers
      var phone = row[colIndices.brokerPhone];
      if (phone) {
        var formattedPhone = formatPhoneNumber(phone);
        if (formattedPhone !== phone) {
          leadsSheet.getRange(i + 1, colIndices.brokerPhone + 1).setValue(formattedPhone);
          changes++;
        }
      }
    }

    SpreadsheetApp.getUi().alert('Data cleanup completed! ' + changes + ' changes made.');
    Logger.log('Data cleanup completed. Changes made: ' + changes);

  } catch (error) {
    Logger.log('Error cleaning up data: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error cleaning up data: ' + error.toString());
  }
}

/**
 * Send Daily Summary - email summary of dashboard metrics
 */
function sendDailySummary() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var dashboardSheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);

    if (!dashboardSheet) {
      throw new Error('Dashboard sheet not found: ' + CONFIG.DASHBOARD_SHEET_NAME);
    }

    // Get key metrics
    var totalLeads = dashboardSheet.getRange('A6').getValue();
    var leadsToday = dashboardSheet.getRange('B6').getValue();
    var leadsThisWeek = dashboardSheet.getRange('C6').getValue();
    var missingDocs = dashboardSheet.getRange('E6').getValue();
    var humanReview = dashboardSheet.getRange('G6').getValue();

    // Get status breakdown
    var statusData = {};
    for (var i = 12; i <= 17; i++) {
      var status = dashboardSheet.getRange('A' + i).getValue();
      var count = dashboardSheet.getRange('B' + i).getValue();
      statusData[status] = count;
    }

    // Build email content
    var subject = 'Daily Lead Intake Summary - ' + formatDate(new Date());

    var body = 'Keystone Acquisitions - Daily Lead Intake Summary\n\n' +
               'Date: ' + formatDate(new Date()) + '\n\n' +
               'KEY METRICS:\n' +
               '- Total Leads: ' + totalLeads + '\n' +
               '- Leads Today: ' + leadsToday + '\n' +
               '- Leads This Week: ' + leadsThisWeek + '\n' +
               '- Missing Docs: ' + missingDocs + '\n' +
               '- Human Review: ' + humanReview + '\n\n' +
               'STATUS BREAKDOWN:\n';

    for (var status in statusData) {
      body += '- ' + status + ': ' + statusData[status] + '\n';
    }

    body += '\nPlease review the dashboard for detailed information.\n' +
            'Dashboard Link: ' + spreadsheet.getUrl();

    // Send email
    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: subject,
      body: body
    });

    SpreadsheetApp.getUi().alert('Daily summary sent to: ' + CONFIG.NOTIFICATION_EMAIL);
    Logger.log('Daily summary sent to: ' + CONFIG.NOTIFICATION_EMAIL);

  } catch (error) {
    Logger.log('Error sending daily summary: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error sending daily summary: ' + error.toString());
  }
}

/**
 * Export Report - generate and email a detailed report
 */
function exportReport() {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Create a temporary sheet for the report
    var reportSheet = spreadsheet.getSheetByName('Report');
    if (!reportSheet) {
      reportSheet = spreadsheet.insertSheet('Report');
    } else {
      reportSheet.clear();
    }

    // Generate report content
    reportSheet.appendRow(['Keystone Acquisitions - Lead Intake Report']);
    reportSheet.appendRow(['Generated: ' + formatDate(new Date())]);
    reportSheet.appendRow(['']);

    // Get dashboard metrics
    var dashboardSheet = spreadsheet.getSheetByName(CONFIG.DASHBOARD_SHEET_NAME);
    var metrics = [
      ['Total Leads', dashboardSheet.getRange('A6').getValue()],
      ['Leads Today', dashboardSheet.getRange('B6').getValue()],
      ['Leads This Week', dashboardSheet.getRange('C6').getValue()],
      ['Missing Docs', dashboardSheet.getRange('E6').getValue()],
      ['Human Review', dashboardSheet.getRange('G6').getValue()],
      ['RV Parks', dashboardSheet.getRange('A7').getValue()],
      ['Campgrounds', dashboardSheet.getRange('B7').getValue()],
      ['Resorts', dashboardSheet.getRange('C7').getValue()]
    ];

    reportSheet.appendRow(['KEY METRICS']);
    metrics.forEach(function(metric) {
      reportSheet.appendRow(metric);
    });

    reportSheet.appendRow(['']);
    reportSheet.appendRow(['STATUS BREAKDOWN']);

    // Add status breakdown
    for (var i = 12; i <= 17; i++) {
      var status = dashboardSheet.getRange('A' + i).getValue();
      var count = dashboardSheet.getRange('B' + i).getValue();
      var percentage = dashboardSheet.getRange('C' + i).getValue();
      reportSheet.appendRow([status, count, percentage]);
    }

    // Format the report
    reportSheet.getRange('A1').setFontSize(14).setFontWeight('bold');
    reportSheet.getRange('A4').setFontWeight('bold');
    reportSheet.getRange('A13').setFontWeight('bold');

    // Export as PDF and email
    var pdfBlob = spreadsheet.getBlob().getAs('application/pdf');
    pdfBlob.setName('Lead_Intake_Report_' + formatDate(new Date()) + '.pdf');

    MailApp.sendEmail({
      to: CONFIG.NOTIFICATION_EMAIL,
      subject: 'Lead Intake Report - ' + formatDate(new Date()),
      body: 'Please find attached the latest lead intake report.',
      attachments: [pdfBlob]
    });

    // Clean up temporary sheet
    spreadsheet.deleteSheet(reportSheet);

    SpreadsheetApp.getUi().alert('Report exported and sent to: ' + CONFIG.NOTIFICATION_EMAIL);
    Logger.log('Report exported and sent to: ' + CONFIG.NOTIFICATION_EMAIL);

  } catch (error) {
    Logger.log('Error exporting report: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error exporting report: ' + error.toString());
  }
}

/**
 * Installable trigger for daily summary (call this once to set up)
 */
function createDailyTrigger() {
  // Delete existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'sendDailySummary') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new daily trigger
  ScriptApp.newTrigger('sendDailySummary')
    .timeBased()
    .everyDays(1)
    .atHour(8) // 8 AM
    .create();

  Logger.log('Daily summary trigger created');
}
