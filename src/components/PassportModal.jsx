import Badge from './Badge';
import { displayIdentity } from '../utils/memberUtils';

function PassportField({ label, value }) {
  return (
    <div className="passport-field">
      <span className="passport-field__label">{label}</span>
      <span className="passport-field__value">{value || '—'}</span>
    </div>
  );
}

export default function PassportModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="passport-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close passport">
          ×
        </button>

        <div className="passport-header">
          <img src="/dld-logo.png" alt="DLD logo" className="passport-logo" />
          <div>
            <p className="passport-kicker">Digital passport</p>
            <h2>{member.fullName}</h2>
            <p className="passport-subtitle">{member.whatsappDisplayName || 'No WhatsApp display name recorded'}</p>
          </div>
        </div>

        <div className="passport-badges">
          {member.verified && <Badge variant="verified">Verified</Badge>}
          {member.businessOwner && <Badge variant="owner">Business Owner</Badge>}
        </div>

        <div className="passport-grid">
          <PassportField label="Number used in DLD" value={member.groupNumber} />
          <PassportField label="Other Number" value={member.otherNumber} />
          <PassportField label="Age" value={member.age} />
          <PassportField label="Profession" value={member.profession} />
          <PassportField label="Area in UAE" value={member.uaeLocation} />
          <PassportField label="City/Town UK" value={member.ukLocation} />
          <PassportField label="Living status" value={member.livingStatus} />
          <PassportField label="Identity / social" value={displayIdentity(member)} />
        </div>
      </div>
    </div>
  );
}