# Quick Start Guide - Inbound Simulation Feature

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Backend API running on `http://localhost:8000` (or configured via `VITE_API_BASE_URL`)
- Backend configured with `INBOUND_PHONE_NUMBERS` environment variable

### Installation
```bash
cd batch-dashboard
npm install
```

### Development
```bash
npm run dev
```

Visit `http://localhost:5173/inbound-simulation`

### Build for Production
```bash
npm run build
```

---

## 📖 Using the Inbound Simulation Feature

### Step 1: View Available Phone Numbers
1. Navigate to `/inbound-simulation`
2. View the "Available Phone Numbers" section
3. Check which phone numbers are available (green) vs in use (blue)

### Step 2: Create a Batch
1. Click "➕ Create Inbound Batch" button
2. Fill in the form:
   - **Outbound Agent Phone**: The phone number that will call you (e.g., `+12345678900`)
   - **Scenarios**: Upload a JSON file with scenarios (see format below)
   - **Max Concurrent Calls**: How many calls can run at once (default: 5)
3. Click "Create Batch"
4. You'll be redirected to the batch details page

### Step 3: Activate Jobs
1. On the batch details page, view "Available Slots"
2. Use the slider to select how many jobs to activate
3. Click "Activate N Jobs"
4. Jobs will be activated and assigned phone numbers automatically

### Step 4: Make Calls
1. From your outbound agent, call the assigned phone numbers
2. The dashboard will show active calls in real-time
3. Watch the duration timers update every second

### Step 5: Monitor Progress
1. View the progress bar showing completion percentage
2. Check the statistics (Active, In Progress, Inactive, Completed, Failed)
3. Filter jobs by status in the jobs list
4. Click "View" on any completed job to see details

---

## 📄 Scenarios JSON Format

Create a JSON file with an array of scenarios:

```json
[
  {
    "scenario_id": "medical_001",
    "scenario_name": "Knee Surgery Inquiry",
    "simulation_context": {
      "patient_name": "John Doe",
      "condition": "Knee pain",
      "inquiry_type": "Surgery consultation"
    },
    "evaluation_criteria": {
      "empathy": true,
      "information_accuracy": true,
      "call_resolution": true
    }
  },
  {
    "scenario_id": "medical_002",
    "scenario_name": "Follow-up Consultation",
    "simulation_context": {
      "patient_name": "Jane Smith",
      "condition": "Post-surgery follow-up",
      "inquiry_type": "Recovery progress"
    },
    "evaluation_criteria": {
      "empathy": true,
      "information_accuracy": true,
      "call_resolution": true
    }
  }
]
```

---

## 🎨 Design System Quick Reference

### Colors
```css
/* Use these CSS variables in your code */
--color-accent: #855CF1        /* Primary purple */
--color-success: #22C55E       /* Green */
--color-error: #EF4444         /* Red */
--color-warning: #F59E0B       /* Amber */
--color-info: #3B82F6          /* Blue */
```

### Spacing
```css
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
```

### Components
- **Cards**: `padding: var(--space-lg)`, `border-radius: var(--radius-lg)`
- **Buttons**: `padding: var(--space-sm) var(--space-md)`
- **Inputs**: `padding: 10px 14px`

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Requirements
The backend must have these endpoints:

```
GET    /api/v1/telephony/numbers
POST   /api/v1/calls/inbound/batch
GET    /api/v1/calls/inbound/batch/:id/status
POST   /api/v1/calls/inbound/batch/:id/activate
POST   /api/v1/calls/inbound/batch/:id/deactivate
GET    /api/v1/calls/inbound/batch/:id/jobs
GET    /api/v1/calls/inbound/batches
```

Backend environment variable:
```bash
INBOUND_PHONE_NUMBERS='[
  {"phone_number":"+19876543210","trunk_id":"trunk_1"},
  {"phone_number":"+19876543211","trunk_id":"trunk_2"}
]'
```

---

## 🐛 Troubleshooting

### Issue: "No phone numbers available"
**Solution**: Ensure backend has `INBOUND_PHONE_NUMBERS` configured

### Issue: "Failed to fetch phone numbers"
**Solution**: Check that backend API is running and `VITE_API_BASE_URL` is correct

### Issue: Can't activate jobs
**Solution**: Ensure there are available phone slots (not all in use)

### Issue: Active calls not showing
**Solution**: 
1. Check that jobs are in `active` state before calling
2. Verify outbound agent is calling the correct phone number
3. Wait 5 seconds for dashboard to refresh

---

## 📚 Documentation

### For Developers
- **Design System**: `/agents/design-system.md`
- **Frontend Standards**: `/agents/frontend-developer-agent.md`
- **Implementation Details**: `INBOUND_SIMULATION_IMPLEMENTATION.md`

### For Designers
- **UX Guidelines**: `/agents/ux-designer-agent.md`
- **UX Research**: `/agents/ux-researcher-agent.md`

### For Product
- **Changes Made**: `CHANGES_MADE.md`
- **Original Requirements**: `/markdown/DASHBOARD_INBOUND_SIMULATION.md`

---

## 🎯 Key Features

### ✅ What You Can Do
- View available phone numbers and their status
- Create inbound simulation batches with custom scenarios
- Activate specific number of jobs based on capacity
- Monitor active calls in real-time with live duration
- Track batch progress with visual indicators
- Filter and view all jobs by status
- Receive toast notifications for actions

### 🔄 Real-time Updates
- Phone numbers: Every 30 seconds
- Batch list: Every 30 seconds
- Batch details: Every 5 seconds
- Call durations: Every 1 second

---

## 🚦 Status Indicators

### Phone Numbers
- 🟢 **Available**: Ready to receive calls
- 🔵 **In Use**: Currently handling a call

### Jobs
- ⚪ **Inactive**: Not yet activated
- 🔵 **Active**: Ready to receive calls
- 🟡 **In Progress**: Call in progress
- ✅ **Completed**: Call finished successfully
- ❌ **Failed**: Call failed

### Batches
- **Processing**: Jobs are active or in progress
- **Completed**: All jobs finished
- **Failed**: Some jobs failed

---

## 💡 Tips & Best Practices

### Creating Batches
1. Start with a small number of scenarios (5-10) to test
2. Use descriptive scenario names for easy identification
3. Set max concurrent calls based on your phone capacity
4. Keep scenarios JSON file well-formatted and validated

### Activating Jobs
1. Don't activate more jobs than you can handle
2. Monitor active calls before activating more
3. Wait for calls to complete before activating new jobs
4. Use "Activate All Available" for maximum throughput

### Monitoring
1. Keep the batch details page open for real-time updates
2. Use job filters to focus on specific statuses
3. Check failed jobs to identify issues
4. Export results (future feature) for analysis

---

## 🎨 Theme Support

The dashboard supports both light and dark themes:
- Click the theme toggle in the top-right corner
- Theme preference is saved to localStorage
- All components adapt automatically

---

## 📱 Mobile Support

The dashboard is fully responsive:
- Works on phones (< 768px)
- Works on tablets (768px - 1024px)
- Optimized for desktop (> 1024px)

---

## 🔐 Security Notes

- Phone numbers are validated before submission
- API calls use authentication tokens (if configured)
- No sensitive data stored in localStorage
- All API calls use HTTPS in production

---

## 📞 Support

For issues or questions:
1. Check this Quick Start Guide
2. Review the implementation docs
3. Check the agent documentation in `/agents/`
4. Contact the development team

---

## 🎉 You're Ready!

Navigate to `/inbound-simulation` and start creating your first batch!

**Happy Testing! 🚀**

