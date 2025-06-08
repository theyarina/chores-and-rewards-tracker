
import { useState } from 'react';
import { Diamond, Brush } from 'lucide-react';
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
      name: 'Do your job',
      emoji: '💼',
      dailyPoints: 7,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '2',
      name: 'Clean room',
      emoji: '🧹',
      dailyPoints: 5,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '3',
      name: 'Make your bed',
      emoji: '🛏️',
      dailyPoints: 4,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '4',
      name: 'Get dressed',
      emoji: '👗',
      dailyPoints: 2,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '5',
      name: 'Brush your hair',
      emoji: '💇‍♀️',
      dailyPoints: 1,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '6',
      name: 'Brush your teeth',
      emoji: '🦷',
      dailyPoints: 3,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '7',
      name: 'Clear table',
      emoji: '🍽️',
      dailyPoints: 2,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '8',
      name: 'Gigi Math game',
      emoji: '🔢',
      dailyPoints: 6,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '9',
      name: 'S letter',
      emoji: '🅰️',
      dailyPoints: 4,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '10',
      name: 'M letter',
      emoji: '🅱️',
      dailyPoints: 8,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '11',
      name: 'L letter',
      emoji: '🅾️',
      dailyPoints: 16,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '12',
      name: 'Exercise',
      emoji: '🏃‍♀️',
      dailyPoints: 2,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '13',
      name: 'Play outside',
      emoji: '🌳',
      dailyPoints: 2,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '14',
      name: 'Read',
      emoji: '📚',
      dailyPoints: 4,
      todayPoints: 0,
      totalPoints: 0,
    },
    {
      id: '15',
      name: 'Put away toys',
      emoji: '🧸',
      dailyPoints: 3,
      todayPoints: 0,
      totalPoints: 0,
    },
  ]);

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      name: 'Audiobook',
      emoji: '🎧',
      cost: 25,
      purchased: 0,
    },
    {
      id: '2',
      name: 'Audio libro',
      emoji: '🎵',
      cost: 20,
      purchased: 0,
    },
    {
      id: '3',
      name: 'Movie',
      emoji: '🎬',
      cost: 60,
      purchased: 0,
    },
    {
      id: '4',
      name: 'Película',
      emoji: '🎭',
      cost: 50,
      purchased: 0,
    },
    {
      id: '5',
      name: 'Epic read to me',
      emoji: '📖',
      cost: 15,
      purchased: 0,
    },
    {
      id: '6',
      name: 'Epic videos',
      emoji: '📹',
      cost: 20,
      purchased: 0,
    },
    {
      id: '7',
      name: 'Epic games',
      emoji: '🎮',
      cost: 25,
      purchased: 0,
    },
    {
      id: '8',
      name: 'New toy',
      emoji: '🎁',
      cost: 65,
      purchased: 0,
    },
    {
      id: '9',
      name: 'New dress',
      emoji: '👚',
      cost: 70,
      purchased: 0,
    },
    {
      id: '10',
      name: 'Treat',
      emoji: '🍭',
      cost: 30,
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
        <h1 className="text-5xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2 font-kalam">
          <span>✨</span>
          Tessa's Chore Tracker
          <span>✨</span>
        </h1>
        
        <div className="flex justify-center mb-4">
          <Brush className="w-12 h-12 text-pink-500" />
        </div>
        
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
