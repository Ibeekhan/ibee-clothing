"use server";

import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations/checkout";
import { generateOrderNumber } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type CartItemInput = {
  variantId: string;
  quantity: number;
};

export async function placeOrder(formData: FormData, cartItems: CartItemInput[]) {
  // 1. Validate customer/shipping details.
  const raw = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    province: formData.get("province") as string,
    city: formData.get("city") as string,
    addressLine: formData.get("addressLine") as string,
    notes: (formData.get("notes") as string) || undefined,
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false as const, error: "Your cart is empty." };
  }

  const session = await getServerSession(authOptions);

  try {
    // 2. Run everything in a transaction: check stock, decrement it, create the order.
    // This prevents overselling if two customers check out the same low-stock item at once.
    const order = await prisma.$transaction(async (tx) => {
      // Resolve or create a guest customer record.
      let customerId: string;

      if (session?.user?.id) {
        const customer = await tx.customer.findUnique({ where: { userId: session.user.id } });
        if (!customer) throw new Error("Customer profile not found for logged-in user.");
        customerId = customer.id;
      } else {
        // Guest checkout: create a lightweight guest User + Customer.
        const guestUser = await tx.user.create({
          data: {
            email: `guest-${Date.now()}-${parsed.data.email}`,
            passwordHash: "GUEST_NO_LOGIN",
            customer: { create: { fullName: parsed.data.fullName, phone: parsed.data.phone } },
          },
          include: { customer: true },
        });
        customerId = guestUser.customer!.id;
      }

      const address = await tx.address.create({
        data: {
          customerId,
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          province: parsed.data.province,
          city: parsed.data.city,
          addressLine: parsed.data.addressLine,
        },
      });

      let subtotal = 0;
      const orderItemsData = [];

      for (const item of cartItems) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        if (!variant) throw new Error("One of the selected items no longer exists.");
        if (variant.stock < item.quantity) {
          throw new Error(`"${variant.product.name}" (${variant.color}, ${variant.size}) is out of stock.`);
        }

        // Decrement stock — never allowed to go negative (enforced by the check above).
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });

        const price = Number(variant.product.salePrice ?? variant.product.basePrice);
        subtotal += price * item.quantity;

        orderItemsData.push({
          variantId: variant.id,
          productName: variant.product.name,
          size: variant.size,
          color: variant.color,
          priceAtPurchase: price,
          quantity: item.quantity,
        });
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId,
          addressId: address.id,
          paymentMethod: "COD",
          paymentStatus: "PENDING",
          status: "PENDING",
          subtotal,
          total: subtotal, // shipping cost logic can be added here later
          notes: parsed.data.notes,
          items: { create: orderItemsData },
        },
      });

      return newOrder;
    });

    return { success: true as const, orderNumber: order.orderNumber };
  } catch (err: any) {
    console.error("Order creation failed:", err);
    return { success: false as const, error: err.message || "Failed to place order. Please try again." };
  }
}
