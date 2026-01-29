import React, { useState, useEffect } from 'react';
import { getPhoneNumbers, freePhoneNumber } from '../../services/api';
import PhoneNumberCard from './PhoneNumberCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import CountryFilterToggle from '../../components/CountryFilterToggle';
import './PhoneNumberList.css';

/**
 * PhoneNumberList - Displays available phone numbers for inbound calls
 * 
 * @param {Object} props
 * @param {Function} props.onSelectPhone - Callback when phone number is selected (optional)
 * @param {boolean} props.selectable - Whether phone numbers are selectable (default: false)
 * @param {boolean} props.indianNumbersOnly - Whether to filter to Indian numbers only
 * @param {Function} props.onFilterChange - Callback when filter toggle changes
 * @param {number} props.refreshKey - When this changes, phone numbers are refetched
 */
const PhoneNumberList = ({ 
  onSelectPhone, 
  selectable = false,
  indianNumbersOnly = false,
  onFilterChange,
  refreshKey = 0,
}) => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freeingNumber, setFreeingNumber] = useState(null);

  const fetchPhoneNumbers = async () => {
    try {
      setError(null);
      const data = await getPhoneNumbers();
      setPhoneNumbers(data.numbers || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch phone numbers');
    } finally {
      setLoading(false);
    }
  };

  // Initial load + periodic background refresh
  useEffect(() => {
    fetchPhoneNumbers();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPhoneNumbers, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Explicit refresh from parent (e.g., page refresh button)
  useEffect(() => {
    if (refreshKey > 0) {
      fetchPhoneNumbers();
    }
  }, [refreshKey]);

  const handleFreeNumber = async (phoneNumber) => {
    try {
      setFreeingNumber(phoneNumber);
      await freePhoneNumber(phoneNumber);
      // Refresh list after freeing
      await fetchPhoneNumbers();
    } catch (err) {
      // Surface a simple error; detailed toast handled at parent level if needed
      setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to free phone number');
    } finally {
      setFreeingNumber(null);
    }
  };

  if (loading) {
    return (
      <div className="phone-number-list">
        <LoadingSpinner message="Loading phone numbers..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="phone-number-list">
        <ErrorMessage message={error} onRetry={fetchPhoneNumbers} />
      </div>
    );
  }

  if (phoneNumbers.length === 0) {
    return (
      <div className="phone-number-list">
        <div className="phone-number-list__empty">
          <div className="phone-number-list__empty-icon">📞</div>
          <h3>No Phone Numbers Available</h3>
          <p>Contact your administrator to configure inbound phone numbers.</p>
        </div>
      </div>
    );
  }

  // Filter phone numbers by country if toggle is ON
  const filteredNumbers = indianNumbersOnly
    ? phoneNumbers.filter((p) => p.phone_number.startsWith('+91'))
    : phoneNumbers;

  const availableCount = filteredNumbers.filter((p) => p.is_available).length;
  const totalCount = filteredNumbers.length;

  const handleFilterChange = (newValue) => {
    onFilterChange?.(newValue);
  };

  return (
    <div className="phone-number-list">
      <div className="phone-number-list__header">
        <h3 className="phone-number-list__title">Available Phone Numbers</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <div className="phone-number-list__stats">
            <span className="phone-number-list__stat phone-number-list__stat--available">
              {availableCount} {indianNumbersOnly ? 'Indian' : ''} Available
            </span>
            <span className="phone-number-list__stat phone-number-list__stat--total">
              {totalCount} {indianNumbersOnly ? 'Indian' : ''} Total
            </span>
          </div>
          <CountryFilterToggle
            active={indianNumbersOnly}
            onChange={handleFilterChange}
            label="Indian Numbers Only"
          />
        </div>
      </div>

      <div className="phone-number-list__grid">
        {filteredNumbers.length === 0 ? (
          <div className="phone-number-list__empty">
            <div className="phone-number-list__empty-icon">📞</div>
            <h3>No {indianNumbersOnly ? 'Indian ' : ''}Phone Numbers Available</h3>
            <p>
              {indianNumbersOnly 
                ? 'No Indian phone numbers are currently configured or available.'
                : 'Contact your administrator to configure inbound phone numbers.'}
            </p>
          </div>
        ) : (
          filteredNumbers.map((phone) => {
            const isBusy = !phone.is_available;
            const isInProgress = phone.active_job_status === 'inprogress';
            return (
              <PhoneNumberCard
                key={phone.phone_number}
                phoneNumber={phone.phone_number}
                isAvailable={phone.is_available}
                activeJobId={phone.active_job_id}
                activeJobStatus={phone.active_job_status}
                onSelect={onSelectPhone}
                selectable={selectable}
                canFree={isBusy}
                onFree={handleFreeNumber}
                isFreeing={freeingNumber === phone.phone_number}
                disabled={freeingNumber && freeingNumber !== phone.phone_number}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default PhoneNumberList;

