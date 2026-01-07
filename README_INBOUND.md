# Inbound Simulation Feature - README

## 🎯 Overview

The inbound simulation feature allows you to test AI agents that **receive** phone calls (as opposed to making outbound calls). This feature is **seamlessly integrated** into the existing batch dashboard.

### Key Concept
- **Same URL**: `/batch/:batchId` works for both inbound and outbound batches
- **Automatic Detection**: The system automatically detects the batch type and shows the appropriate UI
- **No Extra Navigation**: No separate pages or menu items needed

---

## 🚀 Quick Start

### 1. Create an Inbound Batch
Use the backend API to create an inbound batch:

```bash
POST /api/v1/calls/inbound/batch
{
  "scenarios": [...],
  "outbound_agent_phone_number": "+12345678900",
  "max_concurrent_calls": 5
}
```

### 2. View the Batch
Navigate to the batch ID:
```
/batch/:batchId
```

The dashboard will **automatically detect** it's an inbound batch and show:
- 📞 Inbound Batch Details (header)
- Job Activation Control (slider interface)
- Active Calls monitoring (real-time)

### 3. Activate Jobs
1. Use the slider to select how many jobs to activate
2. Click "Activate N Jobs"
3. Jobs will be activated and assigned phone numbers

### 4. Make Calls
From your outbound agent, call the assigned phone numbers. The dashboard will show active calls in real-time.

---

## 🎨 What You'll See

### For Inbound Batches (`/batch/:batchId`)

#### Header
```
📞 Inbound Batch Details
/your-batch-id
```

#### Sections
1. **Batch Overview**
   - Progress bar
   - Statistics (Active, In Progress, Inactive, Completed, Failed)
   - Outbound agent phone number

