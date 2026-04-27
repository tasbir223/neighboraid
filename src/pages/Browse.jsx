import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import { Button, Tabs, EmptyState } from '../components/UI'
import styles from './Browse.module.css'

const CATS = ['All', 'Tutoring', 'Food Donation', 'Moving Help', 'Errands', 'Other']

export default function Browse() {
  const { posts } = useApp()
  const [filterCat, setFilterCat] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [nearMe, setNearMe] = useState(false)
  const [userCity, setUserCity] = useState('')
  const [locLoading, setLocLoading] = useState(false)
  const [locError, setLocError] = useState('')

  const typeOptions = [
    { value: 'All', label: 'All' },
    { value: 'request', label: 'Requests' },
    { value: 'offer', label: 'Offers' },
  ]

  // Get unique locations from posts for suggestions
  const allLocations = [...new Set(posts.map(p => p.loc).filter(Boolean))].sort()

  const detectLocation = () => {
    setLocLoading(true)
    setLocError('')
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser.')
      setLocLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          const data = await res.json()
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || ''
          const state = data.address?.state || ''
          const detected = city ? `${city}, ${state}` : state
          setUserCity(detected)
          setLocationFilter(city)
          setNearMe(true)
        } catch {
          setLocError('Could not detect your location. Try typing it manually.')
        } finally {
          setLocLoading(false)
        }
      },
      () => {
        setLocError('Location access denied. Try typing your city manually.')
        setLocLoading(false)
      }
    )
  }

  const filtered = posts.filter(p => {
    if (filterCat !== 'All' && p.cat !== filterCat) return false
    if (filterType !== 'All' && p.type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      if (![p.title, p.desc, p.loc].join(' ').toLowerCase().includes(q)) return false
    }
    if (locationFilter.trim()) {
      const locQ = locationFilter.trim().toLowerCase()
      if (!p.loc?.toLowerCase().includes(locQ)) return false
    }
    return true
  })

  const clearAll = () => {
    setFilterCat('All')
    setFilterType('All')
    setSearch('')
    setLocationFilter('')
    setNearMe(false)
    setUserCity('')
  }

  const hasFilters = filterCat !== 'All' || filterType !== 'All' || search || locationFilter

  return (
    <div className={styles.page}>
      <div className={styles.wide}>
        <h2 className={styles.title}>Browse Community Posts</h2>
        <p className={styles.sub}>{filtered.length} post{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Search */}
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Location Filter */}
        <div className={styles.locationRow}>
          <div className={styles.locationInputWrap}>
            <span className={styles.locationIcon}>📍</span>
            <input
              type="text"
              placeholder="Filter by city or neighborhood..."
              value={locationFilter}
              onChange={e => { setLocationFilter(e.target.value); setNearMe(false) }}
              className={styles.locationInput}
              list="location-suggestions"
            />
            <datalist id="location-suggestions">
              {allLocations.map(loc => <option key={loc} value={loc} />)}
            </datalist>
            {locationFilter && (
              <button className={styles.clearLoc} onClick={() => { setLocationFilter(''); setNearMe(false) }}>✕</button>
            )}
          </div>
          <button
            className={`${styles.nearMeBtn} ${nearMe ? styles.nearMeActive : ''}`}
            onClick={nearMe ? () => { setNearMe(false); setLocationFilter(''); setUserCity('') } : detectLocation}
            disabled={locLoading}
          >
            {locLoading ? '📡 Detecting...' : nearMe ? `📍 ${userCity}` : '📡 Near me'}
          </button>
        </div>

        {locError && <p className={styles.locError}>{locError}</p>}

        {nearMe && userCity && (
          <div className={styles.nearMeBadge}>
            Showing posts near <strong>{userCity}</strong>
            <button onClick={() => { setNearMe(false); setLocationFilter(''); setUserCity('') }}>✕</button>
          </div>
        )}

        {/* Type Tabs */}
        <Tabs options={typeOptions} value={filterType} onChange={setFilterType} />

        {/* Category Filters */}
        <div className={styles.filters}>
          {CATS.map(c => (
            <button
              key={c}
              className={`${styles.filterBtn} ${filterCat === c ? styles.filterActive : ''}`}
              onClick={() => setFilterCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button className={styles.clearAll} onClick={clearAll}>
            ✕ Clear all filters
          </button>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔎"
            message={locationFilter ? `No posts found in "${locationFilter}". Try a different area or clear the location filter.` : 'No posts match your search.'}
            action={<Button variant="outline" onClick={clearAll}>Clear filters</Button>}
          />
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
