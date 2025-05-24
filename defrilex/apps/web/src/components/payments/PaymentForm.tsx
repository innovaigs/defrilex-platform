'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  paymentType: z.enum(['PROJECT_PAYMENT', 'MILESTONE_PAYMENT', 'ESCROW_RELEASE']),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  projectId: string;
  milestoneId?: string;
  defaultAmount?: number;
  defaultDescription?: string;
  paymentType: 'PROJECT_PAYMENT' | 'MILESTONE_PAYMENT' | 'ESCROW_RELEASE';
  onSuccess: (payment: any) => void;
  onCancel: () => void;
}

export function PaymentForm({
  projectId,
  milestoneId,
  defaultAmount = 0,
  defaultDescription = '',
  paymentType,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: defaultAmount,
      description: defaultDescription,
      paymentType,
    },
  });

  const amount = watch('amount');

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    try {
      // Create payment intent
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          milestoneId,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const paymentData = await response.json();
      
      // Simulate payment processing (in real implementation, this would use Stripe)
      await simulatePaymentProcessing(paymentData.clientSecret);
      
      toast.success('Payment processed successfully!');
      onSuccess(paymentData.payment);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const simulatePaymentProcessing = async (clientSecret: string) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would integrate with Stripe Elements
    // and handle the actual payment processing
    return {
      paymentIntent: {
        id: clientSecret.split('_secret_')[0],
        status: 'succeeded',
      },
    };
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(handlePaymentSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
          
          <Input
            label="Amount (USD)"
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', { valueAsNumber: true })}
            error={errors.amount?.message}
            placeholder="0.00"
          />

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Payment for project work..."
            rows={3}
          />

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(amount || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Processing Fee (2.9%):</span>
              <span className="text-sm text-gray-600">
                {formatCurrency((amount || 0) * 0.029)}
              </span>
            </div>
            <div className="border-t border-gray-200 mt-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">You'll Pay:</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatCurrency((amount || 0) * 1.029)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!showCardForm ? (
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => setShowCardForm(true)}
              className="w-full"
              size="lg"
            >
              Continue to Payment
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Card Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.cardholderName}
                  onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => handleCardInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                type="submit"
                isLoading={isProcessing}
                disabled={!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName}
                className="w-full"
                size="lg"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency((amount || 0) * 1.029)}`}
              </Button>
              <Button
                type="button"
                onClick={() => setShowCardForm(false)}
                variant="outline"
                className="w-full"
              >
                Back
              </Button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>🔒 Your payment information is secure and encrypted.</p>
              <p>This is a demo payment form. No real charges will be made.</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
