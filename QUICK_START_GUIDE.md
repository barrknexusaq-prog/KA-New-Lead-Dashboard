# Quick Start & Operations Guide
## New Leads Dashboard - Daily Use

---

## 🚀 Getting Started (5 minutes)

### First Time Setup
1. Go to the "New Leads Dashboard" sheet
2. Check the KPI cards at the top (rows 5-9)
3. Scroll down to see all sections
4. Verify data is populating from "Leads Database" sheet

### Daily Operations (2 minutes)
Each morning, open the dashboard and:
1. **Top KPIs** — Check leads received today and this week
2. **Human Review Queue** (red section) — Address any flagged items
3. **Missing Docs Table** — Follow up on urgent items (>3 days with no follow-up)
4. **Recent Leads** — Stay current with latest additions

---

## 📊 Dashboard Sections Explained

### Section A: Header
- Shows dashboard name and last update timestamp
- Timestamp auto-updates when sheet recalculates

### Section B: KPI Cards (Top Metrics)
| Card | What It Means | Action |
|------|---------------|--------|
| Total New Leads | All leads in system | Reference number |
| Leads Today | Arrived in past 24 hours | Priority review |
| Leads This Week | Last 7 days | Weekly trend check |
| Leads This Month | From start of month to today | Monthly metrics |
| Missing Docs | Leads flagged as incomplete | Requires follow-up |
| Awaiting Follow-Up | Missing docs, follow-up not done | URGENT |
| Human Review | Flagged by intake agent | Escalate to reviewer |
| RV Park / Campground / Resort | Count by asset type | Portfolio breakdown |
| % Missing Docs | Percentage incomplete | Quality metric |
| % Human Review | Percentage requiring escalation | Workload metric |

### Section C: Intake Status Summary
Shows breakdown of all leads by current stage:
- **New** — Just entered system
- **In Progress** — Being reviewed/processed
- **Waiting on Docs** — Awaiting missing information
- **Ready for Review** — Complete, ready for next step
- **Human Review Needed** — Flagged for special attention
- **Completed** — Intake process finished

### Section D: Missing Docs & Follow-Up Monitoring
**Summary Metrics:**
- Total Missing Docs count
- Waiting >3 Days (old, no follow-up) — **Most urgent**
- No Follow-up Sent (never contacted)
- Follow-up Sent (contacted, awaiting response)
- Needs Immediate Attention (combines overdue + human review)

**Exception Table:**
Shows individual leads with missing docs that haven't been completed.
- Highlighted in amber/orange = needs attention
- Click on the lead ID to jump to full record in Leads Database
- "Days Since" column shows age (>10 days = very urgent)

**What to do:**
1. Start with rows highlighted in orange/red
2. Update Follow-Up Status when you send an email/call
3. Update Missing Docs List if received
4. Mark Intake Status as "Completed" when done

### Section E: Human Review Queue
Shows all leads flagged with Human Review Flag = TRUE.
- These came from the Acquisitions Intake Agent
- If "Check Notes" appears, read the Notes column for explanation
- Background is light red to indicate priority

**What to do:**
1. Read the Notes for context
2. Make your decision (approve, reject, needs more docs, etc.)
3. Update the record in Leads Database:
   - Set Human Review Flag = FALSE once reviewed
   - Update Intake Status with decision
   - Update Notes with your review result

### Section F: Asset Type Breakdown
Quick visual of portfolio composition:
- Count of each asset type
- Percentage of total leads

**Use for:** Understanding lead mix, portfolio strategy alignment

### Section G: Recent Leads Snapshot
Last 30 days of leads, sorted by most recent first.
- Shows latest arrivals
- Amber highlighting = missing docs
- Red highlighting = human review flagged

**Use for:** Quick scan of what's new

---

## 🔴 Critical Actions (When You See These)

### Red Background = Immediate Attention
- **Human Review Queue section** — Someone flagged this for you to review
- **Asking Price / Key fields marked red** — Data quality issue or conflict

### Amber/Orange Highlighting = Urgent Follow-Up Needed
- Lead in Missing Docs table with Days Since ≥ 3
- No Follow-Up Status yet
- Email the broker/sender immediately for missing information

