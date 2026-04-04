export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Booking {
  id: string;
  tier_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  guest_count: number;
  special_requests: string | null;
  status: BookingStatus;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  tier_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_count: number;
  special_requests?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface BlockedDate {
  id: string;
  tier_id: string | null;
  start_date: string;
  end_date: string;
  reason: string | null;
  created_at: string;
}

export interface AvailabilityResponse {
  available: boolean;
  reason?: string;
}
