import React, { useState } from 'react';
import { activateInboundJobs } from '../../services/api';
import './JobActivationControl.css';

/**
 * JobActivationControl - Controls for activating/deactivating jobs
 * 
 * @param {Object} props
 * @param {string} props.batchId - The batch UUID
 * @param {Array} props.inactiveJobs - List of inactive jobs
 * @param {number} props.availableSlots - Number of available phone slots
 * @param {Function} props.onActivationSuccess - Callback when jobs are activated
 * @param {boolean} props.indianNumbersOnly - Whether to filter to Indian numbers only
 */
const JobActivationControl = ({
  batchId,
  inactiveJobs = [],
  availableSlots = 0,
  onActivationSuccess,
  indianNumbersOnly = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCount, setSelectedCount] = useState(1);

  const maxActivatable = Math.min(inactiveJobs.length, availableSlots);
  const canActivate = maxActivatable > 0;

  const handleActivate = async () => {
    if (!canActivate) return;

    try {
      setLoading(true);
      setError(null);

      // Select first N inactive jobs
      const jobsToActivate = inactiveJobs
        .slice(0, selectedCount)
        .map((job) => job.job_id || job.id)
        .filter((id) => id != null); // Filter out any null/undefined values

      if (jobsToActivate.length === 0) {
        throw new Error('No valid job IDs found to activate');
      }

      const response = await activateInboundJobs(batchId, jobsToActivate, indianNumbersOnly ? 'IN' : undefined);
      onActivationSuccess?.(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to activate jobs. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleActivateAll = async () => {
    if (!canActivate) return;

    try {
      setLoading(true);
      setError(null);

      const jobsToActivate = inactiveJobs
        .slice(0, availableSlots)
        .map((job) => job.job_id || job.id)
        .filter((id) => id != null); // Filter out any null/undefined values

      if (jobsToActivate.length === 0) {
        throw new Error('No valid job IDs found to activate');
      }

      const response = await activateInboundJobs(batchId, jobsToActivate, indianNumbersOnly ? 'IN' : undefined);
      onActivationSuccess?.(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to activate jobs. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!canActivate) {
    return (
      <div className="job-activation-control">
        <div className="job-activation-control__header">
          <h3 className="job-activation-control__title">Job Activation Control</h3>
        </div>
        <div className="job-activation-control__empty">
          {inactiveJobs.length === 0 ? (
            <>
              <div className="job-activation-control__empty-icon">✓</div>
              <p>All jobs have been activated or completed</p>
            </>
          ) : (
            <>
              <div className="job-activation-control__empty-icon">⚠️</div>
              <p>No available phone slots. All phone numbers are currently in use.</p>
              <p className="job-activation-control__empty-hint">
                Wait for active calls to complete or deactivate some jobs to free up capacity.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="job-activation-control">
      <div className="job-activation-control__header">
        <h3 className="job-activation-control__title">Job Activation Control</h3>
        <div className="job-activation-control__stats">
          <span className="job-activation-control__stat">
            {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
          </span>
          <span className="job-activation-control__stat job-activation-control__stat--inactive">
            {inactiveJobs.length} inactive job{inactiveJobs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {error && (
        <div className="job-activation-control__error">
          <span>❌ {error}</span>
          <button
            className="job-activation-control__error-dismiss"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="job-activation-control__content">
        <div className="job-activation-control__selector">
          <label htmlFor="job-count" className="job-activation-control__label">
            Number of jobs to activate:
          </label>
          <input
            id="job-count"
            type="range"
            min="1"
            max={maxActivatable}
            value={selectedCount}
            onChange={(e) => setSelectedCount(parseInt(e.target.value))}
            className="job-activation-control__slider"
            disabled={loading}
          />
          <div className="job-activation-control__slider-value">{selectedCount}</div>
        </div>

        <div className="job-activation-control__info">
          ℹ️ Activating jobs assigns phone numbers and makes them ready to receive calls. 
          You can activate up to {availableSlots} job{availableSlots !== 1 ? 's' : ''} (based on available phone numbers).
        </div>

        <div className="job-activation-control__actions">
          <button
            className="job-activation-control__button job-activation-control__button--primary"
            onClick={handleActivate}
            disabled={loading}
          >
            {loading ? 'Activating...' : `Activate ${selectedCount} Job${selectedCount !== 1 ? 's' : ''}`}
          </button>
          {availableSlots > 1 && (
            <button
              className="job-activation-control__button job-activation-control__button--secondary"
              onClick={handleActivateAll}
              disabled={loading}
            >
              Activate All Available Slots ({Math.min(availableSlots, inactiveJobs.length)})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobActivationControl;

