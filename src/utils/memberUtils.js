export function normaliseBool(value) {
  if (typeof value === 'boolean') return value;
  const text = String(value ?? '').trim().toLowerCase();
  return ['yes', 'y', 'true', '1', 'verified'].includes(text);
}

export function displayIdentity(member) {
  if (member.socialMedia?.trim()) return member.socialMedia.trim();
  if (member.eidUploaded) return 'EID uploaded';
  return 'Not provided';
}

export function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function filterMembers(members, filters) {
  return members.filter((member) => {
    const verifiedMatch =
      filters.verified === 'all' ||
      (filters.verified === 'verified' && member.verified) ||
      (filters.verified === 'not_verified' && !member.verified);

    const ukLocationMatch =
      !filters.ukLocation || member.ukLocation === filters.ukLocation;

    const professionMatch =
      !filters.profession ||
      member.profession.toLowerCase().includes(filters.profession.toLowerCase());

    const numberMatch =
      !filters.number ||
      member.groupNumber.toLowerCase().includes(filters.number.toLowerCase());

    return verifiedMatch && ukLocationMatch && professionMatch && numberMatch;
  });
}