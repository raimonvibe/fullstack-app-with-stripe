/**
 * # Payment Form Component Tutorial
 * ---------------------------------
 * This component displays products and handles Stripe checkout integration.
 * It demonstrates how to:
 * 1. Fetch products from your backend
 * 2. Display them in a user-friendly UI
 * 3. Initiate the Stripe checkout process
 */

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Price {
  id: string;
  currency: string;
  unit_amount: number;
  recurring: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  prices: Price[];
}

const getBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return 'https://fullstack-app-with-stripe.onrender.com';
  }
  return window.location.origin;
};

const validateUrl = (path: string): string => {
  try {
    const baseUrl = getBaseUrl();
    const url = new URL(path, baseUrl);
    const cleanPath = url.pathname.replace(/[^a-zA-Z0-9\/\-_]/g, '');
    return new URL(cleanPath, baseUrl).toString();
  } catch (error) {
    console.error('URL validation error:', error);
    const baseUrl = getBaseUrl();
    return `${baseUrl}${path}`;
  }
};

export default function PaymentForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/products`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once when component mounts

  const handleCheckout = async (priceId: string) => {
    try {
      console.log('Checkout initiated for price ID:', priceId);
      setCheckoutLoading(priceId);
      
      const successUrl = validateUrl('/success');
      const cancelUrl = validateUrl('/cancel');
      console.log('Environment:', import.meta.env.PROD ? 'production' : 'development');
      console.log('Base URL:', getBaseUrl());
      console.log('Constructed URLs - Success:', successUrl, 'Cancel:', cancelUrl);
      console.log('Window origin:', window.location.origin);
      
      console.log('API URL:', `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('Response data:', responseData);
      console.log('Backend received URLs - checking for manipulation');
      
      const { url } = responseData;
      
      console.log('Redirecting to:', url);
      window.location.href = url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to initiate checkout. Please try again later.');
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Payment Integration Tutorial</h1>
      <p className="text-gray-500 mb-8">Select a product to test the Stripe payment flow</p>
      
      {/* Display error message if there is one */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Display loading spinner while fetching products */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin text-gray-500 border-4 border-gray-300 border-t-gray-500 rounded-full"></div>
          <span className="ml-2 text-gray-500">Loading products...</span>
        </div>
      ) : (
        /* Display products in a grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {/* Product image */}
              {product.image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Product details */}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                {product.description && (
                  <CardDescription>{product.description}</CardDescription>
                )}
              </CardHeader>
              
              {/* Product prices */}
              <CardContent>
                <div className="space-y-4">
                  {product.prices.map((price) => (
                    <div key={price.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-lg">
                          {price.currency.toUpperCase()} {price.unit_amount.toFixed(2)}
                        </p>
                        {price.recurring && (
                          <p className="text-sm text-gray-500">Subscription</p>
                        )}
                      </div>
                      
                      {/* Checkout button */}
                      <Button 
                        onClick={() => handleCheckout(price.id)}
                        disabled={checkoutLoading === price.id}
                      >
                        {checkoutLoading === price.id ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                            Processing...
                          </>
                        ) : (
                          'Buy Now'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Tutorial instructions */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">How This Works</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>This component fetches products and prices from your Stripe account via your backend API</li>
          <li>When a user clicks "Buy Now", it creates a checkout session through your backend</li>
          <li>The user is redirected to Stripe's hosted checkout page to complete payment</li>
          <li>After payment, Stripe redirects back to your success or cancel page</li>
          <li>Stripe also sends a webhook event to your backend to confirm the payment</li>
        </ol>
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> In a real application, you would store order information in a database
            and use the webhook to update the order status when payment is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}
