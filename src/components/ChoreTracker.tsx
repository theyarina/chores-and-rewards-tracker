
import { useState } from 'react';
import { Diamond } from 'lucide-react';
import ChoreList from './ChoreList';
import RewardsList from './RewardsList';

export interface Chore {
  id: string;
  name: string;
  emoji: string;
  dailyPoints: number;
  todayPoints: number;
  totalPoints: number;
}

export interface Reward {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  purchased: number;
}

const ChoreTracker = () => {
  const [chores, setChores] = useState<Chore[]>([
    {
      id: '1',
      name: 'Clean Room',
      emoji: '🧹',
      dailyPoints: 10,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '2',
      name: 'Wash Dishes',
      emoji: '🍽️',
      dailyPoints: 15,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '3',
      name: 'Put Away Toys',
      emoji: '🧸',
      dailyPoints: 8,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '4',
      name: 'Feed Pet',
      emoji: '🐕',
      dailyPoints: 5,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '5',
      name: 'Make Bed',
      emoji: '🛏️',
      dailyPoints: 7,
      todayPoints: 0,
      totalPoints: 0,
    },
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      name: 'Ice Cream',
      emoji: '🍦',
      cost: 25,
      purchased: 0,
    },
    {
      id: '2',
      name: 'New Toy',
      emoji: '🎁',
      cost: 100,
      purchased: 0,
    },
    {
      id: '3',
      name: 'Movie Night',
      emoji: '🍿',
      cost: 50,
      purchased: 0,
    },
    {
      id: '4',
      name: 'Extra Playtime',
      emoji: '⏰',
      cost: 30,
      purchased: 0,
    },
    {
      id: '5',
      name: 'Special Treat',
      emoji: '🍭',
      cost: 15,
      purchased: 0,
    },
  ]);

  const totalPoints = chores.reduce((sum, chore) => sum + chore.totalPoints, 0);

  const completeChore = (choreId: string) => {
    setChores(prevChores =>
      prevChores.map(chore =>
        chore.id === choreId
          ? {
              ...chore,
              todayPoints: chore.todayPoints + chore.dailyPoints,
              totalPoints: chore.totalPoints + chore.dailyPoints,
            }
          : chore
      )
    );
  };

  const purchaseReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || totalPoints < reward.cost) return;

    // Deduct points from chores (starting with highest totals)
    let pointsToDeduct = reward.cost;
    const updatedChores = [...chores]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map(chore => {
        if (pointsToDeduct <= 0) return chore;
        
        const deduction = Math.min(chore.totalPoints, pointsToDeduct);
        pointsToDeduct -= deduction;
        
        return {
          ...chore,
          totalPoints: chore.totalPoints - deduction,
        };
      });

    setChores(updatedChores);
    setRewards(prevRewards =>
      prevRewards.map(r =>
        r.id === rewardId
          ? { ...r, purchased: r.purchased + 1 }
          : r
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <span>✨</span>
          Kawaii Chore Tracker
          <span>✨</span>
        </h1>
        <p className="text-lg text-purple-600 mb-4">Complete chores to earn diamonds!</p>
        
        <div className="bg-white/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border-2 border-pink-200 inline-block">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-700">
            <Diamond className="w-8 h-8 text-blue-500 fill-blue-200" />
            <span>{totalPoints}</span>
            <span className="text-lg font-medium">Total Diamonds</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <ChoreList chores={chores} onCompleteChore={completeChore} />
        <RewardsList 
          rewards={rewards} 
          totalPoints={totalPoints} 
          onPurchaseReward={purchaseReward} 
        />
      </div>
    </div>
  );
};

export default ChoreTracker;
