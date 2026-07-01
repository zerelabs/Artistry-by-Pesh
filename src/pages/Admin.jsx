import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

// Simple placeholder for Admin Dashboard
const WorkshopManager = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWorkshop, setNewWorkshop] = useState({
    title: '', overline: '', description: '', price: '', total_seats: '', image_url: '', accent_color: ''
  });

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    const { data, error } = await supabase.from('workshops').select('*').order('created_at', { ascending: false });
    if (!error) setWorkshops(data);
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('workshops').insert([{
      ...newWorkshop,
      price: parseFloat(newWorkshop.price),
      total_seats: parseInt(newWorkshop.total_seats),
      available_seats: parseInt(newWorkshop.total_seats)
    }]);
    if (!error) {
      setNewWorkshop({ title: '', overline: '', description: '', price: '', total_seats: '', image_url: '', accent_color: '' });
      fetchWorkshops();
    } else {
      alert("Error creating workshop: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await supabase.from('workshops').delete().eq('id', id);
      fetchWorkshops();
    }
  };

  return (
    <div className="workshop-manager">
      <h3>Manage Workshops</h3>
      <form onSubmit={handleCreate} className="admin-form">
        <input placeholder="Title" value={newWorkshop.title} onChange={e => setNewWorkshop({...newWorkshop, title: e.target.value})} required />
        <input placeholder="Overline (e.g. MASTERCLASS)" value={newWorkshop.overline} onChange={e => setNewWorkshop({...newWorkshop, overline: e.target.value})} required />
        <textarea placeholder="Description" value={newWorkshop.description} onChange={e => setNewWorkshop({...newWorkshop, description: e.target.value})} required />
        <input type="number" placeholder="Price (₹)" value={newWorkshop.price} onChange={e => setNewWorkshop({...newWorkshop, price: e.target.value})} required />
        <input type="number" placeholder="Total Seats" value={newWorkshop.total_seats} onChange={e => setNewWorkshop({...newWorkshop, total_seats: e.target.value})} required />
        <input placeholder="Image URL (e.g. /images/...)" value={newWorkshop.image_url} onChange={e => setNewWorkshop({...newWorkshop, image_url: e.target.value})} />
        <input placeholder="Accent Color (e.g. var(--color-sunshine-gold))" value={newWorkshop.accent_color} onChange={e => setNewWorkshop({...newWorkshop, accent_color: e.target.value})} />
        <button type="submit">Create Workshop</button>
      </form>

      <h4>Existing Workshops</h4>
      {loading ? <p>Loading...</p> : (
        <div className="admin-list">
          {workshops.map(w => (
            <div key={w.id} className="admin-list-item">
              <div>
                <strong>{w.title}</strong> - ₹{w.price} ({w.available_seats}/{w.total_seats} seats)
              </div>
              <button onClick={() => handleDelete(w.id)} className="delete-btn">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        workshops(title)
      `)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setBookings(data);
    }
  };

  return (
    <div className="workshop-manager">
      <h3>Recent Bookings</h3>
      {bookings.length === 0 ? <p>No bookings yet.</p> : (
        <div className="admin-list">
          {bookings.map(b => (
            <div key={b.id} className="admin-list-item">
              <div>
                <h4 style={{margin: '0 0 0.5rem 0'}}>{b.workshops?.title}</h4>
                <p style={{margin: 0, fontSize: '0.9rem', color: '#ccc'}}>
                  Status: <strong>{b.status}</strong> | Paid: ₹{b.amount_paid} <br/>
                  Booking ID: <span style={{fontSize: '0.7rem'}}>{b.id}</span>
                </p>
              </div>
              <div style={{color: '#888', fontSize: '0.8rem'}}>
                {new Date(b.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CouponsManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_percentage: '' });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (data) setCoupons(data);
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('coupons').insert([{
      code: newCoupon.code.toUpperCase(),
      discount_percentage: parseInt(newCoupon.discount_percentage)
    }]);
    if (!error) {
      setNewCoupon({ code: '', discount_percentage: '' });
      fetchCoupons();
    } else {
      alert(error.message);
    }
  };

  const deleteCoupon = async (code) => {
    await supabase.from('coupons').delete().eq('code', code);
    fetchCoupons();
  };

  return (
    <div className="workshop-manager">
      <h3>Coupons Manager</h3>
      <form onSubmit={createCoupon} className="admin-form">
        <input type="text" placeholder="Coupon Code (e.g. SUMMER20)" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} required />
        <input type="number" placeholder="Discount % (e.g. 20)" value={newCoupon.discount_percentage} onChange={e => setNewCoupon({...newCoupon, discount_percentage: e.target.value})} required min="1" max="100" />
        <button type="submit">Create Coupon</button>
      </form>

      <div className="admin-list">
        {coupons.map(c => (
          <div key={c.code} className="admin-list-item">
            <div>
              <h4 style={{margin: '0 0 0.5rem 0'}}>{c.code}</h4>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#ccc'}}>Discount: {c.discount_percentage}%</p>
            </div>
            <button className="delete-btn" onClick={() => deleteCoupon(c.code)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomersManager = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    // A simplified unique customer list based on bookings
    const { data } = await supabase.from('bookings').select('guest_email, guest_name, guest_phone, created_at').order('created_at', { ascending: false });
    
    if (data) {
      // Filter to unique emails
      const unique = data.filter((v, i, a) => a.findIndex(t => (t.guest_email === v.guest_email)) === i);
      setCustomers(unique);
    }
  };

  return (
    <div className="workshop-manager">
      <h3>Customer Database</h3>
      <p style={{marginBottom: '2rem', color: '#888'}}>List of unique guests who have booked a workshop.</p>
      
      <div className="admin-list">
        {customers.map((c, idx) => (
          <div key={idx} className="admin-list-item">
            <div>
              <h4 style={{margin: '0 0 0.5rem 0'}}>{c.guest_name || 'Guest'}</h4>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#ccc'}}>Email: {c.guest_email}</p>
              <p style={{margin: 0, fontSize: '0.9rem', color: '#ccc'}}>Phone: {c.guest_phone || 'N/A'}</p>
            </div>
          </div>
        ))}
        {customers.length === 0 && <p>No customers yet.</p>}
      </div>
    </div>
  );
};

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('workshops');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setAuthError(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="admin-loading">Loading Admin...</div>;

  if (!session) {
    return (
      <div className="admin-login-container">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h2>Admin Login</h2>
          {authError && <div className="admin-error">{authError}</div>}
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="admin-logout">Logout</button>
      </header>
      
      <div className="admin-content">
        <aside className="admin-sidebar">
          <button className={`admin-nav-item ${activeTab === 'workshops' ? 'active' : ''}`} onClick={() => setActiveTab('workshops')}>Workshops</button>
          <button className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
          <button className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>Customers</button>
          <button className={`admin-nav-item ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => setActiveTab('coupons')}>Coupons</button>
        </aside>
        
        <main className="admin-main">
          {activeTab === 'workshops' && <WorkshopManager />}
          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'customers' && <CustomersManager />}
          {activeTab === 'coupons' && <CouponsManager />}
        </main>
      </div>
    </div>
  );
}