### > 10 Days Waiting (Deep Red)
- This lead has been waiting for docs too long
- Consider escalating to senior acquisitions manager
- May need special outreach or alternative document source

---

## 📝 How to Enter / Update Data

**You should RARELY edit the "New Leads Dashboard" sheet directly.**

**Instead, go to "Leads Database" sheet and:**

1. **Add a new lead** (new row)
   - Fill in all columns you have data for
   - Leave blank what you don't know yet
   - Set Asset Type using dropdown
   - Set Intake Status = "New"
   - Set Follow-Up Status = "No Follow-up Sent"
   - Set Missing Docs Flag = TRUE or FALSE

2. **Update an existing lead**
   - Find the lead by ID or Property Name
   - Update the cells with new information
   - Change Follow-Up Status when you contact them
   - Update Last Follow-Up Date with today's date
   - Update Missing Docs List and flag accordingly

3. **Mark as complete**
   - Set Intake Status = "Completed"
   - Remove/update flags as appropriate
   - Lead will fall off exception tables once completed

4. **Flag for human review**
   - Set Human Review Flag = TRUE
   - Add explanation in Notes column
   - Lead appears in Human Review Queue on dashboard

---

## ✅ Daily Checklist

**First Thing (Morning):**
- [ ] Open dashboard
- [ ] Review "Needs Immediate Attention" count
- [ ] Check Human Review Queue for new flags
- [ ] Scan Recent Leads for anything important

**Throughout Day:**
- [ ] Update Follow-Up Status when you contact brokers/senders
- [ ] Update Missing Docs List with what you've received
- [ ] Flag for human review if needed
- [ ] Mark leads Completed when intake process finished

**End of Day (Optional):**
- [ ] Verify dashboard updated with latest changes
- [ ] Note tomorrow's priorities based on Urgent table
- [ ] No manual save needed (Google Sheets auto-saves)

---

## 🔧 Common Updates & Quick Tasks

### I received missing docs from a broker
1. Go to Leads Database
2. Find the lead
3. Update "Missing Docs List" column (remove or mark complete)
4. Change "Missing Docs Flag" to FALSE
5. Update "Last Follow-Up Date" to today
6. Back on dashboard: Lead automatically leaves the exception table

### I need to flag a lead for human review
1. Go to Leads Database
2. Find the lead
3. Set "Human Review Flag" to TRUE
4. Add explanation in "Notes" column (e.g., "Price seems low for location")
5. Back on dashboard: Lead automatically appears in Human Review Queue

### I'm done with a lead (completed intake)
1. Go to Leads Database
2. Find the lead
3. Set "Intake Status" to "Completed"
4. Set "Missing Docs Flag" to FALSE (if not already)
5. Set "Human Review Flag" to FALSE (if not already)
6. Back on dashboard: Green checkmark would appear (if you add conditional formatting)

### A lead moved to next stage (e.g., Ready for Review)
1. Go to Leads Database
2. Find the lead
3. Update "Intake Status" dropdown to new stage
4. Back on dashboard: Count in Status Summary automatically updates

### I want to see leads for only one broker
1. Go to Leads Database sheet
2. Select the Broker Name column header
3. Click Data → Create a filter
4. Filter to show only that broker
5. Back on dashboard: FILTER formulas will automatically re-calculate to show only those leads

---

## 📱 What Updates Automatically

**These update in real-time (no manual refresh needed):**
- ✅ All KPI numbers
- ✅ Status Summary table
- ✅ Missing Docs count
- ✅ Human Review Queue
- ✅ Exception tables
- ✅ Recent Leads
- ✅ Asset Type counts
- ✅ All percentages
- ✅ Last Updated timestamp
- ✅ All charts

**Just make changes to Leads Database and the dashboard instantly reflects them.**

---

## ⚠️ Important Rules

### DO:
- ✅ Enter data into Leads Database
- ✅ Use dropdown menus for Status/Asset Type (ensures consistency)
- ✅ Update Follow-Up Status and dates
- ✅ Flag items for human review with TRUE/FALSE
- ✅ Add notes when flagging for review
- ✅ Mark items Completed when done

