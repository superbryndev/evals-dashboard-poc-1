# Batch Analytics Dashboard

A polished, modern dashboard for viewing batch-level call simulation results, job statuses, call details, transcripts, and AI-powered evaluations.

## Features

- **Batch Overview**: View batch metadata, progress, and status breakdown
- **Jobs List**: See all jobs with status (In Queue, Active, In Progress, Completed, Failed)
- **Call Details**: View call analytics including:
  - Recording player (audio playback)
  - Transcript viewer (agent/user conversation)
  - Call metrics (duration, latency)
- **AI Evaluation**: LLM-powered evaluation of calls against expected agent goals
  - Pass/Fail status per goal
  - Evidence and reasoning from transcript
  - Call path/flow summary
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Manual Refresh**: Refresh button to update data on demand

## Quick Start

```bash
# Navigate to dashboard directory
cd batch-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at `http://localhost:3001`

## Usage

Navigate to `/batch/:batchId` where `:batchId` is the UUID returned from the batch API.

Example: `http://localhost:3001/batch/123e4567-e89b-12d3-a456-426614174000`

## API Endpoints

The dashboard uses these backend API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/calls/batch/{batch_id}/details` | GET | Get batch info with all jobs and calls |
| `/api/v1/calls/call/{call_id}/analytics` | GET | Get call analytics (transcript, recording, etc.) |
| `/api/v1/calls/call/{call_id}/evaluate` | POST | Trigger LLM evaluation of call |

## Color Palette

```css
:root {
  --color-ink: #0D0D0D;
  --color-paper: #FAFAF8;
  --color-accent: #855CF1;
  --color-accent-soft: #E8EFFF;
  --color-muted: #6B6B6B;
  --color-border: #E0E0E0;
}
```

## Configuration

Create a `.env` file in the dashboard directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Tech Stack

- React 18
- React Router DOM
- Emotion (styled components)
- Axios
- Vite

