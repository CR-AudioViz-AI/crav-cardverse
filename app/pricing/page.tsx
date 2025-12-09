'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, Crown, Star, CreditCard, AlertCircle, Info } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with card collecting',
    stripePriceId: null,
    paypalPlanId: null,
    maxCards: 50,
    features: [
      '50 cards maximum',
      'Basic collection management',
      'Community access',
      'Daily trivia games',
      'Standard support',
    ],
    cta: 'Get Started',
    highlighted: false,
    icon: Star,
  },
  {
    name: 'Collector',
    price: '$9',
    period: '/month',
    annualPrice: '$86',
    description: 'For serious card collectors',
    stripePriceId: 'price_1SVgPr7YeQ1dZTUvOvs6XnxE',
    paypalPlanId: 'collector_monthly',
    maxCards: 500,
    features: [
      '500 cards maximum',
      'Advanced collection tools',
      'Trading marketplace access',
      'Exclusive card drops',
      'Priority support',
      'Collection analytics',
    ],
    cta: 'Start Collecting',
    highlighted: true,
    icon: Zap,
  },
  {
    name: 'Premium',
    price: '$29',
    period: '/month',
    annualPrice: '$278',
    description: 'Ultimate collecting experience',
    stripePriceId: 'price_1SVgPf7YeQ1dZTUvMqqmj8x4',
    paypalPlanId: 'premium_monthly',
    maxCards: Infinity,
    features: [
      'Unlimited cards',
      'Everything in Collector',
      'First access to new cards',
      'VIP events & giveaways',
      'Custom card requests',
      'White glove support',
      'API access',
    ],
    cta: 'Go Premium',
    highlighted: false,
    icon: Crown,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!plan.stripePriceId && !plan.paypalPlanId) {
      window.location.href = '/auth/signup';
      return;
    }

    setLoading(plan.name);

    try {
      if (paymentMethod === 'stripe' && plan.stripePriceId) {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: plan.stripePriceId,
            mode: 'subscription',
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } else if (paymentMethod === 'paypal' && plan.paypalPlanId) {
        const response = await fetch('/api/paypal/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: plan.paypalPlanId,
          }),
        });
        const data = await response.json();
        if (data.approvalUrl) {
          window.location.href = data.approvalUrl;
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Plan</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start free and upgrade as your collection grows. All plans include access to our community and trivia games.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isAnnual ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                isAnnual ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
            Annual <span className="text-green-400 text-xs ml-1">Save 20%</span>
          </span>
        </div>

        {/* Payment Method Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="text-gray-400 text-sm mr-2">Pay with:</span>
          <button
            onClick={() => setPaymentMethod('stripe')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
              paymentMethod === 'stripe'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Credit Card
          </button>
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
              paymentMethod === 'paypal'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.997c.06-.369.39-.641.762-.641h7.108c2.358 0 4.086.651 5.142 1.935.97 1.182 1.277 2.727.962 4.856-.338 2.274-1.277 4.005-2.793 5.148-1.399 1.054-3.307 1.589-5.67 1.589h-1.19c-.49 0-.882.33-.976.797l-.723 4.146c-.06.346-.366.606-.719.606H7.076zM17.043 6.526c-.255 1.712-.966 2.952-2.112 3.684-1.112.71-2.59 1.07-4.392 1.07h-.966c-.392 0-.711.27-.782.646l-.92 5.293c-.042.225.13.432.364.432h2.155c.345 0 .629-.236.697-.568l.029-.152.556-3.52.036-.195c.068-.332.352-.568.697-.568h.439c2.845 0 5.073-.958 5.723-3.734.271-1.16.13-2.127-.589-2.808-.22-.207-.49-.379-.8-.52l-.135-.06z"/>
            </svg>
            PayPal
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-purple-900/50 to-pink-900/30 border-2 border-purple-500'
                    : 'bg-gray-900/50 border border-gray-800'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${plan.highlighted ? 'bg-purple-500/30' : 'bg-gray-800'}`}>
                    <Icon className={`w-6 h-6 ${plan.highlighted ? 'text-purple-400' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {isAnnual && plan.annualPrice ? plan.annualPrice : plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">
                    {isAnnual && plan.annualPrice ? '/year' : plan.period}
                  </span>
                </div>

                <p className="text-gray-400 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.name}
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  } disabled:opacity-50`}
                >
                  {loading === plan.name ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Important Policy Notice */}
        <div className="mt-12 bg-gray-900/50 rounded-xl p-6 border border-gray-800 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-2">Downgrade Policy</h3>
              <p className="text-gray-400 text-sm">
                If you downgrade your plan, the change takes effect at your next renewal date. Your cards are never deleted - if you have more cards than your new plan allows, cards over the limit are simply hidden until you upgrade again or remove cards to fit within your plan&apos;s limit.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Can I upgrade my plan?</h3>
              <p className="text-gray-400 text-sm">Yes! Upgrades take effect immediately. You&apos;ll be charged a prorated amount for the remainder of your billing cycle.</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-2">What happens when I downgrade?</h3>
              <p className="text-gray-400 text-sm">Downgrades take effect at your next renewal date. If you have more cards than your new plan allows, extra cards are hidden (not deleted) until you upgrade or remove cards.</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-sm">We accept all major credit cards (Visa, Mastercard, Amex, Discover) through Stripe, as well as PayPal.</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">Yes! You can cancel your subscription at any time. Your access continues until the end of your current billing period, then you&apos;ll be moved to the Free plan.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Have questions? We&apos;re here to help.</p>
          <Link
            href="/contact"
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
