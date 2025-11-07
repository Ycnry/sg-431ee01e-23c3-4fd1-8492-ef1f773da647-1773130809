
# Smart Fundi Security Model - Anti-Fraud Payment Verification

## Overview
This document outlines the security architecture for subscription and promotion payments in Smart Fundi, designed to prevent fraud and ensure payment integrity.

## Core Security Principles

### 1. Webhook-Only Status Updates
- **User subscriptions and promotion status can ONLY be modified by webhook handlers**
- Frontend and user-accessible APIs have READ-ONLY access to subscription status
- No user can manually modify their own `isActive`, `expiryDate`, or `isPromoted` fields

### 2. Server-Side Verification
All subscription status checks are performed server-side:
- Search results filter providers through `/api/search/providers`
- This API checks `isActive = true` AND `expiryDate > today` before returning providers
- Frontend display is secondary - server is the source of truth

### 3. Payment Webhooks

#### Stripe Subscription Webhook (`/api/webhooks/stripe-subscription`)
- Receives payment events from Stripe
- Validates webhook signature (production)
- On success: Sets `isActive = true`, `expiryDate = +30 days`
- On failure/cancel: Sets `isActive = false`

#### M-Pesa Subscription Webhook (`/api/webhooks/mpesa-subscription`)
- Receives payment events from M-Pesa Daraja API
- Validates webhook secret (production)
- Validates payment amount matches subscription tier (5,000 TZS for fundi, 15,000 TZS for shop)
- On success: Sets `isActive = true`, `expiryDate = +30 days`
- On failure/cancel: Sets `isActive = false`

#### Promotion Payment Webhook (`/api/webhooks/promotion-payment`)
- Handles promotion listing payments (1,500 TZS/day)
- Calculates duration: `durationDays = paymentAmount / 1500`
- On success: Sets `isPromoted = true`, `promotionExpiry = +durationDays`
- On failure/cancel: No promotion granted

### 4. Database Security Rules

When connected to Supabase or Firebase:

```sql
-- Users can READ their own subscription status
SELECT * FROM subscriptions WHERE user_id = auth.uid()

-- Users CANNOT WRITE to subscription fields
-- Only service_role (webhooks) can write
UPDATE subscriptions 
SET is_active = true, expiry_date = '...'
WHERE user_id = '...'
-- This will FAIL for regular users, SUCCESS only for service_role
```

**Firebase Security Rules (when using Firebase):**
```javascript
{
  "rules": {
    "subscriptions": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "false"  // Users cannot write at all
      }
    }
  }
}
```

**Supabase RLS Policies (when using Supabase):**
```sql
-- Allow users to read their own subscription
CREATE POLICY "Users can read own subscription"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Only service_role can update subscriptions
-- No policy for regular users = they cannot update
```

### 5. Search Result Protection

The `/api/search/providers` endpoint enforces:
1. **Subscription validation**: Checks `subscriptionDb.isUserActiveAndValid(userId)`
2. **Expiry check**: Validates `expiryDate > currentDate`
3. **Promotion validation**: Checks `promotionExpiry > currentDate` if promoted
4. **Logging**: Logs filtered providers for audit trail

**Result**: Only active, paid providers appear in search results. Expired subscriptions are automatically hidden.

## Implementation Status

### ✅ Completed
- Webhook handlers for Stripe, M-Pesa, and promotions
- Server-side verification API (`/api/verify-subscription`)
- Protected search endpoint (`/api/search/providers`)
- Mock database layer with security rules (`subscriptionDb`)
- Type definitions for all payment structures

### 🔄 Migration Path (When Real Database Connected)

**Current**: localStorage simulation
**Future**: Supabase/Firebase

Migration steps:
1. Replace `subscriptionDb` localStorage functions with real database queries
2. Enable RLS/security rules in database
3. Configure webhook secrets in environment variables
4. Update webhook handlers to write to real database
5. Test with staging payment accounts before production

### Environment Variables Required (Production)

```env
# Webhook Secrets
STRIPE_WEBHOOK_SECRET=whsec_...
MPESA_WEBHOOK_SECRET=...
PROMOTION_WEBHOOK_SECRET=...

# Payment Gateway Credentials
STRIPE_SECRET_KEY=sk_live_...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...
MPESA_PASSKEY=...

# Database (Supabase or Firebase)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...  # For webhooks only
# OR
FIREBASE_SERVICE_ACCOUNT_KEY=...  # For webhooks only
```

## Anti-Fraud Measures

### 1. Amount Validation
M-Pesa webhook validates payment amount matches expected tier:
- Fundi: Must be exactly 5,000 TZS
- Shop: Must be exactly 15,000 TZS
- Rejects mismatched amounts

### 2. Transaction ID Tracking
All payments store unique `transactionId` for:
- Duplicate payment detection
- Audit trail
- Dispute resolution

### 3. Webhook Signature Verification
Production webhooks verify:
- Stripe: Webhook signature header
- M-Pesa: Webhook secret validation
- Rejects unauthorized requests

### 4. Server-Side Only Logic
Critical business logic runs server-side:
- Payment processing
- Status updates
- Search filtering
- All user-facing APIs are read-only for subscription data

## Testing

### Mock Data Setup
Run on app initialization:
```typescript
initializeMockSubscriptions()
```

Creates test subscriptions for:
- 3 fundis (varying expiry dates)
- 2 shops (varying expiry dates)
- Mix of promoted and non-promoted listings

### Test Scenarios
1. **Active subscription**: Provider appears in search
2. **Expired subscription**: Provider filtered from search
3. **Promoted listing**: Appears at top of search results
4. **Expired promotion**: Falls back to normal position
5. **User attempts status modification**: Blocked (would be blocked by DB rules in production)

## Monitoring & Logging

Webhook handlers log:
- Payment events received
- Status changes made
- Failed validations
- Filtered providers in search

Production should add:
- Real-time alerting for failed webhooks
- Dashboard for subscription metrics
- Audit log for all status changes

## Support & Troubleshooting

### Common Issues
1. **Provider not appearing in search**: Check subscription status and expiry date
2. **Payment processed but status not updated**: Check webhook delivery logs
3. **Promotion not showing**: Check `promotionExpiry > currentDate`

### Admin Override (Emergency Only)
In extreme cases, admin can manually update via database:
```sql
UPDATE subscriptions 
SET is_active = true, expiry_date = NOW() + INTERVAL '30 days'
WHERE user_id = 'user_id_here';
```
**Note**: This bypasses security and should only be used for legitimate support cases.

## Compliance
- All payment data encrypted in transit (HTTPS)
- Webhook secrets stored securely (environment variables, never in code)
- User subscription data access controlled by RLS/security rules
- Audit trail maintained for all status changes
