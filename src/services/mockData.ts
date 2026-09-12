import { 
  User, 
  MealRecord, 
  MealRequest, 
  MealInfo,
  BazarTrip, 
  Transaction, 
  Expense, 
  ResponsibilityAssignment, 
  Announcement, 
  NotificationItem, 
  ActivityLogItem, 
  MessSettings 
} from '../types';

export const INITIAL_SETTINGS: MessSettings = {
  messName: 'Green View Mess',
  tagline: 'Smart Bachelor & Shared Mess Management System',
  address: 'House 42, Road 9/A, Dhanmondi, Dhaka-1209',
  contactNumber: '+880 1712-345678',
  description: 'Shared student and bachelor mess operating in Dhanmondi with 3 daily fresh meals.',
  currencySymbol: '৳',
  activeMonth: '2026-09',
  breakfastCostRatio: 0.5,
  lunchCostRatio: 1.0,
  dinnerCostRatio: 1.0,
  fixedCostPerMember: 850,
  mealScheduleNotes: 'Breakfast: 8:00 AM, Lunch: 1:30 PM, Dinner: 9:30 PM. Request changes by 4:00 PM.'
};

export const INITIAL_USERS: User[] = [
  // Exactly 1 Manager
  {
    id: 'user-manager',
    name: 'Sakib Hasan',
    email: 'manager@greenview.com',
    phone: '+880 1711-200202',
    role: 'MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    roomNo: 'Room 401 (Manager Office)',
    joinDate: '2025-01-01',
    status: 'ACTIVE',
    isGoogleUser: true
  },
  // 6 Regular Members (Credentials provided by Manager)
  {
    id: 'user-1',
    name: 'Arifur Rahman',
    email: 'arifur@gmail.com',
    phone: '+880 1715-500505',
    role: 'MEMBER',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    roomNo: 'Room 402',
    joinDate: '2025-02-01',
    status: 'ACTIVE',
    password: 'member123'
  },
  {
    id: 'user-2',
    name: 'Nayeem Islam',
    email: 'nayeem@gmail.com',
    phone: '+880 1816-600606',
    role: 'MEMBER',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    roomNo: 'Room 402',
    joinDate: '2025-02-15',
    status: 'ACTIVE',
    password: 'member123'
  },
  {
    id: 'user-3',
    name: 'Hasan Mahmud',
    email: 'hasan@gmail.com',
    phone: '+880 1917-700707',
    role: 'MEMBER',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    roomNo: 'Room 403',
    joinDate: '2025-03-01',
    status: 'ACTIVE',
    password: 'member123'
  },
  {
    id: 'user-4',
    name: 'Mehedi Hasan',
    email: 'mehedi@gmail.com',
    phone: '+880 1518-800808',
    role: 'MEMBER',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    roomNo: 'Room 403',
    joinDate: '2025-03-15',
    status: 'ACTIVE',
    password: 'member123'
  },
  {
    id: 'user-5',
    name: 'Shafiul Alam',
    email: 'shafiul@gmail.com',
    phone: '+880 1719-900909',
    role: 'MEMBER',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    roomNo: 'Room 404',
    joinDate: '2025-04-01',
    status: 'ACTIVE',
    password: 'member123'
  },
  {
    id: 'user-6',
    name: 'Tariqul Islam',
    email: 'tariqul@gmail.com',
    phone: '+880 1620-000001',
    role: 'MEMBER',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    roomNo: 'Room 404',
    joinDate: '2025-04-15',
    status: 'ACTIVE',
    password: 'member123'
  }
];

