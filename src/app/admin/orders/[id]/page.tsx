'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Mail, Calendar, Clock } from 'lucide-react';

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: Array<{
    product: { _id: string; name: string; price: number; images: string[] };
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrderDetail() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (response.ok) {
          setOrder(await response.json());
        } else {
          setError('Order not found');
        }
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrder(await response.json());
      } else {
        setError('Failed to update order status');
      }
    } catch {
      setError('Network error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-destructive">{error || 'Order not found'}</p>
          <Link
            href="/admin/orders"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Orders
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Order #{order._id.slice(-8)}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              statusStyles[order.status] || 'bg-secondary text-secondary-foreground'
            }`}
          >
            {order.status}
          </span>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground mb-4">Order Items</h2>
              <div className="flex flex-col gap-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg border border-border p-3"
                  >
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${item.product.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-card-foreground">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="text-lg font-bold text-card-foreground">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Details */}
          <div className="flex flex-col gap-4">
            {/* Status Update */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground mb-3">Update Status</h2>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Updated: {new Date(order.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground mb-3">Customer</h2>
              <div className="flex flex-col gap-2.5">
                <p className="text-sm font-medium text-card-foreground">
                  {order.user?.name || 'Unknown'}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{order.user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  <div>
                    {order.shippingAddress ? (
                      <>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                      </>
                    ) : (
                      <p>No shipping address provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
