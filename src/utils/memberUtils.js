export function normaliseBool(value) {
  if (typeof value === 'boolean') return value;
  const text = String(value ?? '').trim().toLowerCase();
  return ['yes', 'y', 'true', '1', 'verified'].includes(text);
}

export function displayIdentity(member) {
  if (String(member.socialMedia ?? '').trim()) return String(member.socialMedia).trim();
  if (member.eidUploaded) return 'EID uploaded';
  return 'Not provided';
}

export function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b))
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
      String(member.profession ?? '')
        .toLowerCase()
        .includes(String(filters.profession ?? '').toLowerCase());

    const numberMatch =
      !filters.number ||
      String(member.groupNumber ?? '').includes(String(filters.number ?? ''));

    return verifiedMatch && ukLocationMatch && professionMatch && numberMatch;
  });
}
