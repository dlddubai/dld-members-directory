export default function Filters({ filters, setFilters, ukLocations }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Filter members</h2>
      </div>
      <div className="filters-grid">
        <label>
          Verified
          <select
            value={filters.verified}
            onChange={(event) => setFilters((current) => ({ ...current, verified: event.target.value }))}
          >
            <option value="all">All</option>
            <option value="verified">Verified only</option>
            <option value="not_verified">Not verified</option>
          </select>
        </label>

        <label>
          UK Location
          <select
            value={filters.ukLocation}
            onChange={(event) => setFilters((current) => ({ ...current, ukLocation: event.target.value }))}
          >
            <option value="">All UK locations</option>
            {ukLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        <label>
          Search by number
          <input
            value={filters.number}
            onChange={(event) => setFilters((current) => ({ ...current, number: event.target.value }))}
            placeholder="e.g. +9715"
          />
        </label>

        <label>
          Search by profession
          <input
            value={filters.profession}
            onChange={(event) => setFilters((current) => ({ ...current, profession: event.target.value }))}
            placeholder="e.g. dentist"
          />
        </label>
      </div>
    </section>
  );
}