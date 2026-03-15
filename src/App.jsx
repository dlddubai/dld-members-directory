import { useEffect, useMemo, useState } from 'react';
import LoginView from './components/LoginView';
import Filters from './components/Filters';
import MemberList from './components/MemberList';
import PassportModal from './components/PassportModal';
import AdminPanel from './components/AdminPanel';
import seedMembers from './data/members.json';
import { filterMembers, uniqueValues } from './utils/memberUtils';
import { isSupabaseConfigured, supabase } from './lib/supabase';

const DEMO_ADMIN = { email: 'admin@dld.local', password: 'dld12345', role: 'admin' };
const DEMO_VIEWER = { email: 'viewer@dld.local', password: 'dld12345', role: 'viewer' };
const STORAGE_KEY = 'dld-members-demo-data';
const SESSION_KEY = 'dld-members-session';

export default function App() {
  const [authState, setAuthState] = useState({ user: null, role: null, loading: true });
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filters, setFilters] = useState({
    verified: 'all',
    ukLocation: '',
    number: '',
    profession: '',
  });

  useEffect(() => {
    initialise();
  }, []);

  async function initialise() {
    const savedSession = window.localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setAuthState({
          user: { email: parsed.email },
          role: parsed.role,
          loading: false,
        });
      } catch {
        setAuthState({ user: null, role: null, loading: false });
      }
    } else {
      setAuthState({ user: null, role: null, loading: false });
    }

    if (isSupabaseConfigured) {
      await loadMembersFromSupabase();
    } else {
      const cached = window.localStorage.getItem(STORAGE_KEY);
      const parsed = cached ? JSON.parse(cached) : seedMembers;
      setMembers(parsed);
    }
  }

  async function loadMembersFromSupabase() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('full_name', { ascending: true });

    if (!error && data) {
      setMembers(
        data.map((member) => ({
          id: member.number_used,
          whatsappDisplayName: member.whatsapp_display ?? '',
          groupNumber: member.number_used ?? '',
          otherNumber: member.other_number ?? '',
          fullName: member.full_name ?? '',
          age: member.age ?? '',
          uaeLocation: member.uae_location ?? '',
          ukLocation: member.uk_location ?? '',
          profession: member.profession ?? '',
          livingStatus: member.living_status ?? '',
          socialMedia: member.social_media ?? '',
          eidUploaded:
            String(member.eid_uploaded).toLowerCase() === 'yes' || member.eid_uploaded === true,
          verified:
            String(member.verified).toLowerCase() === 'yes' || member.verified === true,
          businessOwner:
            String(member.business_owner).toLowerCase() === 'yes' || member.business_owner === true,
        }))
      );
    }
  }

  async function handleLogin(email, password) {
    if (
      (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) ||
      (email === DEMO_VIEWER.email && password === DEMO_VIEWER.password)
    ) {
      const role = email === DEMO_ADMIN.email ? DEMO_ADMIN.role : DEMO_VIEWER.role;
      const session = { email, role };
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setAuthState({ user: { email }, role, loading: false });
      return { error: null };
    }

    return { error: 'Invalid email or password.' };
  }

  async function handleLogout() {
    window.localStorage.removeItem(SESSION_KEY);
    setAuthState({ user: null, role: null, loading: false });
  }

  async function createMember(input) {
    if (isSupabaseConfigured) {
      await supabase.from('members').insert({
        whatsapp_display: input.whatsappDisplayName,
        number_used: input.groupNumber,
        other_number: input.otherNumber,
        full_name: input.fullName,
        age: input.age,
        uae_location: input.uaeLocation,
        uk_location: input.ukLocation,
        profession: input.profession,
        living_status: input.livingStatus,
        social_media: input.socialMedia,
        eid_uploaded: input.eidUploaded ? 'Yes' : 'No',
        verified: input.verified ? 'Yes' : 'No',
        business_owner: input.businessOwner ? 'Yes' : 'No',
      });
      await loadMembersFromSupabase();
      return;
    }

    const next = {
      id: crypto.randomUUID(),
      ...input,
    };
    const updated = [next, ...members].sort((a, b) => a.fullName.localeCompare(b.fullName));
    setMembers(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async function updateMember(input) {
    if (isSupabaseConfigured) {
      await supabase
        .from('members')
        .update({
          whatsapp_display: input.whatsappDisplayName,
          number_used: input.groupNumber,
          other_number: input.otherNumber,
          full_name: input.fullName,
          age: input.age,
          uae_location: input.uaeLocation,
          uk_location: input.ukLocation,
          profession: input.profession,
          living_status: input.livingStatus,
          social_media: input.socialMedia,
          eid_uploaded: input.eidUploaded ? 'Yes' : 'No',
          verified: input.verified ? 'Yes' : 'No',
          business_owner: input.businessOwner ? 'Yes' : 'No',
        })
        .eq('number_used', input.id);
      await loadMembersFromSupabase();
      return;
    }

    const updated = members
      .map((member) => (member.id === input.id ? input : member))
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    setMembers(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async function deleteMember(id) {
    if (isSupabaseConfigured) {
      await supabase.from('members').delete().eq('number_used', id);
      await loadMembersFromSupabase();
      return;
    }

    const updated = members.filter((member) => member.id !== id);
    setMembers(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const filteredMembers = useMemo(() => filterMembers(members, filters), [members, filters]);
  const ukLocations = useMemo(() => uniqueValues(members, 'ukLocation'), [members]);

  if (authState.loading) {
    return <div className="loading-shell">Loading DLD Members Directory…</div>;
  }

  if (!authState.user) {
    return <LoginView onLogin={handleLogin} modeLabel="Private shared-access mode is active." />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <img src="/dld-logo.png" alt="DLD logo" className="brand-logo" />
          <div>
            <h1>DLD Members Directory</h1>
            <p className="muted">
              Search the list, then tap a member to open their digital passport.
            </p>
          </div>
        </div>

        <div className="header-actions">
          <span className="header-user">{authState.user.email}</span>
          {authState.role === 'admin' && <span className="badge badge--owner">Admin</span>}
          <button className="secondary-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <main className="content-grid">
        <div className="content-column">
          <Filters filters={filters} setFilters={setFilters} ukLocations={ukLocations} />
          <MemberList members={filteredMembers} onSelect={setSelectedMember} />
        </div>

        {authState.role === 'admin' && (
          <div className="side-column">
            <AdminPanel
              members={members}
              onCreate={createMember}
              onUpdate={updateMember}
              onDelete={deleteMember}
            />
          </div>
        )}
      </main>

      <PassportModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
}
