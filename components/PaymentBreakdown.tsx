'use client';

interface PaymentBreakdownProps {
  bidAmount: number;
  platformFeePercent?: number;
  showTotal?: boolean;
}

export default function PaymentBreakdown({ 
  bidAmount, 
  platformFeePercent = 12,
  showTotal = true 
}: PaymentBreakdownProps) {
  const platformFeeAmount = bidAmount * (platformFeePercent / 100);
  const totalAmount = bidAmount + platformFeeAmount;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200 p-6 space-y-3">
      <h3 className="font-bold text-gray-900 mb-4">Payment Breakdown</h3>
      
      {/* Bid Amount */}
      <div className="flex justify-between items-center">
        <span className="text-gray-700">
          Bid Amount
          <span className="text-sm text-gray-500 ml-1">(provider receives)</span>
        </span>
        <span className="font-semibold text-gray-900">€{bidAmount.toFixed(2)}</span>
      </div>
      
      {/* Platform Fee */}
      <div className="flex justify-between items-center pb-3 border-b-2 border-amber-200">
        <span className="text-gray-700">
          Platform Fee
          <span className="text-sm text-gray-500 ml-1">({platformFeePercent}%)</span>
        </span>
        <span className="font-semibold text-amber-700">€{platformFeeAmount.toFixed(2)}</span>
      </div>
      
      {/* Total */}
      {showTotal && (
        <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-3">
          <span className="font-bold text-gray-900">You Pay</span>
          <span className="font-bold text-lg text-amber-700">€{totalAmount.toFixed(2)}</span>
        </div>
      )}
      
      {/* Explanation */}
      <p className="text-xs text-gray-600 mt-3 bg-white rounded p-2">
        💡 The €{platformFeeAmount.toFixed(2)} platform fee helps us run the marketplace, handle payments safely, and support both you and providers.
      </p>
    </div>
  );
}
