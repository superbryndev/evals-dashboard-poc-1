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
 * @param {boolean} props.canFree - Whether the number can be freed from the dashboard
 * @param {Function} props.onFree - Callback when the user clicks \"Free number\"
 * @param {boolean} props.isFreeing - Whether a free operation is in progress for this number
 * @param {boolean} props.disabled - Whether actions on this card are temporarily disabled
 */
const PhoneNumberCard = ({
  phoneNumber,
  isAvailable,
  activeJobId,
  activeJobStatus,
  onSelect,
  selectable = false,
  canFree = false,
  onFree,
  isFreeing = false,
  disabled = false,
}) => {
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    // Format Indian numbers: +918065171376 to +91 80 6517 1376
    if (cleaned.length === 13 && cleaned.startsWith('91')) {
      const number = cleaned.slice(2); // Remove country code
      return `+91 ${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`;
    }
    
    // Format US numbers: +19876543210 to +1 (987) 654-3210
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    return phone;
  };

  const handleFreeClick = () => {
    if (!onFree) return;
    onFree(phoneNumber);
  };

  const isInProgress = activeJobStatus === 'inprogress';

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
          disabled={!isAvailable || disabled}
        >
          {isAvailable ? 'Select' : 'Unavailable'}
        </button>
      )}

      {!isAvailable && canFree && (
        <button
          type="button"
          className="phone-number-card__free-btn"
          onClick={handleFreeClick}
          disabled={isInProgress || isFreeing || disabled}
        >
          {isInProgress ? 'In Progress' : isFreeing ? 'Freeing…' : 'Free number'}
        </button>
      )}
    </div>
  );
};

export default PhoneNumberCard;

