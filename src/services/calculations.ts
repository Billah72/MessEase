import type { 
  User, 
  MealRecord, 
  BazarTrip, 
  Transaction, 
  Expense, 
  MessSettings, 
  MemberFinancialSummary, 
  MessOverallStats 
} from '../types';

export const formatBDT = (amount: number): string => {
  return `৳${Math.round(amount).toLocaleString('en-US')}`;
};

export const formatBDTPrecise = (amount: number): string => {
  return `৳${Number(amount.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Calculates weighted meal count based on settings
 * Breakfast = 0.5 meal, Lunch = 1.0 meal, Dinner = 1.0 meal, Guest = 1.0 meal
 */
export const calculateMemberMealsCount = (
  record: MealRecord, 
  settings: MessSettings
): number => {
  return (
    (record.breakfast || 0) * settings.breakfastCostRatio +
    (record.lunch || 0) * settings.lunchCostRatio +
    (record.dinner || 0) * settings.dinnerCostRatio +
    (record.guestMeals || 0) * settings.lunchCostRatio
  );
};

export const calculateAllStats = (
  users: User[],
  meals: MealRecord[],
  bazarTrips: BazarTrip[],
  transactions: Transaction[],
  expenses: Expense[],
  settings: MessSettings,
  pendingMealRequestsCount: number = 0
): {
  overallStats: MessOverallStats;
  memberSummaries: MemberFinancialSummary[];
} => {
  // Only regular members consume meals and have personal balances
  const regularMembers = users.filter(u => u.role === 'MEMBER' && u.status === 'ACTIVE');
  const activeMemberCount = regularMembers.length || 1;

  // 1. Total Food / Bazar Expenses
  const totalBazarCost = bazarTrips.reduce((sum, trip) => sum + (trip.totalAmount || 0), 0);

  // 2. Total Non-Bazar Utility & Fixed Shared Expenses
  const totalUtilityCost = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // 3. Total Funds Collected (Deposits from members)
  const verifiedDeposits = transactions.filter(t => t.type === 'DEPOSIT' && t.status === 'VERIFIED');
  const totalFundDeposits = verifiedDeposits.reduce((sum, t) => sum + (t.amount || 0), 0);

  // 4. Total Outflow Expenses (Bazar + Utility)
  const totalExpenses = totalBazarCost + totalUtilityCost;

  // 5. Current Mess Balance in treasury / bank / manager hand
  const currentMessBalance = totalFundDeposits - totalExpenses;

  // 6. Calculate total consumed meals across all active members
  let totalMealsConsumed = 0;
  const memberMealMap: Record<string, {
    breakfast: number;
    lunch: number;
    dinner: number;
    guestMeals: number;
    weightedCount: number;
  }> = {};

  regularMembers.forEach(u => {
    memberMealMap[u.id] = { breakfast: 0, lunch: 0, dinner: 0, guestMeals: 0, weightedCount: 0 };
  });

  meals.forEach(m => {
    if (memberMealMap[m.memberId]) {
      memberMealMap[m.memberId].breakfast += (m.breakfast || 0);
      memberMealMap[m.memberId].lunch += (m.lunch || 0);
      memberMealMap[m.memberId].dinner += (m.dinner || 0);
      memberMealMap[m.memberId].guestMeals += (m.guestMeals || 0);

      const weighted = calculateMemberMealsCount(m, settings);
      memberMealMap[m.memberId].weightedCount += weighted;
      totalMealsConsumed += weighted;
    }
  });

  // 7. Dynamic Meal Rate = Total Bazar Shopping / Total Consumed Meals
  const currentMealRate = totalMealsConsumed > 0 ? (totalBazarCost / totalMealsConsumed) : 0;

  // 8. Shared Utility Cost per Member
  const sharedFixedCostPerHead = totalUtilityCost > 0 
    ? (totalUtilityCost / activeMemberCount) 
    : (settings.fixedCostPerMember || 0);

  // 9. Member Financial Summaries
  let totalDueAmount = 0;
  let totalAdvanceAmount = 0;

  const memberSummaries: MemberFinancialSummary[] = regularMembers.map(user => {
    const userDeposits = verifiedDeposits
      .filter(t => t.memberId === user.id)
      .reduce((sum, t) => sum + t.amount, 0);

    const mealData = memberMealMap[user.id] || { breakfast: 0, lunch: 0, dinner: 0, guestMeals: 0, weightedCount: 0 };
    const memberMealCost = mealData.weightedCount * currentMealRate;
    const memberFixedCost = sharedFixedCostPerHead;
    const totalCost = memberMealCost + memberFixedCost;
    const balance = userDeposits - totalCost;

    let status: 'ADVANCE' | 'BALANCED' | 'DUE' = 'BALANCED';
    if (balance > 10) {
      status = 'ADVANCE';
      totalAdvanceAmount += balance;
    } else if (balance < -10) {
      status = 'DUE';
      totalDueAmount += Math.abs(balance);
    }

    return {
      memberId: user.id,
      memberName: user.name,
      email: user.email,
      roomNo: user.roomNo,
      avatarUrl: user.avatarUrl,
      totalDeposited: userDeposits,
      totalBreakfast: mealData.breakfast,
      totalLunch: mealData.lunch,
      totalDinner: mealData.dinner,
      totalGuestMeals: mealData.guestMeals,
      totalMealsCount: Number(mealData.weightedCount.toFixed(1)),
      mealCost: Math.round(memberMealCost),
      sharedFixedCost: Math.round(memberFixedCost),
      totalCost: Math.round(totalCost),
      balance: Math.round(balance),
      status
    };
  });

  // 10. Today & Tomorrow meal counts
  const todayStr = '2026-09-12';
  const tomorrowStr = '2026-09-13';

  const todayMeals = meals.filter(m => m.date === todayStr);
  const tomorrowMeals = meals.filter(m => m.date === tomorrowStr);

  const todayMealCount = {
    breakfast: todayMeals.reduce((s, m) => s + (m.breakfast || 0), 0),
    lunch: todayMeals.reduce((s, m) => s + (m.lunch || 0), 0),
    dinner: todayMeals.reduce((s, m) => s + (m.dinner || 0), 0),
    total: todayMeals.reduce((s, m) => s + calculateMemberMealsCount(m, settings), 0),
  };

  const tomorrowMealCount = {
    breakfast: tomorrowMeals.reduce((s, m) => s + (m.breakfast || 0), 0),
    lunch: tomorrowMeals.reduce((s, m) => s + (m.lunch || 0), 0),
    dinner: tomorrowMeals.reduce((s, m) => s + (m.dinner || 0), 0),
    total: tomorrowMeals.reduce((s, m) => s + calculateMemberMealsCount(m, settings), 0),
  };

  const todayExpenseTotal = (bazarTrips.filter(b => b.date === todayStr).reduce((sum, b) => sum + b.totalAmount, 0)) +
                            (expenses.filter(e => e.date === todayStr).reduce((sum, e) => sum + e.amount, 0));

  const overallStats: MessOverallStats = {
    totalFundDeposits,
    totalExpenses,
    totalBazarCost,
    totalUtilityCost,
    currentMessBalance,
    totalMealsConsumed: Number(totalMealsConsumed.toFixed(1)),
    currentMealRate: Number(currentMealRate.toFixed(2)),
    activeMemberCount,
    totalDueAmount: Math.round(totalDueAmount),
    totalAdvanceAmount: Math.round(totalAdvanceAmount),
    todayMealCount: {
      ...todayMealCount,
      total: Number(todayMealCount.total.toFixed(1))
    },
    tomorrowMealCount: {
      ...tomorrowMealCount,
      total: Number(tomorrowMealCount.total.toFixed(1))
    },
    todayExpenseTotal,
    pendingMealRequestsCount
  };

  return { overallStats, memberSummaries };
};