export const INITIAL_MEAL_INFOS: MealInfo[] = [
  {
    date: '2026-09-12',
    mealType: 'BREAKFAST',
    menu: 'Egg Omelette, Paratha & Tea (ডিম পরোটা ও চা)',
    expectedMealCount: 6,
    actualMealCount: 6,
    notes: 'Breakfast served 8:00 AM'
  },
  {
    date: '2026-09-12',
    mealType: 'LUNCH',
    menu: 'Katla Fish Curry, Lentils (Dal), Potol Bhaji & Steamed Rice',
    expectedMealCount: 6,
    actualMealCount: 6
  },
  {
    date: '2026-09-12',
    mealType: 'DINNER',
    menu: 'Sonali Chicken Bhuna, Salad & Steamed Rice',
    expectedMealCount: 7,
    actualMealCount: 7,
    notes: 'Arifur has 1 guest dinner'
  },
  {
    date: '2026-09-13',
    mealType: 'BREAKFAST',
    menu: 'Khichuri & Dim Bhuna (খিচুড়ি ও ডিম ভুনা)',
    expectedMealCount: 6,
    actualMealCount: 6
  },
  {
    date: '2026-09-13',
    mealType: 'LUNCH',
    menu: 'Rui Fish Kalia, Mixed Vegetables & Rice',
    expectedMealCount: 6,
    actualMealCount: 6
  },
  {
    date: '2026-09-13',
    mealType: 'DINNER',
    menu: 'Egg Curry, Red Spinach (Lal Shak) & Rice',
    expectedMealCount: 6,
    actualMealCount: 6
  }
];

// Generate Realistic 13 days of Meal Records for September 2026
export const generateInitialMeals = (): MealRecord[] => {
  const records: MealRecord[] = [];
  const dates = Array.from({ length: 13 }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return `2026-09-${day}`;
  });

  const members = INITIAL_USERS.filter(u => u.role === 'MEMBER');

  members.forEach((user, uIdx) => {
    dates.forEach((date, dIdx) => {
      let breakfast = 1;
      let lunch = 1;
      let dinner = 1;
      let guestMeals = 0;

      if (uIdx === 0 && dIdx === 11) {
        // Arifur has 1 guest dinner today (12th Sept)
        guestMeals = 1;
      } else if (uIdx === 1 && dIdx === 5) {
        // Nayeem was outside for lunch on Sept 6
        lunch = 0;
      } else if (uIdx === 3 && dIdx % 3 === 0) {
        // Mehedi skipped breakfast
        breakfast = 0;
      }

      records.push({
        id: `meal-${user.id}-${date}`,
        date,
        memberId: user.id,
        memberName: user.name,
        breakfast,
        lunch,
        dinner,
        guestMeals,
        updatedAt: `${date} 09:00:00`
      });
    });
  });

  return records;
};

export const INITIAL_MEAL_REQUESTS: MealRequest[] = [
  {
    id: 'req-1',
    memberId: 'user-1',
    memberName: 'Arifur Rahman',
    memberEmail: 'arifur@gmail.com',
    memberAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    requestType: 'EXTRA_MEAL',
    date: '2026-09-12',
    mealType: 'DINNER',
    extraCount: 1,
    reason: 'Guest visiting from university',
    note: 'Please prepare 1 extra plate for dinner.',
    status: 'APPROVED',
    submittedAt: '2026-09-11 15:30:00',
    reviewedAt: '2026-09-11 18:00:00',
    reviewedBy: 'Sakib Hasan (Manager)',
    responseNote: 'Approved. Added 1 guest dinner.'
  },
  {
    id: 'req-2',
    memberId: 'user-2',
    memberName: 'Nayeem Islam',
    memberEmail: 'nayeem@gmail.com',
    memberAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    requestType: 'MEAL_REMOVAL',
    date: '2026-09-13',
    mealType: 'LUNCH',
    extraCount: 0,
    reason: 'Attending office team lunch in Gulshan',
    note: 'Please do not count my lunch tomorrow.',
    status: 'PENDING',
    submittedAt: '2026-09-12 08:30:00'
  },
  {
    id: 'req-3',
    memberId: 'user-3',
    memberName: 'Hasan Mahmud',
    memberEmail: 'hasan@gmail.com',
    memberAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    requestType: 'EXTRA_MEAL',
    date: '2026-09-14',
    mealType: 'DINNER',
    extraCount: 2,
    reason: 'Two cousins staying overnight',
    note: 'Need 2 extra dinner meals on Monday night.',
    status: 'PENDING',
    submittedAt: '2026-09-12 09:15:00'
  },
  {
    id: 'req-4',
    memberId: 'user-5',
    memberName: 'Shafiul Alam',
    memberEmail: 'shafiul@gmail.com',
    memberAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    requestType: 'MEAL_REMOVAL',
    date: '2026-09-10',
    mealType: 'DINNER',
    extraCount: 0,
    reason: 'Went to doctor appointment & ate outside',
    status: 'DECLINED',
    submittedAt: '2026-09-10 20:45:00',
    reviewedAt: '2026-09-10 21:00:00',
    reviewedBy: 'Sakib Hasan (Manager)',
    responseNote: 'Declined because request was submitted after 4 PM cooking cutoff.'
  }
];

