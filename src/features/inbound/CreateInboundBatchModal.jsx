import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { getPhoneNumbers, createInboundBatch } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import './CreateInboundBatchModal.css';

/**
 * CreateInboundBatchModal - Modal for creating inbound simulation batches
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onSuccess - Callback when batch is created successfully
 */
const CreateInboundBatchModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loadingPhones, setLoadingPhones] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    batchName: '',
    outboundAgentPhone: '',
    maxConcurrentCalls: 5,
    priority: 5,
    maxDurationSeconds: 300,
    maxTurns: 20,
    scenariosFile: null,
    scenarios: [],
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchPhoneNumbers();
    }
  }, [isOpen]);

  const fetchPhoneNumbers = async () => {
    try {
      setLoadingPhones(true);
      const data = await getPhoneNumbers();
      setPhoneNumbers(data.numbers || []);
    } catch (err) {
      setError('Failed to load phone numbers');
    } finally {
      setLoadingPhones(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const scenarios = JSON.parse(text);
      
      // Validate scenarios format
      if (!Array.isArray(scenarios) || scenarios.length === 0) {
        setFormErrors((prev) => ({
          ...prev,
          scenarios: 'Scenarios must be a non-empty array',
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        scenariosFile: file,
        scenarios: scenarios,
      }));
      setFormErrors((prev) => ({ ...prev, scenarios: null }));
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        scenarios: 'Invalid JSON file. Please upload a valid scenarios file.',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate outbound phone
    if (!formData.outboundAgentPhone) {
      errors.outboundAgentPhone = 'Outbound agent phone number is required';
    } else if (!/^\+?[1-9]\d{10,14}$/.test(formData.outboundAgentPhone.replace(/[\s()-]/g, ''))) {
      errors.outboundAgentPhone = 'Please enter a valid phone number (e.g., +12345678900)';
    }

    // Validate scenarios
    if (!formData.scenarios || formData.scenarios.length === 0) {
      errors.scenarios = 'Please upload a scenarios file';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const batchData = {
        scenarios: formData.scenarios,
        outbound_agent_phone_number: formData.outboundAgentPhone.replace(/[\s()-]/g, ''),
        max_concurrent_calls: formData.maxConcurrentCalls,
        priority: formData.priority,
        max_duration_seconds: formData.maxDurationSeconds,
        max_turns: formData.maxTurns,
      };

      const response = await createInboundBatch(batchData);
      onSuccess?.(response);
      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to create batch. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      batchName: '',
      outboundAgentPhone: '',
      maxConcurrentCalls: 5,
      priority: 5,
      maxDurationSeconds: 300,
      maxTurns: 20,
      scenariosFile: null,
      scenarios: [],
    });
    setFormErrors({});
    setError(null);
    onClose();
  };

  const availablePhones = phoneNumbers.filter((p) => p.is_available);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Inbound Simulation Batch">
      <form onSubmit={handleSubmit} className="create-inbound-batch-form">
        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        {/* Batch Name (Optional) */}
        <div className="form-field">
          <label htmlFor="batchName" className="form-label">
            Batch Name <span className="form-label-optional">(optional)</span>
          </label>
          <input
            id="batchName"
            type="text"
            className="form-input"
            value={formData.batchName}
            onChange={(e) => handleInputChange('batchName', e.target.value)}
            placeholder="e.g., Medical Counselor Test Batch"
          />
        </div>

        {/* Outbound Agent Phone Number */}
        <div className="form-field">
          <label htmlFor="outboundPhone" className="form-label">
            Outbound Agent Phone Number <span className="form-label-required">*</span>
          </label>
          <input
            id="outboundPhone"
            type="tel"
            className={`form-input ${formErrors.outboundAgentPhone ? 'form-input--error' : ''}`}
            value={formData.outboundAgentPhone}
            onChange={(e) => handleInputChange('outboundAgentPhone', e.target.value)}
            placeholder="+1 (234) 567-8900"
          />
          <p className="form-hint">
            ℹ️ The phone number of the agent that will call you
          </p>
          {formErrors.outboundAgentPhone && (
            <p className="form-error">{formErrors.outboundAgentPhone}</p>
          )}
        </div>

        {/* Available Phone Numbers Info */}
        {loadingPhones ? (
          <div className="form-field">
            <LoadingSpinner message="Loading available phone numbers..." />
          </div>
        ) : availablePhones.length === 0 ? (
          <div className="form-field">
            <div className="form-warning">
              ⚠️ No phone numbers available. Phone numbers will be assigned automatically when you activate jobs.
            </div>
          </div>
        ) : (
          <div className="form-field">
            <div className="form-info">
              📞 {availablePhones.length} phone number(s) available for inbound calls
            </div>
          </div>
        )}

        {/* Max Concurrent Calls */}
        <div className="form-field">
          <label htmlFor="maxConcurrent" className="form-label">
            Max Concurrent Calls
          </label>
          <select
            id="maxConcurrent"
            className="form-input"
            value={formData.maxConcurrentCalls}
            onChange={(e) => handleInputChange('maxConcurrentCalls', parseInt(e.target.value))}
          >
            {[1, 2, 3, 5, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <p className="form-hint">
            ℹ️ How many calls can run simultaneously (per phone number)
          </p>
        </div>

        {/* Scenarios Upload */}
        <div className="form-field">
          <label htmlFor="scenarios" className="form-label">
            Scenarios <span className="form-label-required">*</span>
          </label>
          <div className="form-file-upload">
            <input
              id="scenarios"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="form-file-input"
            />
            <label htmlFor="scenarios" className="form-file-label">
              📄 {formData.scenariosFile ? formData.scenariosFile.name : 'Upload JSON file'}
            </label>
          </div>
          {formData.scenarios.length > 0 && (
            <p className="form-success">
              ✓ {formData.scenarios.length} scenario(s) loaded
            </p>
          )}
          {formErrors.scenarios && (
            <p className="form-error">{formErrors.scenarios}</p>
          )}
          <p className="form-hint">
            ℹ️ Upload a JSON file with an array of scenarios
          </p>
        </div>

        {/* Advanced Settings (Collapsible) */}
        <details className="form-details">
          <summary className="form-details-summary">Advanced Settings</summary>
          <div className="form-details-content">
            {/* Priority */}
            <div className="form-field">
              <label htmlFor="priority" className="form-label">
                Priority (1-10)
              </label>
              <input
                id="priority"
                type="number"
                min="1"
                max="10"
                className="form-input"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
              />
              <p className="form-hint">Higher = more urgent (default: 5)</p>
            </div>

            {/* Max Duration */}
            <div className="form-field">
              <label htmlFor="maxDuration" className="form-label">
                Max Duration (seconds)
              </label>
              <input
                id="maxDuration"
                type="number"
                min="60"
                max="600"
                className="form-input"
                value={formData.maxDurationSeconds}
                onChange={(e) => handleInputChange('maxDurationSeconds', parseInt(e.target.value))}
              />
              <p className="form-hint">Maximum call length (default: 300s / 5 minutes)</p>
            </div>

            {/* Max Turns */}
            <div className="form-field">
              <label htmlFor="maxTurns" className="form-label">
                Max Conversation Turns
              </label>
              <input
                id="maxTurns"
                type="number"
                min="5"
                max="50"
                className="form-input"
                value={formData.maxTurns}
                onChange={(e) => handleInputChange('maxTurns', parseInt(e.target.value))}
              />
              <p className="form-hint">Maximum back-and-forth exchanges (default: 20)</p>
            </div>
          </div>
        </details>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleClose}
            className="form-button form-button--secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="form-button form-button--primary"
            disabled={loading || loadingPhones}
          >
            {loading ? 'Creating...' : 'Create Batch'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateInboundBatchModal;

