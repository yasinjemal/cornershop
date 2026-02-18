"use client";

// ============================================
// Shopping Cart — Client-side state with localStorage
// ============================================

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, PricingTierData } from "@/types";
import { calculateTieredPrice } from "@/lib/utils";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: {
        productId: string;
        name: string;
        imageUrl: string;
        basePrice: number;
        quantity: number;
        pricingTiers: PricingTierData[];
      };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

function recalcUnitPrice(item: CartItem): CartItem {
  return {
    ...item,
    unitPrice: calculateTieredPrice(
      item.basePrice,
      item.quantity,
      item.pricingTiers
    ),
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existing) {
        const updated = state.items.map((i) =>
          i.productId === action.payload.productId
            ? recalcUnitPrice({
                ...i,
                quantity: i.quantity + action.payload.quantity,
              })
            : i
        );
        return { items: updated };
      }
      const newItem = recalcUnitPrice({
        productId: action.payload.productId,
        name: action.payload.name,
        imageUrl: action.payload.imageUrl,
        basePrice: action.payload.basePrice,
        quantity: action.payload.quantity,
        unitPrice: action.payload.basePrice,
        pricingTiers: action.payload.pricingTiers,
      });
      return { items: [...state.items, newItem] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.productId !== action.payload),
      };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) => i.productId !== action.payload.productId
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? recalcUnitPrice({ ...i, quantity: action.payload.quantity })
            : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.payload };
    default:
      return state;
  }
}

type AddItemPayload = {
  productId: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  quantity: number;
  pricingTiers: PricingTierData[];
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: AddItemPayload) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("menscorner-cart");
      if (stored) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(stored) });
      }
    } catch {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("menscorner-cart", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (payload) => dispatch({ type: "ADD_ITEM", payload }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQuantity: (productId, quantity) =>
          dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
