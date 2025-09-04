import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../api.jsx';

const ClubEnrollment = ({ club, onEnrollmentComplete, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleEnrollment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create payment order
      const response = await api.post('/payments/create-order', {
        clubId: club._id,
        amount: club.enrollmentFee || 500, // Default fee if not set
        currency: 'INR'
      });

      const { order, paymentId } = response.data;

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Sports App',
        description: `Enrollment in ${club.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: paymentId
            });

            if (verifyResponse.data.success) {
              setPaymentStatus('success');
              onEnrollmentComplete && onEnrollmentComplete(verifyResponse.data.player);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            setPaymentStatus('failed');
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Player Name',
          email: 'player@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      // Initialize Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Enrollment error:', error);
      setError(error.response?.data?.message || 'Failed to initiate enrollment');
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-4xl" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500 text-4xl" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Enrollment Successful!';
      case 'failed':
        return 'Enrollment Failed';
      default:
        return null;
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          {getStatusIcon()}
          <h3 className="text-2xl font-bold text-white mt-4 mb-2">
            {getStatusMessage()}
          </h3>
          <p className="text-gray-300 mb-6">
            Welcome to {club.name}! You are now enrolled.
          </p>
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 w-full"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Join {club.name}
          </h3>
          <p className="text-gray-300">
            Complete your enrollment with secure payment
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-300">Enrollment Fee:</span>
            <span className="text-2xl font-bold text-white">
              ₹{club.enrollmentFee || 500}
            </span>
          </div>
          
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              Access to all club facilities
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              Professional coaching sessions
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              Tournament participation
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              Performance tracking
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleEnrollment}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 w-full flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FaCreditCard className="mr-2" />
                Pay & Enroll Now
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-200 w-full"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <FaLock className="mr-2" />
            Secure payment powered by Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubEnrollment;