export const INITIAL_BAZAR_TRIPS: BazarTrip[] = [
  {
    id: 'bazar-1',
    date: '2026-09-01',
    shopperMemberId: 'user-1',
    shopperName: 'Arifur Rahman',
    storeName: 'Rayer Bazar Krishi Market',
    totalAmount: 3450,
    notes: 'Monthly bulk dry grocery purchase + fresh fish for month start',
    createdAt: '2026-09-01 08:30:00',
    items: [
      { id: 'item-1', name: 'Miniket Rice (Rashid)', quantity: 25, unit: 'kg', unitPrice: 72, totalPrice: 1800, category: 'GROCERY_OIL' },
      { id: 'item-2', name: 'Soybean Oil (Teer)', quantity: 5, unit: 'liter', unitPrice: 175, totalPrice: 875, category: 'GROCERY_OIL' },
      { id: 'item-3', name: 'Rui Fish (Fresh)', quantity: 2.5, unit: 'kg', unitPrice: 310, totalPrice: 775, category: 'MEAT_FISH' }
    ]
  },
  {
    id: 'bazar-2',
    date: '2026-09-04',
    shopperMemberId: 'user-2',
    shopperName: 'Nayeem Islam',
    storeName: 'Dhanmondi 15 Kacha Bazar',
    totalAmount: 1820,
    notes: 'Weekly fresh vegetables, potatoes and farm eggs',
    createdAt: '2026-09-04 09:15:00',
    items: [
      { id: 'item-4', name: 'Potatoes (Diamond)', quantity: 5, unit: 'kg', unitPrice: 55, totalPrice: 275, category: 'VEGETABLES' },
      { id: 'item-5', name: 'Red Onion (Deshi)', quantity: 4, unit: 'kg', unitPrice: 110, totalPrice: 440, category: 'SPICES' },
      { id: 'item-6', name: 'Farm Brown Eggs', quantity: 4, unit: 'dozen', unitPrice: 160, totalPrice: 640, category: 'DAIRY_EGG' },
      { id: 'item-7', name: 'Lentils (Mosur Dal)', quantity: 2, unit: 'kg', unitPrice: 115, totalPrice: 230, category: 'GROCERY_OIL' },
      { id: 'item-8', name: 'Potol & Eggplant', quantity: 3, unit: 'kg', unitPrice: 75, totalPrice: 235, category: 'VEGETABLES' }
    ]
  },
  {
    id: 'bazar-3',
    date: '2026-09-08',
    shopperMemberId: 'user-3',
    shopperName: 'Hasan Mahmud',
    storeName: 'Karwan Bazar Meat Market',
    totalAmount: 3800,
    notes: 'Beef and fresh chicken purchase',
    createdAt: '2026-09-08 10:00:00',
    items: [
      { id: 'item-9', name: 'Fresh Beef (Gorur Mangsho)', quantity: 4, unit: 'kg', unitPrice: 780, totalPrice: 3120, category: 'MEAT_FISH' },
      { id: 'item-10', name: 'Broiler Chicken', quantity: 3.4, unit: 'kg', unitPrice: 200, totalPrice: 680, category: 'MEAT_FISH' }
    ]
  },
  {
    id: 'bazar-4',
    date: '2026-09-12',
    shopperMemberId: 'user-4',
    shopperName: 'Mehedi Hasan',
    storeName: 'Dhanmondi Krishi Market',
    totalAmount: 2150,
    notes: "Today's Sonali chicken, eggs and seasonal vegetables",
    createdAt: '2026-09-12 08:15:00',
    items: [
      { id: 'item-11', name: 'Sonali Chicken', quantity: 4, unit: 'piece', unitPrice: 280, totalPrice: 1120, category: 'MEAT_FISH' },
      { id: 'item-12', name: 'Farm Eggs', quantity: 3, unit: 'dozen', unitPrice: 160, totalPrice: 480, category: 'DAIRY_EGG' },
      { id: 'item-13', name: 'Vegetables & Green Chillies', quantity: 4, unit: 'kg', unitPrice: 65, totalPrice: 260, category: 'VEGETABLES' },
      { id: 'item-14', name: 'Mustard Oil (Radhuni Pure)', quantity: 1, unit: 'liter', unitPrice: 290, totalPrice: 290, category: 'GROCERY_OIL' }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx-1',
    date: '2026-09-01',
    type: 'DEPOSIT',
    category: 'MEMBER_DEPOSIT',
    memberId: 'user-1',
    memberName: 'Arifur Rahman',
    amount: 5000,
    paymentMethod: 'bKash',
    trxId: 'BK9A772610A',
    description: 'September Mess Advance Deposit',
    recordedBy: 'Sakib Hasan (Manager)',
    status: 'VERIFIED',
    createdAt: '2026-09-01 11:20:00'
  },
  {
    id: 'trx-2',
    date: '2026-09-01',
    type: 'DEPOSIT',
    category: 'MEMBER_DEPOSIT',
    memberId: 'user-2',
    memberName: 'Nayeem Islam',
    amount: 5000,
    paymentMethod: 'Nagad',
    trxId: 'NG88201991',
    description: 'September Mess Advance Deposit',
    recordedBy: 'Sakib Hasan (Manager)',
    status: 'VERIFIED',
    createdAt: '2026-09-01 14:10:00'
  },
  {
    id: 'trx-3',
    date: '2026-09-02',
    type: 'DEPOSIT',
    category: 'MEMBER_DEPOSIT',
    memberId: 'user-3',
    memberName: 'Hasan Mahmud',
    amount: 4500,
    paymentMethod: 'Cash',
    description: 'September 1st Installment',
    recordedBy: 'Sakib Hasan (Manager)',
    status: 'VERIFIED',
    createdAt: '2026-09-02 18:30:00'
  },
  {
    id: 'trx-4',
    date: '2026-09-02',
    type: 'DEPOSIT',
    category: 'MEMBER_DEPOSIT',
    memberId: 'user-4',
    memberName: 'Mehedi Hasan',
    amount: 5000,
    paymentMethod: 'Bank',
    trxId: 'DBBL-FT-99182',
    description: 'Bank transfer for mess advance',
    recordedBy: 'Sakib Hasan (Manager)',
    status: 'VERIFIED',
    createdAt: '2026-09-02 19:00:00'
  },
  {
    id: 'trx-5',
    date: '2026-09-03',
    type: 'DEPOSIT',
    category: 'MEMBER_DEPOSIT',
    memberId: 'user-5',
    memberName: 'Shafiul Alam',
    amount: 4000,
    paymentMethod: 'bKash',
    trxId: 'BK33991822',
    description: 'September Advance',
    recordedBy: 'Sakib Hasan (Manager)',
    status: 'VERIFIED',
    createdAt: '2026-09-03 10:15:00'
  },
  {
    id: 'trx-6',
    date: '2026-09-04',
    type: 'DEPOSIT',
    category: 'MEMBER_DEPOSIT',
    memberId: 'user-6',
    memberName: 'Tariqul Islam',
    amount: 4500,
    paymentMethod: 'Nagad',
    trxId: 'NG11229988',
    description: 'September Deposit',
    recordedBy: 'Sakib Hasan (Manager)',
    status: 'VERIFIED',
    createdAt: '2026-09-04 16:45:00'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-09-02',
    category: 'GAS_CYLINDER',
    amount: 1450,
    description: 'Beximco LPG Gas Cylinder 12KG refill for kitchen stove',
    paidByName: 'Sakib Hasan (Manager)',
    createdAt: '2026-09-02 16:00:00'
  },
  {
    id: 'exp-2',
    date: '2026-09-05',
    category: 'INTERNET',
    amount: 1000,
    description: 'Dot Internet 35Mbps Fiber Broadband Monthly Bill',
    paidByName: 'Sakib Hasan (Manager)',
    createdAt: '2026-09-05 11:30:00'
  },
  {
    id: 'exp-3',
    date: '2026-09-07',
    category: 'MAID_SALARY',
    amount: 4500,
    description: 'Cook & Cleaning Auntie (Khala) Salary',
    paidByName: 'Sakib Hasan (Manager)',
    createdAt: '2026-09-07 18:00:00'
  },
  {
    id: 'exp-4',
    date: '2026-09-10',
    category: 'CLEANING',
    amount: 450,
    description: 'Harpic, Wheel powder, Dish wash bar and Mop refill',
    paidByName: 'Sakib Hasan (Manager)',
    createdAt: '2026-09-10 14:20:00'
  }
];

export const INITIAL_RESPONSIBILITIES: ResponsibilityAssignment[] = [
  {
    id: 'duty-2026-09-12',
    date: '2026-09-12', // Today
    bazarDutyMemberIds: ['user-1', 'user-4'], // Arifur, Mehedi
    cookingDutyMemberIds: ['user-2'], // Nayeem
    cleaningDutyMemberIds: ['user-5', 'user-6'], // Shafiul, Tariqul
    shiftNote: 'Chicken curry & salad dinner'
  },
  {
    id: 'duty-2026-09-13',
    date: '2026-09-13', // Tomorrow
    bazarDutyMemberIds: ['user-3', 'user-5'], // Hasan, Shafiul
    cookingDutyMemberIds: ['user-1'], // Arifur
    cleaningDutyMemberIds: ['user-2', 'user-4'], // Nayeem, Mehedi
    shiftNote: 'Khichuri breakfast duty'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '📢 September 2nd Half Advance Deposit Reminder',
    content: 'Dear mess members, please ensure your remaining mess deposits are cleared by September 15 via bKash/Nagad or Cash to Sakib (Manager).',
    category: 'PAYMENT',
    isImportant: true,
    authorName: 'Sakib Hasan (Manager)',
    isPinned: true,
    createdAt: '2026-09-11 10:00:00'
  },
  {
    id: 'ann-2',
    title: '🍲 Meal Change Request Cutoff Time',
    content: 'Please submit your lunch or dinner extra/removal requests before 4:00 PM so that the bazar shopping and cooking quantities can be adjusted accurately.',
    category: 'FOOD',
    authorName: 'Sakib Hasan (Manager)',
    isPinned: false,
    createdAt: '2026-09-12 08:00:00'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Meal Request Approved',
    message: 'Your Extra Dinner request for 12 Sept (+1 guest meal) has been approved by Manager.',
    type: 'SUCCESS',
    isRead: false,
    createdAt: '2026-09-11 18:00:00'
  },
  {
    id: 'notif-2',
    userId: 'user-manager',
    title: 'New Meal Request',
    message: 'Nayeem Islam requested a Meal Removal for Lunch on 13 Sept.',
    type: 'INFO',
    isRead: false,
    createdAt: '2026-09-12 08:30:00'
  },
  {
    id: 'notif-3',
    userId: 'ALL',
    title: 'New Announcement',
    message: 'September 2nd Half Advance Deposit Reminder posted by Manager.',
    type: 'INFO',
    isRead: true,
    createdAt: '2026-09-11 10:00:00'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-12 09:15:00',
    userName: 'Hasan Mahmud',
    userRole: 'MEMBER',
    action: 'Submitted Meal Request',
    details: 'Requested 2 Extra Dinner meals on 2026-09-14'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-12 08:30:00',
    userName: 'Nayeem Islam',
    userRole: 'MEMBER',
    action: 'Submitted Meal Request',
    details: 'Requested Lunch Removal on 2026-09-13'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-12 08:15:00',
    userName: 'Sakib Hasan',
    userRole: 'MANAGER',
    action: 'Added Bazar Entry',
    details: 'Recorded Dhanmondi Krishi Market bazar of ৳2,150'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-11 18:00:00',
    userName: 'Sakib Hasan',
    userRole: 'MANAGER',
    action: 'Approved Meal Request',
    details: 'Approved 1 Extra Dinner for Arifur Rahman on 2026-09-12'
  }
];
