/**
 * # Cancel Page Component Tutorial
 * ---------------------------------
 * This component is displayed when a user cancels the payment process.
 * It provides feedback and options to try again.
 */

import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
// In a real app, you would use: import { XCircle } from "lucide-react";

const XCircle = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

export default function CancelPage() {
  return (
    <div className="container mx-auto max-w-md py-16 px-4">
      {/* Step 1: Create a visually appealing cancellation message */}
      <div className="text-center">
        {/* Cancellation icon */}
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <XCircle />
        </div>
        
        {/* Cancellation message */}
        <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">
          Your payment process was cancelled. No charges were made to your account.
        </p>
        
        {/* Try again button */}
        <Button asChild className="min-w-[200px]">
          <Link to="/">Try Again</Link>
        </Button>
      </div>
      
      {/* Step 2: Add tutorial notes */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">How This Works</h2>
        <p className="text-sm text-gray-600 mb-4">
          This page is displayed when Stripe redirects the user back to your application
          after they cancel the payment process. The URL for this page is provided in the 
          <code className="mx-1 px-1 py-0.5 bg-gray-200 rounded text-sm">cancel_url</code>
          parameter when creating the checkout session.
        </p>
        <p className="text-sm text-gray-600">
          In a real application, you might:
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
          <li>Offer alternative payment methods</li>
          <li>Provide customer support contact information</li>
          <li>Ask for feedback on why they cancelled</li>
          <li>Offer a discount to encourage completion</li>
        </ul>
      </div>
    </div>
  );
}
