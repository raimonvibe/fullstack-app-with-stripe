"""
Payment API Endpoints Tutorial
-----------------------------
This module contains the API endpoints for handling Stripe payment integration.
It demonstrates how to create checkout sessions, handle webhooks, and fetch products.
"""

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
import stripe
import os
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.getenv("STRIPE_API_KEY")

router = APIRouter()

class CreateCheckoutSessionRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str

@router.post("/create-checkout-session")
async def create_checkout_session(request: CreateCheckoutSessionRequest):
    """
    Creates a Stripe checkout session for processing payments.
    
    This endpoint:
    1. Takes a price ID and redirect URLs
    2. Creates a checkout session with Stripe
    3. Returns the session ID and URL for redirecting the user
    
    The frontend will use this URL to redirect users to Stripe's checkout page.
    """
    try:
        # For tutorial purposes, we'll simulate a checkout session
        # checkout_session = stripe.checkout.Session.create(
        #     payment_method_types=["card"],
        #     line_items=[
        #         {
        #             "price": request.price_id,
        #             "quantity": 1,
        #         },
        #     ],
        #     mode="payment",
        #     success_url=request.success_url,
        #     cancel_url=request.cancel_url,
        # )
        
        mock_session_id = f"cs_test_mock_{request.price_id}"
        
        # For tutorial purposes, we'll randomly send to success or cancel
        import random
        
        if request.price_id == "price_tutorial_ebook":
            redirect_url = request.success_url
        else:
            redirect_url = request.success_url if random.random() < 0.7 else request.cancel_url
            
        return {
            "id": mock_session_id,
            "url": redirect_url  # In a real app, this would be a Stripe URL
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def webhook_received(request: Request):
    """
    Handles webhook events from Stripe.
    
    Webhooks allow Stripe to notify your application when payment events occur,
    such as when a payment succeeds or fails.
    
    This is important because:
    1. Users might close their browser before returning to your success page
    2. It provides a secure way to confirm payment completion
    3. It allows you to update your database or fulfill orders automatically
    """
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    signature = request.headers.get("stripe-signature")
    
    try:
        data = await request.body()
        event = stripe.Webhook.construct_event(
            payload=data,
            sig_header=signature,
            secret=webhook_secret
        )
        
        if event.type == "checkout.session.completed":
            session = event.data.object
            print(f"Payment for {session.amount_total} was successful!")
            
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/products")
async def get_products():
    """
    Retrieves product and price information from Stripe.
    
    This endpoint:
    1. Fetches active products from Stripe
    2. For each product, fetches its associated prices
    3. Returns a formatted list of products with their prices
    
    The frontend will use this data to display products for purchase.
    """
    # For tutorial purposes, we'll return mock products instead of fetching from Stripe
    mock_products = [
        {
            "id": "prod_tutorial_basic",
            "name": "Basic Plan",
            "description": "Entry-level plan with essential features",
            "image": "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "prices": [
                {
                    "id": "price_tutorial_basic_monthly",
                    "currency": "usd",
                    "unit_amount": 9.99,
                    "recurring": True
                },
                {
                    "id": "price_tutorial_basic_yearly",
                    "currency": "usd",
                    "unit_amount": 99.99,
                    "recurring": True
                }
            ]
        },
        {
            "id": "prod_tutorial_premium",
            "name": "Premium Plan",
            "description": "Advanced features for professionals",
            "image": "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "prices": [
                {
                    "id": "price_tutorial_premium_monthly",
                    "currency": "usd",
                    "unit_amount": 29.99,
                    "recurring": True
                },
                {
                    "id": "price_tutorial_premium_yearly",
                    "currency": "usd",
                    "unit_amount": 299.99,
                    "recurring": True
                }
            ]
        },
        {
            "id": "prod_tutorial_ebook",
            "name": "Programming E-Book",
            "description": "Comprehensive guide to modern programming",
            "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "prices": [
                {
                    "id": "price_tutorial_ebook",
                    "currency": "usd",
                    "unit_amount": 19.99,
                    "recurring": False
                }
            ]
        }
    ]
    
    try:
        # products = stripe.Product.list(active=True)
        # formatted_products = []
        # for product in products.data:
        #     prices = stripe.Price.list(product=product.id, active=True)
        #     formatted_products.append({...})
        
        return {"products": mock_products}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
