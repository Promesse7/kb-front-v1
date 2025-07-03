import React from 'react';

export default function BuyButton({ bookId, amount }) {
  const handleBuy = async () => {
    try {
      const res = await fetch('/api/paypack/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, amount }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert('Payment initiation failed.');
      }
    } catch (err) {
      alert('An error occurred.');
    }
  };

  return (
    <button
      onClick={handleBuy}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      Buy Book
    </button>
  );
}
