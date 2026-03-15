import { useMemo, useState } from 'react';

const emptyForm = {
  whatsappDisplayName: '',
  groupNumber: '',
  otherNumber: '',
  fullName: '',
  age: '',
  uaeLocation: '',
  ukLocation: '',
  profession: '',
  livingStatus: '',
  socialMedia: '',
  eidUploaded: false,
  verified: false,
  businessOwner: false,
};

export default function AdminPanel({ members, onCreate, onUpdate, onDelete }) {
  const [selectedId, setSelectedId] = useState('');
  const selectedMember = useMemo(
    () => members.find((member) => String(member.id) === String(selectedId)) || null,
    [members, selectedId]
  );
  const [form, setForm] = useState(emptyForm);

  function loadMember(member) {
    if (!member) {
      setForm(emptyForm);
      return;
    }
    setForm({
      whatsappDisplayName: member.whatsappDisplayName || '',
      groupNumber: member.groupNumber || '',
      otherNumber: member.otherNumber || '',
      fullName: member.fullName || '',
      age: member.age || '',
      uaeLocation: member.uaeLocation || '',
      ukLocation: member.ukLocation || '',
      profession: member.profession || '',
      livingStatus: member.livingStatus || '',
      socialMedia: member.socialMedia || '',
      eidUploaded: Boolean(member.eidUploaded),
      verified: Boolean(member.verified),
      businessOwner: Boolean(member.businessOwner),
    });
  }

  function handleSelectChange(event) {
    const nextId = event.target.value;
    setSelectedId(nextId);
    const match = members.find((member) => String(member.id) === nextId);
    loadMember(match);
  }

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (selectedMember) {
      await onUpdate({ ...selectedMember, ...form });
    } else {
      await onCreate(form);
    }
    setSelectedId('');
    setForm(emptyForm);
  }

  async function handleDelete() {
    if (!selectedMember) return;
    const confirmed = window.confirm(`Delete ${selectedMember.fullName}?`);
    if (!confirmed) return;
    await onDelete(selectedMember.id);
    setSelectedId('');
    setForm(emptyForm);
  }

  return (
    <section className="panel admin-panel">
      <div className="panel-heading">
        <h2>Admin panel</h2>
      </div>

      <div className="admin-toolbar">
        <label>
          Edit member
          <select value={selectedId} onChange={handleSelectChange}>
            <option value="">Add a new member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.fullName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form className="admin-form" onSubmit={handleSave}>
        <label>Full Name<input value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} required /></label>
        <label>WhatsApp Display Name<input value={form.whatsappDisplayName} onChange={(e) => handleChange('whatsappDisplayName', e.target.value)} /></label>
        <label>Number used in DLD<input value={form.groupNumber} onChange={(e) => handleChange('groupNumber', e.target.value)} required /></label>
        <label>Other Number<input value={form.otherNumber} onChange={(e) => handleChange('otherNumber', e.target.value)} /></label>
        <label>Age<input value={form.age} onChange={(e) => handleChange('age', e.target.value)} /></label>
        <label>Area in UAE<input value={form.uaeLocation} onChange={(e) => handleChange('uaeLocation', e.target.value)} /></label>
        <label>City/Town UK<input value={form.ukLocation} onChange={(e) => handleChange('ukLocation', e.target.value)} /></label>
        <label>Profession<input value={form.profession} onChange={(e) => handleChange('profession', e.target.value)} /></label>
        <label>Living status<input value={form.livingStatus} onChange={(e) => handleChange('livingStatus', e.target.value)} /></label>
        <label>Social Media / LinkedIn<input value={form.socialMedia} onChange={(e) => handleChange('socialMedia', e.target.value)} /></label>

        <label className="checkbox-row"><input type="checkbox" checked={form.eidUploaded} onChange={(e) => handleChange('eidUploaded', e.target.checked)} />EID uploaded</label>
        <label className="checkbox-row"><input type="checkbox" checked={form.verified} onChange={(e) => handleChange('verified', e.target.checked)} />Verified</label>
        <label className="checkbox-row"><input type="checkbox" checked={form.businessOwner} onChange={(e) => handleChange('businessOwner', e.target.checked)} />Business Owner</label>

        <div className="admin-actions">
          <button type="submit">{selectedMember ? 'Save changes' : 'Add member'}</button>
          {selectedMember && (
            <button type="button" className="danger-button" onClick={handleDelete}>
              Delete member
            </button>
          )}
        </div>
      </form>
    </section>
  );
}