import React, { useEffect, useState } from 'react';
import { listingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building2, Search, MapPin, DollarSign, Calendar, PlusCircle, CheckCircle2, X } from 'lucide-react';

export default function ListingsPage() {
  const { userProfile } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    title: 'Cozy Private Room in Modern Downtown Apartment',
    city: 'New York',
    locality: 'Manhattan',
    rent: 1600,
    deposit: 800,
    roomType: 'Private Room',
    bedrooms: 2,
    bathrooms: 1,
    availableFrom: '2026-08-15',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    amenities: ['High-Speed WiFi', 'Air Conditioning', 'In-unit Laundry', 'Furnished'],
    description: 'Beautiful, bright room with large window and built-in closet.',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = '';
      const params = new URLSearchParams();
      if (cityFilter) params.append('city', cityFilter);
      if (maxRent) params.append('maxRent', maxRent);
      if (params.toString()) query = `?${params.toString()}`;

      const data = await listingAPI.getListings(query);
      setListings(data || []);
    } catch (err) {
      console.warn('[Listings] Failed to fetch:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      await listingAPI.createListing(newListing);
      setShowCreateModal(false);
      fetchListings();
    } catch (err) {
      alert(err.message || 'Failed to create listing');
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300 mb-2">
            <Building2 className="w-4 h-4 text-accent-500" />
            <span>Verified PG & Flat Spots</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Available Rooms & Flat Spots</h1>
          <p className="text-xs text-slate-400 mt-1">Browse rooms listed by compatible hosts looking for roommates.</p>
        </div>

        {userProfile && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Spot / Room</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter by city (e.g. San Francisco, New York)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="w-full sm:w-48 relative">
          <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="number"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            placeholder="Max monthly rent $"
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <button
          onClick={fetchListings}
          className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center space-x-1.5"
        >
          <Search className="w-4 h-4 text-brand-400" />
          <span>Apply Filters</span>
        </button>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading available rooms...</div>
      ) : listings.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-3 max-w-md mx-auto">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Listings Found</h3>
          <p className="text-xs text-slate-400">Be the first host to post an available room in this city!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((list) => {
            const host = list.hostUserId || {};
            return (
              <div key={list._id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={list.images && list.images[0] ? list.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'}
                      alt={list.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      ${list.rent} / month
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-brand-400 font-semibold uppercase tracking-wider">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{list.roomType}</span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug line-clamp-2">{list.title}</h3>

                    <p className="text-xs text-slate-400 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{list.locality}, {list.city}</span>
                    </p>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{list.description}</p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(list.amenities || []).map((amenity, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-850 bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={host.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt={host.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-200">{host.name ? host.name.split(' ')[0] : 'Host'}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>From {new Date(list.availableFrom).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-accent-500" />
              <span>Post an Available Room / Spot</span>
            </h2>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Listing Title</label>
                <input
                  type="text"
                  required
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newListing.city}
                    onChange={(e) => setNewListing({ ...newListing, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Locality</label>
                  <input
                    type="text"
                    required
                    value={newListing.locality}
                    onChange={(e) => setNewListing({ ...newListing, locality: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Monthly Rent ($)</label>
                  <input
                    type="number"
                    required
                    value={newListing.rent}
                    onChange={(e) => setNewListing({ ...newListing, rent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Room Type</label>
                  <select
                    value={newListing.roomType}
                    onChange={(e) => setNewListing({ ...newListing, roomType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                  >
                    <option value="Private Room">Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Entire Flat/Apartment">Entire Flat/Apartment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 text-white font-bold"
                >
                  Publish Spot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
