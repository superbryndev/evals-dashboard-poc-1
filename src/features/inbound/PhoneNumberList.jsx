import React, { useState, useEffect } from 'react';
import { getPhoneNumbers } from '../../services/api';
import PhoneNumberCard from './PhoneNumberCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import './PhoneNumberList.css';

/**
 * PhoneNumberList - Displays available phone numbers for inbound calls
 * 
 * @param {Object} props
 * @param {Function} props.onSelectPhone - Callback when phone number is selected (optional)
 * @param {boolean} props.selectable - Whether phone numbers are selectable (default: false)
 */
const PhoneNumberList = ({ onSelectPhone, selectable = false }) => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPhoneNumbers();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPhoneNumbers, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const availableCount = phoneNumbers.filter((p) => p.is_available).length;
  const totalCount = phoneNumbers.length;

  return (
    <div className="phone-number-list">
      <div className="phone-number-list__header">
        <h3 className="phone-number-list__title">Available Phone Numbers</h3>
        <div className="phone-number-list__stats">
          <span className="phone-number-list__stat phone-number-list__stat--available">
            {availableCount} Available
          </span>
          <span className="phone-number-list__stat phone-number-list__stat--total">
            {totalCount} Total
          </span>
        </div>
      </div>

      <div className="phone-number-list__grid">
        {phoneNumbers.map((phone) => (
          <PhoneNumberCard
            key={phone.phone_number}
            phoneNumber={phone.phone_number}
            isAvailable={phone.is_available}
            activeJobId={phone.active_job_id}
            activeJobStatus={phone.active_job_status}
            onSelect={onSelectPhone}
            selectable={selectable}
          />
        ))}
      </div>
    </div>
  );
};

export default PhoneNumberList;

