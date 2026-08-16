"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="ibee-container py-24 text-center">
        <h1 className="ibee-heading text-2xl mb-3">Your cart is empty</h1>
        <p className="text-black/60 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const estimatedDelivery = "3–5 business days";

  return (
    <div className="ibee-container py-12 grid md:grid-cols-[1fr_360px] gap-12">
      <div>
        <h1 className="ibee-heading text-2xl mb-8">Your Cart ({items.length})</h1>
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 border-b border-[var(--color-line)] pb-6">
              <div className="relative w-24 aspect-[4/5] bg-black/5 flex-shrink-0">
                {item.image && <Image src={item.image} alt={item.productName} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-medium text-sm">{item.productName}</Link>
                    <p className="text-xs text-black/60 mt-1">{item.color} / {item.size}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-[var(--color-line)] w-fit">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-3 py-1"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="px-3 py-1 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-xs text-black/50 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="border border-[var(--color-line)] p-6 h-fit">
        <h2 className="ibee-eyebrow mb-4">Order Summary</h2>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-black/60">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-black/60">Estimated delivery</span>
          <span>{estimatedDelivery}</span>
        </div>
        <div className="border-t border-[var(--color-line)] pt-4 flex justify-between font-semibold mb-6">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Link href="/checkout">
          <Button className="w-full">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
