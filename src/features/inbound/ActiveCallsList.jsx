import React, { useState, useEffect } from 'react';
import './ActiveCallsList.css';

/**
 * ActiveCallsList - Real-time display of active calls
 * 
 * @param {Object} props
 * @param {string} props.batchId - The batch UUID
 * @param {Array} props.activeCalls - List of active calls
 * @param {Function} props.onViewCall - Callback when viewing call details
 * @param {boolean} props.isOutbound - Whether this is for an outbound batch
 * @param {string} props.agentPhoneNumber - The agent's phone number (for outbound)
 */
const ActiveCallsList = ({ batchId, activeCalls = [], onViewCall, isOutbound = false, agentPhoneNumber }) => {
  const [callDurations, setCallDurations] = useState({});

  useEffect(() => {
    // Update durations every second
    const interval = setInterval(() => {
      const newDurations = {};
      activeCalls.forEach((call) => {
        if (call.started_at) {
          const startTime = new Date(call.started_at);
          const now = new Date();
          const durationSeconds = Math.floor((now - startTime) / 1000);
          newDurations[call.id] = durationSeconds;
        }
      });
      setCallDurations(newDurations);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCalls]);

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScenarioName = (call) => {
    if (call.sim_jobs_01?.scenario_snapshot?.scenario_name) {
      return call.sim_jobs_01.scenario_snapshot.scenario_name;
    }
    if (call.sim_jobs_01?.scenario_id) {
      return call.sim_jobs_01.scenario_id;
    }
    return 'Unknown Scenario';
  };

  const formatPhoneNumber = (phone) => {
    // Format +19876543210 to +1 (987) 654-3210
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getPhoneNumberToDisplay = (call) => {
    if (isOutbound) {
      // For outbound: show the customer phone number being called
      return call.customer_phone_number || call.phone_number || 'N/A';
    } else {
      // For inbound: show the assigned phone number (the number receiving the call)
      return call.assigned_phone_number || agentPhoneNumber || 'N/A';
    }
  };

  if (activeCalls.length === 0) {
    return (
      <div className="active-calls-list">
        <div className="active-calls-list__header">
          <h3 className="active-calls-list__title">Active Calls</h3>
          <div className="active-calls-list__count">0 active</div>
        </div>
        <div className="active-calls-list__empty">
          <div className="active-calls-list__empty-icon">📞</div>
          <p>No active calls right now</p>
          <p className="active-calls-list__empty-hint">
            {isOutbound 
              ? 'Active outbound calls will appear here when jobs are in progress'
              : 'Activate jobs to start receiving calls from your outbound agent'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="active-calls-list">
      <div className="active-calls-list__header">
        <h3 className="active-calls-list__title">Active Calls</h3>
        <div className="active-calls-list__count">
          <span className="active-calls-list__pulse">🟢</span>
          {activeCalls.length} active
        </div>
      </div>

      <div className="active-calls-list__grid">
        {activeCalls.map((call) => (
          <div key={call.id} className="active-call-card">
            <div className="active-call-card__header">
              <div className="active-call-card__status">
                <span className="active-call-card__pulse">🟢</span>
                <span className="active-call-card__status-text">In Progress</span>
              </div>
              <div className="active-call-card__duration">
                ⏱️ {formatDuration(callDurations[call.id] || 0)}
              </div>
            </div>

            <div className="active-call-card__content">
              <div className="active-call-card__scenario">
                <div className="active-call-card__label">Scenario:</div>
                <div className="active-call-card__value">{getScenarioName(call)}</div>
              </div>

              {/* Show phone number being called (for outbound) or assigned number (for inbound) */}
              <div className="active-call-card__phone">
                <div className="active-call-card__label">
                  {isOutbound ? '📞 Calling:' : '📞 Number:'}
                </div>
                <div className="active-call-card__value active-call-card__value--phone">
                  {formatPhoneNumber(getPhoneNumberToDisplay(call))}
                </div>
              </div>

              {call.call_id && (
                <div className="active-call-card__call-id">
                  <div className="active-call-card__label">Call ID:</div>
                  <div className="active-call-card__value active-call-card__value--mono">
                    {call.call_id.substring(0, 8)}...
                  </div>
                </div>
              )}
            </div>

            <button
              className="active-call-card__button"
              onClick={() => onViewCall?.(call)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveCallsList;