2. **Job Activation Control** ⭐ (Inbound-only)
   - Available slots indicator
   - Slider to select number of jobs
   - "Activate N Jobs" button
   - Constraint enforcement (can't exceed capacity)

3. **Active Calls** ⭐ (Inbound-only)
   - Real-time call list
   - Live duration timers (updates every second)
   - Pulsing green indicators
   - Scenario information

4. **Tabs**
   - Simulations (job list)
   - Scenarios (scenario view)
   - Analysis (analytics)

### For Outbound Batches (`/batch/:batchId`)

Standard batch details view (existing functionality):
- Batch Overview
- Tabs (Simulations/Scenarios/Analysis)
- No job activation or active calls sections

---

## 🔄 How Detection Works

```javascript
// Simplified logic
try {
  // Try to fetch as inbound batch
  const inboundData = await getInboundBatchStatus(batchId);
  
  // Success! Show inbound UI
  showInboundUI();
} catch (error) {
  // Not inbound, must be outbound
  const outboundData = await fetchBatchDetails(batchId);
  
  // Show outbound UI
  showOutboundUI();
}
```

**Result**: Zero configuration needed. Just navigate to `/batch/:batchId` and the system handles the rest!

---

## 📊 Key Features

### Job Activation
- **Slider Interface**: Visually select number of jobs
- **Capacity Constraints**: Can't exceed available phone slots
- **Instant Feedback**: Toast notifications on success/error
- **Phone Assignment**: Automatic phone number assignment

### Real-Time Monitoring
- **Live Timers**: Call duration updates every second
- **Auto-Refresh**: Batch data refreshes every 5 seconds
- **Active Indicators**: Pulsing green dots for active calls
- **Scenario Display**: See what scenario each call is running

### Error Prevention
- Slider constrained to available capacity
- Form validation before submission
- Disabled states for unavailable actions
- Clear error messages

---

## 🎛️ Components Built

### Core Components (`/src/features/inbound/`)

1. **PhoneNumberCard** - Individual phone number display
2. **PhoneNumberList** - Grid of available phone numbers
3. **CreateInboundBatchModal** - Batch creation form
4. **JobActivationControl** - Job activation interface ⭐
5. **ActiveCallsList** - Real-time call monitoring ⭐

⭐ = Integrated into main batch page

---

## 🔧 API Endpoints Used

```
GET    /api/v1/telephony/numbers              - Get phone numbers
POST   /api/v1/calls/inbound/batch            - Create batch
GET    /api/v1/calls/inbound/batch/:id/status - Get batch status
POST   /api/v1/calls/inbound/batch/:id/activate - Activate jobs
GET    /api/v1/calls/inbound/batch/:id/jobs   - Get jobs list
```

---

## 💡 Usage Examples

### Example 1: Create and Activate
```bash
# 1. Create batch
POST /api/v1/calls/inbound/batch
{
  "scenarios": [{"scenario_id": "test_1", ...}],
  "outbound_agent_phone_number": "+12345678900",
  "max_concurrent_calls": 3
}

# Response: { "batch_id": "abc-123", ... }

# 2. Navigate to batch
/batch/abc-123

# 3. Use UI to activate 3 jobs

# 4. Call the assigned phone numbers
```

### Example 2: Monitor Progress
```bash
# Navigate to batch
/batch/abc-123

# Watch real-time updates:
- Active calls count
- Call durations (live)
- Progress bar
- Job status changes
```

---

## 🎨 Design Highlights

### Colors
- **Primary**: `#855CF1` (Purple) - Buttons, accents
- **Success**: `#22C55E` (Green) - Completed, available
- **Info**: `#3B82F6` (Blue) - Active calls
- **Warning**: `#F59E0B` (Amber) - In progress

### Spacing
Consistent spacing throughout:
- `4px`, `8px`, `16px`, `24px`, `32px`, `48px`

### Components
- **Cards**: Rounded corners (16px), subtle shadows
- **Buttons**: 10px radius, smooth hover effects
- **Sliders**: Custom-styled with accent color

---

## ♿ Accessibility

- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Screen reader friendly
- ✅ Color contrast compliant (4.5:1)
- ✅ Focus indicators
- ✅ Semantic HTML

---

## 📱 Responsive Design

Works on all devices:
- **Mobile** (< 768px): Single column, stacked layouts
- **Tablet** (768-1024px): Optimized grids
- **Desktop** (> 1024px): Full feature set

---

## 🔒 Security

- Phone number validation
- API authentication (if configured)
- No sensitive data in localStorage
- HTTPS in production

---

## 📚 Additional Documentation

- **Design System**: `/agents/design-system.md`
- **UX Guidelines**: `/agents/ux-designer-agent.md`
- **Dev Standards**: `/agents/frontend-developer-agent.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`

---

## 🐛 Troubleshooting

### Issue: Batch not detected as inbound
**Solution**: Ensure the batch was created using the inbound API endpoint

### Issue: Can't activate jobs
**Solution**: Check that there are available phone slots (not all in use)

### Issue: Active calls not showing
**Solution**: 
1. Verify jobs are in `active` state
2. Check that calls are being made to correct phone numbers
3. Wait 5 seconds for auto-refresh

---

## 🎉 Benefits

### For Users
- ✅ Simple: One URL for everything
- ✅ Intuitive: Automatic detection
- ✅ Real-time: Live updates
- ✅ Visual: Clear progress indicators

### For Developers
- ✅ Clean: No code duplication
- ✅ Maintainable: Single page to update
- ✅ Extensible: Easy to add features
- ✅ Documented: Comprehensive guides

---

## 🚦 Next Steps

1. **Test the feature**: Navigate to an inbound batch
2. **Activate jobs**: Use the slider interface
3. **Monitor calls**: Watch real-time updates
4. **Review code**: Check `BatchAnalytics.jsx` for implementation

---

## 📞 Support

For questions or issues:
1. Check this README
2. Review `IMPLEMENTATION_SUMMARY.md`
3. Consult agent documentation in `/agents/`

---

**Happy Testing! 🚀**

The inbound simulation feature is ready to use. Just navigate to `/batch/:batchId` and the system will automatically show the right interface!

