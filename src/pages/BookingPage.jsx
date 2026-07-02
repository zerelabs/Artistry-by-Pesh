import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './BookingPage.css';

const fallbackWorkshops = [
  {
    id: '1',
    title: 'Paint & Coffee',
    description: 'A relaxing morning session blending the rich aromas of coffee with the creative flow of painting.',
    price: 1299,
    image_url: '/images/experiences/exp_coffee_1782340955733.png',
    available_seats: 10,
    total_seats: 10
  },
  {
    id: '2',
    title: 'Couple Paint Night',
    description: 'An intimate evening designed for two. Create a shared masterpiece while enjoying a romantic, moody atmosphere.',
    price: 2999,
    image_url: '/images/experiences/exp_couple_1782340967267.png',
    available_seats: 8,
    total_seats: 8
  },
  {
    id: '3',
    title: 'Family Art Day',
    description: 'A vibrant, messy, and joyful session where families bond over colors and create lasting memories together.',
    price: 4999,
    image_url: '/images/experiences/exp_family_1782340980515.png',
    available_seats: 15,
    total_seats: 15
  },
  {
    id: '4',
    title: 'Birthday Art Party',
    description: 'Throw the most colorful party of the year. Music, laughter, and a personalized painting experience for you and your friends.',
    price: 24999,
    image_url: '/images/experiences/exp_birthday_1782340994906.png',
    available_seats: 20,
    total_seats: 20
  },
  {
    id: '5',
    title: 'Corporate Art Therapy',
    description: 'Break the routine. Our corporate sessions are designed to foster team collaboration, relieve stress, and spark innovation.',
    price: 29999,
    image_url: '/images/experiences/exp_corporate_1782341007227.png',
    available_seats: 30,
    total_seats: 30
  },
  {
    id: '6',
    title: 'Kids Creative Club',
    description: 'A safe, encouraging space for children to explore primary colors, textures, and their endless imagination.',
    price: 999,
    image_url: '/images/experiences/exp_kids_1782341019209.png',
    available_seats: 12,
    total_seats: 12
  }
];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', coupon: '' });
  const [processing, setProcessing] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    async function fetchWorkshop() {
      let data = null;
      let error = null;
      
      // Prevent Supabase from throwing a UUID malformed error if id is '1', '2', etc.
      if (id.length > 5) {
        const res = await supabase.from('workshops').select('*').eq('id', id).single();
        data = res.data;
        error = res.error;
      }
      
      if (error || !data) {
        const fallback = fallbackWorkshops.find(w => w.id === String(id));
        if (fallback) {
          setWorkshop(fallback);
        } else {
          alert("Workshop not found.");
          navigate('/experiences');
        }
      } else {
        setWorkshop(data);
      }
      setLoading(false);
    }
    fetchWorkshop();
  }, [id, navigate]);

  const applyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!formData.coupon) return;

    const { data, error } = await supabase.from('coupons').select('*').eq('code', formData.coupon.toUpperCase()).single();
    
    if (error || !data) {
      setCouponError('Invalid coupon code.');
      setDiscount(0);
    } else {
      setDiscount(data.discount_percentage);
      setCouponError('Coupon applied successfully!');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const finalPrice = workshop.price - (workshop.price * (discount / 100));

    setTimeout(async () => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_TEST_KEY", // Enter the Key ID generated from the Dashboard
        amount: Math.round(finalPrice * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Artistry by Pesh",
        description: `Booking: ${workshop.title}`,
        image: "/images/logo.png",
        handler: async function (response) {
          // If this is a fallback workshop (id is short like '1'), skip DB insertion entirely
          if (String(workshop.id).length < 5) {
            alert("Payment successful! Your booking is confirmed. (Demo Mode)");
            navigate('/experiences');
            return;
          }

          // 2. On Success, insert booking into DB
          // In prod, this happens securely via Webhook
          const { error } = await supabase.from('bookings').insert([{
            workshop_id: workshop.id,
            status: 'confirmed',
            amount_paid: finalPrice,
            razorpay_payment_id: response.razorpay_payment_id,
            guest_name: formData.name,
            guest_email: formData.email,
            guest_phone: formData.phone
          }]);
          
          if (!error) {
            // Decrement available seats
            await supabase.rpc('decrement_seats', { row_id: workshop.id });
            alert("Payment successful! Your booking is confirmed.");
            navigate('/experiences');
          } else {
            alert("Error saving booking: " + error.message);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#D4AF37" // Sunshine Gold
        }
      };

      // Dynamically load Razorpay script
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          if (window.Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        console.error("Payment Failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();
      setProcessing(false);
    }, 1000);
  };

  if (loading) return <div className="booking-loading">Loading Checkout...</div>;
  if (!workshop) return null;

  const finalPrice = workshop.price - (workshop.price * (discount / 100));

  return (
    <div className="booking-page page-container">
      <div className="booking-content">
        <div className="booking-summary">
          <h2>Order Summary</h2>
          <img src={workshop.image_url} alt={workshop.title} className="booking-image" />
          <div className="booking-details">
            <h3>{workshop.title}</h3>
            <p>{workshop.description}</p>
            <div className="booking-price-row">
              <span>Total Price</span>
              <strong style={{textDecoration: discount > 0 ? 'line-through' : 'none', opacity: discount > 0 ? 0.5 : 1}}>₹{workshop.price}</strong>
            </div>
            {discount > 0 && (
              <div className="booking-price-row" style={{borderTop: 'none', paddingTop: 0}}>
                <span style={{color: '#4caf50'}}>Discount applied ({discount}%)</span>
                <strong style={{color: '#4caf50'}}>₹{finalPrice}</strong>
              </div>
            )}
            <div className="booking-seats">
              <span>Available Seats:</span>
              <strong>{workshop.available_seats} / {workshop.total_seats}</strong>
            </div>
          </div>
        </div>

        <div className="booking-form-container">
          <h2>Guest Details</h2>
          
          <form className="booking-form" onSubmit={handleCheckout}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            
            <div className="form-group" style={{marginTop: '1rem'}}>
              <label>Have a coupon?</label>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <input type="text" placeholder="Enter code" value={formData.coupon} onChange={e => setFormData({...formData, coupon: e.target.value})} style={{flex: 1}} />
                <button type="button" onClick={applyCoupon} style={{padding: '0 1rem', background: '#333', color: '#fff', border: '1px solid #555', cursor: 'pointer', borderRadius: '4px'}}>Apply</button>
              </div>
              {couponError && <span style={{fontSize: '0.85rem', color: couponError.includes('successfully') ? '#4caf50' : '#ff4b4b', marginTop: '0.3rem'}}>{couponError}</span>}
            </div>

            <button type="submit" className="checkout-btn" disabled={processing || workshop.available_seats <= 0}>
              {workshop.available_seats <= 0 ? 'Sold Out' : processing ? 'Processing...' : `Pay ₹${finalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