### DON'T:
- ❌ Manually edit the dashboard KPIs or formulas
- ❌ Delete leads (mark as Completed instead)
- ❌ Make acquisition/go-no-go decisions in the dashboard
- ❌ Leave Missing Docs List blank if flag = TRUE
- ❌ Override formula cells with manual entries

---

## 🎯 Using the Dashboard for Decision-Making

### At the Start of the Day
"What arrived overnight and needs attention?"
→ Look at "Leads Today" KPI and "Recent Leads" section

### Mid-Week
"How's our intake volume looking?"
→ Check "Leads This Week" KPI and "Status Summary"

### End of Month
"What's our asset type mix?"
→ Review "Asset Type Breakdown" section

### For Bottleneck Analysis
"Where are leads getting stuck?"
→ Compare status counts; find gaps (e.g., too many "Waiting on Docs")

### For Workload Planning
"How many items need immediate attention?"
→ Check "Needs Immediate Attention" metric in Section D

### For Performance Review
"What's our follow-up rate?"
→ Compare "No Follow-up Sent" vs "Follow-up Sent"

---

## 🐛 Troubleshooting

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| Dashboard shows zeros | No data in Leads Database | Add test records to database |
| "Last Updated" shows old time | Last calc. was long ago | Click anywhere, press Enter, page refreshes |
| A formula shows #ERROR | Typo in reference or data type mismatch | Check FORMULA_REFERENCE.md for column letters |
| Charts show no data | Date range issue or empty filter | Verify Leads Database has data in date range |
| Missing Docs table is empty | No leads flagged as missing docs | Set Missing Docs Flag = TRUE in Leads Database |
| Human Review Queue empty | No leads with flag = TRUE | Set Human Review Flag = TRUE in database |

---

## 💡 Pro Tips

**Tip 1: Filter Leads Database by broker**
If you work with specific brokers, filter the Leads Database sheet to see only their leads. Dashboard will auto-adjust.

**Tip 2: Sort recent leads by city**
In "Recent Leads Snapshot," click the City column header and sort to find leads in your target markets.

**Tip 3: Track your follow-up rate**
"No Follow-up Sent" count ÷ "Total Missing Docs" = follow-up rate. Aim high!

**Tip 4: Use conditional formatting in your database**
Add your own color rules in Leads Database for fields you monitor closely (e.g., Asking Price > $5M = highlight).

**Tip 5: Export monthly reports**
Each month, select the Recent Leads table and export to PDF/CSV for your records.

---

## 📞 Support / Questions

**If a formula isn't working:**
- See FORMULA_REFERENCE.md for explanations
- Check that "Leads Database" sheet name is spelled exactly right
- Verify column letters match (A=Lead ID, B=Date Received, etc.)

**If dashboard layout looks wrong:**
- Scroll left/right and up/down to see all sections
- Freeze panes may hide headers (go View → Freeze to adjust)

**If you want to customize:**
- See SHEET_SETUP_GUIDE.md for adjustment instructions
- Most changes are simple (e.g., date range = just change the number in the formula)

---

## 🎓 Training Other Users

When bringing new team members onto the dashboard:

1. **Week 1:** Show them how to enter leads in Leads Database
2. **Week 1:** Show them the dashboard sections and what each means
3. **Week 2:** Walk through "Missing Docs monitoring" workflow
4. **Week 2:** Show how to flag for human review
5. **Week 3:** Have them run through an end-to-end lead intake

**Share these docs with them:**
- IMPLEMENTATION_CHECKLIST.md (overview)
- This guide (daily operations)
- FORMULA_REFERENCE.md (if they ask technical questions)

---

## 🎉 Success Signs

You'll know your dashboard is working well when:

- ✅ Team checks the dashboard each morning
- ✅ Follow-up items are completed within 24 hours
- ✅ Human review queue is regularly cleared
- ✅ Most leads have full documentation within 5 days
- ✅ Zero leads in "Waiting >10 Days" category
- ✅ Reports to leadership reference dashboard metrics
- ✅ Team uses "Intake Status" to track workflow progress
- ✅ New brokers ask "What's coming in?" and you can answer in 30 seconds

---

**Questions? Ideas? Issues?** Refer back to the other documentation files or reach out to your IT team.

**Happy monitoring! 🚀**
