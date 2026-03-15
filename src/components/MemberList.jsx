import Badge from './Badge';

export default function MemberList({ members, onSelect }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Members</h2>
        <span className="count-pill">{members.length}</span>
      </div>

      <div className="member-list">
        {members.map((member) => (
          <button key={member.id} className="member-row" onClick={() => onSelect(member)}>
            <div className="member-row__main">
              <div className="member-row__name">{member.fullName}</div>
              <div className="member-row__number">{member.groupNumber || 'Number not provided'}</div>
            </div>
            <div className="member-row__badges">
              {member.verified && <Badge variant="verified">Verified</Badge>}
              {member.businessOwner && <Badge variant="owner">Business Owner</Badge>}
            </div>
          </button>
        ))}
        {members.length === 0 && <div className="empty-state">No members match the current filters.</div>}
      </div>
    </section>
  );
}