# Google Sheets Dashboard Setup Guide
## Keystone Acquisitions - New Leads Dashboard

**Last Updated:** April 21, 2026

---

## Quick Start Overview

This guide walks you through building a professional intake monitoring dashboard in Google Sheets. The dashboard pulls data from a "Leads Database" sheet and displays key metrics, status breakdowns, exceptions, and trends.

### What You'll Build
- **New Leads Dashboard** - Main monitoring sheet with KPIs, charts, and live tables
- **Leads Database** - Reference data structure (build this first with your actual lead data)

---

## Step 1: Create the Leads Database Sheet

First, create a sheet named exactly: **Leads Database**

### Required Columns (A through W)
Map your actual lead data to these columns:

| Column | Header | Data Type |
|--------|--------|-----------|
| A | Lead ID | Text |
| B | Date Received | Date |
| C | Date Entered | Date |
| D | Property Name | Text |
| E | Address | Text |
| F | City | Text |
| G | State | Text |
| H | Asset Type | Text (RV Park / Campground / Resort) |
| I | Asking Price | Number/Currency |
| J | Number of Units/Pads/Sites | Number |
| K | Acreage | Number |
| L | NOI | Number/Currency |
| M | Occupancy / Vacancy | Percentage |
| N | Broker Name | Text |
| O | Broker Phone | Text |
| P | Sender Name | Text |
| Q | Sender Email | Text |
| R | Attachments Received | Text |
| S | Missing Docs Flag | TRUE/FALSE |
| T | Missing Docs List | Text |
| U | Seller Financing Mention | TRUE/FALSE |
| V | Summary of Opportunity | Text |
| W | Intake Status | Dropdown (New / In Progress / Waiting on Docs / Ready for Review / Human Review Needed / Completed) |
| X | Follow-Up Status | Dropdown (No Follow-up Sent / Follow-up Sent / Follow-up in Progress / Completed) |
| Y | Human Review Flag | TRUE/FALSE |
| Z | Last Follow-Up Date | Date |
| AA | Assigned To | Text (Person's name or email) |
| AB | Notes | Text |

**Start entering real lead data in row 2** (row 1 has headers)

---

## Step 2: Create the New Leads Dashboard Sheet

1. In the same Google Sheet, create a new sheet named: **New Leads Dashboard**
2. Leave it blank — you'll build the dashboard layout in this sheet

---

## Step 3: Build the Dashboard Layout

Use the exact row/column layout below. All formulas are designed for a **Leads Database** sheet name (easily adjustable if you rename the sheet).

### SECTION A — Header (Rows 1-3)

**Row 1, Column A (merged A1:G1):**
```
New Leads Dashboard
```
- Font: Bold, 18pt, Dark blue (#1a3a5f or similar)

**Row 2, Column A (merged A2:G2):**
```
Keystone Acquisitions Intake Monitoring
```
- Font: 11pt, Gray, italic

**Row 3, Column A:**
```
Last Updated:
```

**Row 3, Column B:**
```
=TEXT(NOW(),"MMM DD, YYYY at h:mm AM/PM")
```
- This auto-updates whenever the sheet recalculates

---

### SECTION B — KPI Cards (Rows 5-9)

These cards should have background colors and strong borders to stand out.

**Row 5 Headers** (left-align, bold, 10pt, light background #f0f0f0):
- A5: `Total New Leads`
- B5: `Leads Today`
- C5: `Leads This Week`
- D5: `Leads This Month`
- E5: `Missing Docs`
- F5: `Awaiting Follow-Up`
- G5: `Human Review`

**Row 6 Formulas** (large font 14pt, bold, center-aligned, white background):

**A6:** Total New Leads (all time)
```
=COUNTA('Leads Database'!A2:A)
```

**B6:** Leads Received Today
```
=COUNTIFS('Leads Database'!B:B,TODAY())
```

**C6:** Leads Received This Week (last 7 days including today)
```
=COUNTIFS('Leads Database'!B:B,">="&TODAY()-6,'Leads Database'!B:B,"<="&TODAY())
```

**D6:** Leads Received This Month
```
=COUNTIFS('Leads Database'!B:B,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),'Leads Database'!B:B,"<="&TODAY())
```

**E6:** Leads Missing Docs
```
=COUNTIF('Leads Database'!S:S,TRUE)
```

**F6:** Leads Awaiting Follow-Up (Missing Docs Flag = TRUE AND Follow-Up Status not "Completed")
```
=COUNTIFS('Leads Database'!S:S,TRUE,'Leads Database'!X:X,"<>Completed")
```

**G6:** Leads Flagged for Human Review
```
=COUNTIF('Leads Database'!Y:Y,TRUE)
```

**Row 7 — Additional KPI Row** (repeat similar format):

**A7:** RV Park Leads
```
=COUNTIF('Leads Database'!H:H,"RV Park")
```

**B7:** Campground Leads
```
=COUNTIF('Leads Database'!H:H,"Campground")
```

**C7:** Resort Leads
```
=COUNTIF('Leads Database'!H:H,"Resort")
```

**D7:** Seller Financing Mentions
```
=COUNTIF('Leads Database'!U:U,TRUE)
```

**E7:** % Missing Docs
```
=IF(A6=0,0,ROUND(E6/A6*100,1))&"%"
```

**F7:** % Human Review
```
=IF(A6=0,0,ROUND(G6/A6*100,1))&"%"
```

**G7:** Leads Added (Last 7 Days)
```
=C6
```

---

### SECTION C — Status Breakdown (Rows 10-16)

**Row 10:** Section header
```
INTAKE STATUS SUMMARY
```
- Bold, 11pt, Dark background

**Row 11 Headers:**
- A11: `Status`
- B11: `Count`
- C11: `% of Total`

**Row 12-17 Statuses** (Pull dynamically):

**A12:** `New`
**B12:** `=COUNTIF('Leads Database'!W:W,"New")`
**C12:** `=IF($B$6=0,0,ROUND(B12/$B$6*100,1))&"%"`

**A13:** `In Progress`
**B13:** `=COUNTIF('Leads Database'!W:W,"In Progress")`
**C13:** `=IF($B$6=0,0,ROUND(B13/$B$6*100,1))&"%"`

**A14:** `Waiting on Docs`
**B14:** `=COUNTIF('Leads Database'!W:W,"Waiting on Docs")`
**C14:** `=IF($B$6=0,0,ROUND(B14/$B$6*100,1))&"%"`

**A15:** `Ready for Review`
**B15:** `=COUNTIF('Leads Database'!W:W,"Ready for Review")`
**C15:** `=IF($B$6=0,0,ROUND(B15/$B$6*100,1))&"%"`

**A16:** `Human Review Needed`
**B16:** `=COUNTIF('Leads Database'!W:W,"Human Review Needed")`
**C16:** `=IF($B$6=0,0,ROUND(B16/$B$6*100,1))&"%"`

**A17:** `Completed`
**B17:** `=COUNTIF('Leads Database'!W:W,"Completed")`
**C17:** `=IF($B$6=0,0,ROUND(B17/$B$6*100,1))&"%"`

---

### SECTION D — Missing Docs / Follow-Up Monitoring (Rows 18-40)

**Row 18:** Section header
```
MISSING DOCS & FOLLOW-UP MONITORING
```

**Row 19 Summary Metrics:**
- A19: `Total Missing Docs:` | B19: `=E6` (pulled from KPI)
- A20: `Waiting >3 Days:` | B20: See formula below
- A21: `No Follow-up Sent:` | B21: See formula below
- A22: `Follow-up Sent:` | B22: See formula below
- A23: `Needs Immediate Attention:` | B23: See formula below

**B20 Formula** (Missing docs AND Date Received > 3 days ago AND no follow-up):
```
=COUNTIFS('Leads Database'!S:S,TRUE,'Leads Database'!B:B,"<"&TODAY()-3,'Leads Database'!X:X,"No Follow-up Sent")
```

**B21 Formula** (Missing docs AND Follow-Up Status = "No Follow-up Sent"):
```
=COUNTIFS('Leads Database'!S:S,TRUE,'Leads Database'!X:X,"No Follow-up Sent")
```

**B22 Formula** (Missing docs AND Follow-Up Status contains "Sent" or "in Progress"):
```
=COUNTIFS('Leads Database'!S:S,TRUE,'Leads Database'!X:X,"<>No Follow-up Sent",'Leads Database'!X:X,"<>Completed")
```

**B23 Formula** (Priority = Missing docs > 3 days + no follow-up OR Human Review Flag):
```
=COUNTIFS('Leads Database'!S:S,TRUE,'Leads Database'!B:B,"<"&TODAY()-3,'Leads Database'!X:X,"No Follow-up Sent")+COUNTIF('Leads Database'!Y:Y,TRUE)
```

**Row 25 — Exception Table Header** (bold, background color):
| Column | Header |
|--------|--------|
| A25 | `Lead ID` |
| B25 | `Property Name` |
| C25 | `City` |
| D25 | `Broker Name` |
| E25 | `Date Received` |
| F25 | `Days Since Received` |
| G25 | `Missing Docs List` |
| H25 | `Follow-Up Status` |
| I25 | `Human Review` |

**Row 26-40 — Exception Table Data** (Use FILTER to auto-populate):

**A26:A40 (Lead ID):**
```
=IFERROR(FILTER('Leads Database'!A:A,('Leads Database'!S:S=TRUE),('Leads Database'!X:X<>"Completed")),"")
```

**B26:B40 (Property Name):**
```
=IFERROR(FILTER('Leads Database'!D:D,('Leads Database'!S:S=TRUE),('Leads Database'!X:X<>"Completed")),"")
```

**C26:C40 (City):**
```
=IFERROR(FILTER('Leads Database'!F:F,('Leads Database'!S:S=TRUE),('Leads Database'!X:X<>"Completed")),"")
```

**D26:D40 (Broker Name):**
```
=IFERROR(FILTER('Leads Database'!N:N,('Leads Database'!S:S=TRUE),('Leads Database'!X:X<>"Completed")),"")
```

**E26:E40 (Date Received):**
```
=IFERROR(FILTER('Leads Database'!B:B,('Leads Database'!S:S=TRUE),('Leads Database'!X:X<>"Completed")),"")
```

**F26:F40 (Days Since Received):**
```
=IF(A26="","",TODAY()-E26)
```

**G26:G40 (Missing Docs List):**
```
=IFERROR(FILTER('Leads Database'!T:T,('Leads Database'!S:S=TRUE),('Leads Database'!X:X<>"Completed")),"")
```

**H26:H40 (Follow-Up Status):**
```
=IFERROR(FILTER('Leads Database'!X:X,('Leads Database'!S:S=TRUE),('Leads Database'!X:X<>"Completed")),"")
```

**I26:I40 (Human Review):**
```
=IFERROR(FILTER('Leads Database'!Y:Y,('Leads Database'!S:S=TRUE),('Leads Database'!X:X<>"Completed")),"")
```

---

### SECTION E — Human Review Queue (Rows 42-62)

**Row 42:** Section header
```
HUMAN REVIEW QUEUE (Priority Items)
```

**Row 43 Table Headers:**
| Column | Header |
|--------|--------|
| A43 | `Lead ID` |
| B43 | `Date Received` |
| C43 | `Property Name` |
| D43 | `Asset Type` |
| E43 | `Asking Price` |
| F43 | `Broker Name` |
| G43 | `Intake Status` |
| H43 | `Flag Reason` |
| I43 | `Notes` |

**Row 44-62 — Human Review Table**:

**A44:A62 (Lead ID):**
```
=IFERROR(FILTER('Leads Database'!A:A,('Leads Database'!Y:Y=TRUE)),"")
```

**B44:B62 (Date Received):**
```
=IFERROR(FILTER('Leads Database'!B:B,('Leads Database'!Y:Y=TRUE)),"")
```

**C44:C62 (Property Name):**
```
=IFERROR(FILTER('Leads Database'!D:D,('Leads Database'!Y:Y=TRUE)),"")
```

**D44:D62 (Asset Type):**
```
=IFERROR(FILTER('Leads Database'!H:H,('Leads Database'!Y:Y=TRUE)),"")
```

**E44:E62 (Asking Price):**
```
=IFERROR(FILTER('Leads Database'!I:I,('Leads Database'!Y:Y=TRUE)),"")
```

**F44:F62 (Broker Name):**
```
=IFERROR(FILTER('Leads Database'!N:N,('Leads Database'!Y:Y=TRUE)),"")
```

**G44:G62 (Intake Status):**
```
=IFERROR(FILTER('Leads Database'!W:W,('Leads Database'!Y:Y=TRUE)),"")
```

**H44:H62 (Flag Reason - Explanation):**
```
=IF(A44="","","Check Notes")
```

**I44:I62 (Notes):**
```
=IFERROR(FILTER('Leads Database'!AB:AB,('Leads Database'!Y:Y=TRUE)),"")
```

---

### SECTION F — Asset Type Breakdown (Rows 64-72)

**Row 64:** Section header
```
ASSET TYPE BREAKDOWN
```

**Row 65 Headers:**
| Column | Header |
|--------|--------|
| A65 | `Asset Type` |
| B65 | `Count` |
| C65 | `% of Total` |

**Row 66-68 — Data:**

**A66:** `RV Park` | **B66:** `=COUNTIF('Leads Database'!H:H,"RV Park")` | **C66:** `=IF($B$6=0,0,ROUND(B66/$B$6*100,1))&"%"`

**A67:** `Campground` | **B67:** `=COUNTIF('Leads Database'!H:H,"Campground")` | **C67:** `=IF($B$6=0,0,ROUND(B67/$B$6*100,1))&"%"`

**A68:** `Resort` | **B68:** `=COUNTIF('Leads Database'!H:H,"Resort")` | **C68:** `=IF($B$6=0,0,ROUND(B68/$B$6*100,1))&"%"`

---

### SECTION G — Recent Leads Snapshot (Rows 74-94)

**Row 74:** Section header
```
RECENT LEADS (Last 30 Days)
```

**Row 75 Table Headers:**
| Column | Header |
|--------|--------|
| A75 | `Date Received` |
| B75 | `Property Name` |
| C75 | `City` |
| D75 | `State` |
| E75 | `Asset Type` |
| F75 | `Asking Price` |
| G75 | `Intake Status` |
| H75 | `Missing Docs` |
| I75 | `Human Review` |

**Row 76-94 — Recent Leads Data** (sorted by Date Received, most recent first):

**A76:A94:**
```
=IFERROR(FILTER('Leads Database'!B:B,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),"")
```

For columns B-I, use FILTER with SORT to match the same filtered, sorted result:

**B76:B94:**
```
=IFERROR(FILTER('Leads Database'!D:D,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),"")
```

**C76:C94:**
```
=IFERROR(FILTER('Leads Database'!F:F,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),"")
```

**D76:D94:**
```
=IFERROR(FILTER('Leads Database'!G:G,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),"")
```

**E76:E94:**
```
=IFERROR(FILTER('Leads Database'!H:H,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),"")
```

**F76:F94:**
```
=IFERROR(FILTER('Leads Database'!I:I,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),"")
```

**G76:G94:**
```
=IFERROR(FILTER('Leads Database'!W:W,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),"")
```

**H76:H94:**
```
=IF(A76="","",IF(IFERROR(INDEX(FILTER('Leads Database'!S:S,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),ROW()-75),FALSE),TRUE,FALSE))
```

**I76:I94:**
```
=IF(A76="","",IF(IFERROR(INDEX(FILTER('Leads Database'!Y:Y,('Leads Database'!B:B>TODAY()-30),SORT('Leads Database'!B:B,FALSE)),ROW()-75),FALSE),TRUE,FALSE))
```

---

## Step 4: Add Charts

Add the following charts to regions on the right side or below the tables (recommended: rows 5-40, columns L-S):

### Chart 1: Lead Volume by Week (Line Chart)
- Data: Count of leads by week in last 8 weeks
- Formula: Create a helper table or use QUERY to aggregate by week
- Title: "Weekly Lead Volume Trend"

### Chart 2: Asset Type Distribution (Pie Chart)
- Data: RV Park / Campground / Resort counts (use formulas from Section F)
- Title: "Leads by Asset Type"

### Chart 3: Intake Status Breakdown (Bar Chart)
- Data: Counts from Status Breakdown section (Section C)
- Title: "Lead Status Distribution"

### Chart 4: Missing Docs vs Complete (Pie Chart)
- Data: Two values:
  - Missing Docs: `=E6`
  - Complete: `=A6-E6`
- Title: "Documentation Status"

### Chart 5: Human Review Count (Gauge or Single Metric)
- Data: `=G6`
- Title: "Leads Requiring Human Review"

---

## Step 5: Apply Formatting

### Colors & Styling:

**Header Section:**
- Background: Dark blue (#1a3a5f)
- Text: White, bold

**KPI Cards:**
- Background: Light blue (#e8f1f8)
- Border: Dark blue, 2px
- Text: Dark blue, bold 14pt

**Section Headers:**
- Background: Medium gray (#d3d3d3)
- Text: Dark, bold 11pt

**Exception Tables & Data Tables:**
- Header Row: Background #f0f0f0, bold
- Data Rows: Alternating white / light gray (#f9f9f9)
- Border: Light gray

**Conditional Formatting (Critical):**

1. **Missing Docs Flag Column (H26:I40 in Exception Table)**
   - If TRUE: Background = amber/orange (#f9c448 or #ffd966)
   - Font: Bold, dark

2. **Human Review Flag (I44:I62 in Human Review Table)**
   - If TRUE: Background = red (#f4cccc)
   - Font: Bold, dark

3. **Days Since Received (F26:F40 in Exception Table)**
   - If >= 5 days: Background = orange (#f9c448)
   - If >= 10 days: Background = red (#f4cccc)

4. **Recent Leads (H76:I94)**
   - Missing Docs = TRUE: Background amber
   - Human Review = TRUE: Background red

### Freeze Panes:
- Freeze row 1 (Header)
- Optionally freeze column A (for row labels in data tables)

### Column Widths:
- Adjust for readability:
  - Lead ID: 80px
  - Property Name: 180px
  - Broker Name: 150px
  - Missing Docs List: 200px
  - Notes: 250px

---

## Step 6: Set Up Data Validation (Optional)

In the **Leads Database** sheet, add data validation dropdowns:

**Column W (Intake Status):**
- Options: New, In Progress, Waiting on Docs, Ready for Review, Human Review Needed, Completed

**Column X (Follow-Up Status):**
- Options: No Follow-up Sent, Follow-up Sent, Follow-up in Progress, Completed

**Column H (Asset Type):**
- Options: RV Park, Campground, Resort

---

## Step 7: Daily Operations Checklist

Once your dashboard is live:

1. **Each day:** Open New Leads Dashboard first to see:
   - New leads received today
   - Missing docs waiting action
   - Leads flagged for human review

2. **Action Items:**
   - Work through Exception Table
   - Update Follow-Up Status for leads
   - Escalate Human Review items
   - Close out completed intakes

3. **Weekly Review:**
   - Check trend charts
   - Review asset type breakdown
   - Validate Completed count

---

## Troubleshooting

### Formulas Return #ERROR
- Check that "Leads Database" sheet name is correct
- Verify column letters match (A=Lead ID, B=Date Received, etc.)
- Ensure data is in rows 2+

### FILTER formulas not working
- Ensure you're using Google Sheets (not Excel)
- Check that criteria columns have consistent TRUE/FALSE or text values

### Last Updated timestamp not refreshing
- It will auto-update whenever the sheet recalculates
- You can also press Ctrl+Shift+F9 (or Cmd+Shift+F9 on Mac) to force recalculation

### Charts not updating
- Right-click chart → Edit chart → Data range should be dynamic (not static cells)
- Check the formula range includes future data

---

## Customization Tips

### Change the source sheet name:
If you want to call your data sheet something other than "Leads Database":
1. Use Find & Replace (Ctrl+H)
2. Find: `'Leads Database'!`
3. Replace with: `'YourNewSheetName'!`
4. Replace all

### Add more asset types:
- Add to dropdowns in Leads Database
- Add count formulas for each new type in Section F

### Adjust date ranges:
- "This Week" currently = last 7 days including today
- Change `TODAY()-6` to `TODAY()-13` for 2 weeks, etc.
- "Recent Leads Snapshot" = last 30 days; change `TODAY()-30` to adjust

### Add custom notes or SOPs:
- Insert a row at the top with dropdown instructions
- Link to intake workflow documentation

---

## Next Steps

1. ✅ Duplicate this Google Sheet template into your Google Drive
2. ✅ Create "Leads Database" sheet and add your column headers
3. ✅ Enter sample lead data (at least 10-15 rows for charts to be meaningful)
4. ✅ Build "New Leads Dashboard" sheet using formulas above
5. ✅ Apply formatting and conditional formatting
6. ✅ Add charts
7. ✅ Share the link with your acquisitions team
8. ✅ Train team on using the dashboard daily

---

**Questions?** Refer back to the formula section for your specific metric.

**Need to adjust formulas?** Each formula is self-contained and editable — just ensure you maintain the correct column letter references.
