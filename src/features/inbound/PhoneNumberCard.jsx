import React from 'react';
import './PhoneNumberCard.css';

/**
 * PhoneNumberCard - Displays a single phone number with capacity and status
 * 
 * @param {Object} props
 * @param {string} props.phoneNumber - The phone number to display
 * @param {boolean} props.isAvailable - Whether the phone number is available
 * @param {string} props.activeJobId - ID of active job (if any)
 * @param {string} props.activeJobStatus - Status of active job
 * @param {Function} props.onSelect - Callback when phone number is selected
 * @param {boolean} props.selectable - Whether the card is selectable
 */
const PhoneNumberCard = ({
  phoneNumber,
  isAvailable,
  activeJobId,
  activeJobStatus,
  onSelect,
  selectable = false,
}) => {
  const formatPhoneNumber = (phone) => {
    // Format +19876543210 to +1 (987) 654-3210
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <div className={`phone-number-card ${isAvailable ? 'phone-number-card--available' : 'phone-number-card--busy'}`}>
      <div className="phone-number-card__header">
        <div className="phone-number-card__icon">📞</div>
        <div className="phone-number-card__info">
          <div className="phone-number-card__number">
            {formatPhoneNumber(phoneNumber)}
          </div>
          <div className="phone-number-card__status">
            {isAvailable ? (
              <span className="phone-number-card__status-badge phone-number-card__status-badge--available">
                🟢 Available
              </span>
            ) : (
              <span className="phone-number-card__status-badge phone-number-card__status-badge--busy">
                🔵 In Use
              </span>
            )}
          </div>
        </div>
      </div>

      {!isAvailable && activeJobId && (
        <div className="phone-number-card__active-job">
          <div className="phone-number-card__label">Active Job:</div>
          <div className="phone-number-card__value">
            {activeJobId.substring(0, 8)}... • {activeJobStatus}
          </div>
        </div>
      )}

      {selectable && (
        <button
          className="phone-number-card__select-btn"
          onClick={() => onSelect?.(phoneNumber)}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Select' : 'Unavailable'}
        </button>
      )}
    </div>
  );
};

export default PhoneNumberCard;

