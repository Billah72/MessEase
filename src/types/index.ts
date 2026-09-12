export type Role = 'MANAGER' | 'MEMBER';

export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';

export type ExpenseCategory = 
  | 'BAZAR'
  | 'MAID_SALARY'
  | 'GAS_CYLINDER'
  | 'ELECTRICITY'
  | 'INTERNET'
  | 'WATER'
  | 'CLEANING'
  | 'MAINTENANCE'
  | 'MISC';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type MealRequestType = 'EXTRA_MEAL' | 'MEAL_REMOVAL';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

export type AnnouncementCategory = 'GENERAL' | 'FOOD' | 'PAYMENT' | 'BAZAR' | 'MAINTENANCE' | 'EMERGENCY';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl: string;
  roomNo?: string;
  joinDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  password?: string; // For member credential login
  isGoogleUser?: boolean;
}

export interface MealRecord {
  id: string;
  date: string; // YYYY-MM-DD
  memberId: string;
  memberName: string;
  breakfast: number; // 0, 0.5, 1, 2...
  lunch: number; // 0, 1, 2, 3...
  dinner: number; // 0, 1, 2, 3...
  guestMeals: number; // 0, 1, 2...
  notes?: string;
  updatedAt: string;
}

export interface MealInfo {
  date: string;
  mealType: MealType;
  menu: string;
  expectedMealCount: number;
  actualMealCount: number;
  notes?: string;
}

export interface MealRequest {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberAvatar?: string;
  requestType: MealRequestType; // 'EXTRA_MEAL' | 'MEAL_REMOVAL'
  date: string; // YYYY-MM-DD
  mealType: MealType; // 'BREAKFAST' | 'LUNCH' | 'DINNER'
  extraCount: number; // e.g. 1 for extra, 0 for removal
  reason: string; // e.g. "Guest visiting" or "Outside for exam"
  note?: string;
  status: RequestStatus; // 'PENDING' | 'APPROVED' | 'DECLINED'
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  responseNote?: string;
}

export interface BazarItem {
  id: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'liter' | 'piece' | 'dozen' | 'packet' | 'bundle' | 'gm';
  unitPrice: number;
  totalPrice: number;
  category: 'VEGETABLES' | 'MEAT_FISH' | 'GROCERY_OIL' | 'SPICES' | 'DAIRY_EGG' | 'MISC';
}

export interface BazarTrip {
  id: string;
  date: string; // YYYY-MM-DD
  shopperMemberId: string;
  shopperName: string;
  storeName: string;
  items: BazarItem[];
  totalAmount: number;
  receiptImage?: string;
  notes?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'DEPOSIT' | 'EXPENSE';
  category: ExpenseCategory | 'MEMBER_DEPOSIT';
  memberId?: string;
  memberName?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  trxId?: string;
  description: string;
  receiptUrl?: string;
  recordedBy: string;
  status: 'VERIFIED' | 'PENDING';
  createdAt: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  amount: number;
  description: string;
  paidByName?: string;
  createdAt: string;
}

export interface ResponsibilityAssignment {
  id: string;
  date: string; // YYYY-MM-DD
  bazarDutyMemberIds: string[];
  cookingDutyMemberIds: string[];
  cleaningDutyMemberIds: string[];
  shiftNote?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  isImportant?: boolean;
  authorName: string;
  isPinned: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // target user ID or 'ALL'
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'URGENT';
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: Role;
  action: string;
  details: string;
}

export interface MessSettings {
  messName: string;
  tagline: string;
  address: string;
  contactNumber: string;
  description: string;
  currencySymbol: string;
  activeMonth: string; // YYYY-MM
  breakfastCostRatio: number; // default 0.5
  lunchCostRatio: number; // default 1.0
  dinnerCostRatio: number; // default 1.0
  fixedCostPerMember: number; // Shared utility per head
  mealScheduleNotes: string;
}

export interface MemberFinancialSummary {
  memberId: string;
  memberName: string;
  email: string;
  roomNo?: string;
  avatarUrl: string;
  totalDeposited: number;
  totalBreakfast: number;
  totalLunch: number;
  totalDinner: number;
  totalGuestMeals: number;
  totalMealsCount: number;
  mealCost: number;
  sharedFixedCost: number;
  totalCost: number;
  balance: number; // totalDeposited - totalCost (positive = Advance, negative = Due)
  status: 'ADVANCE' | 'BALANCED' | 'DUE';
}

export interface MessOverallStats {
  totalFundDeposits: number;
  totalExpenses: number;
  totalBazarCost: number;
  totalUtilityCost: number;
  currentMessBalance: number;
  totalMealsConsumed: number;
  currentMealRate: number;
  activeMemberCount: number;
  totalDueAmount: number;
  totalAdvanceAmount: number;
  todayMealCount: {
    breakfast: number;
    lunch: number;
    dinner: number;
    total: number;
  };
  tomorrowMealCount: {
    breakfast: number;
    lunch: number;
    dinner: number;
    total: number;
  };
  todayExpenseTotal: number;
  pendingMealRequestsCount: number;
}
