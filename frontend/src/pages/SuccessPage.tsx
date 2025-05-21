/**
 * # Success Page Component Tutorial
 * ---------------------------------
 * This component is displayed after a successful payment.
 * It provides feedback to the user that their payment was processed successfully.
 */

import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
// In a real app, you would use: import { CheckCircle } from "lucide-react";

const CheckCircle = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default function SuccessPage() {
  return (
    <div className="container mx-auto max-w-md py-16 px-4">
      {/* Step 1: Create a visually appealing success message */}
      <div className="text-center">
        {/* Success icon */}
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <CheckCircle />
        </div>
        
        {/* Success message */}
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        
        {/* Return to home button */}
        <Button asChild className="min-w-[200px]">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
      
      {/* Step 2: Add tutorial notes */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">How This Works</h2>
        <p className="text-sm text-gray-600 mb-4">
          This page is displayed when Stripe redirects the user back to your application
          after a successful payment. The URL for this page is provided in the 
          <code className="mx-1 px-1 py-0.5 bg-gray-200 rounded text-sm">success_url</code>
          parameter when creating the checkout session.
        </p>
        <p className="text-sm text-gray-600">
          In a real application, you might:
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
          <li>Display order details</li>
          <li>Show a receipt or invoice</li>
          <li>Provide download links for digital products</li>
          <li>Send a confirmation email</li>
        </ul>
      </div>
    </div>
  );
}
