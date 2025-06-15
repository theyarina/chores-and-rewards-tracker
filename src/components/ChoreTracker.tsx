import { useState, useEffect } from 'react';
import { Diamond, Brush } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChoreList from './ChoreList';
import RewardsList from './RewardsList';
import DailyTally from './DailyTally';

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

interface DailyRecord {
  date: string;
  totalPoints: number;
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
      emoji: '💇🏼‍♀️',
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

  const [lastAutoSave, setLastAutoSave] = useState<string>('');

  // Auto-save at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const today = now.toDateString();
      
      // Check if it's a new day and we have points to save
      if (lastAutoSave !== today) {
        const todayPoints = chores.reduce((sum, chore) => sum + chore.todayPoints, 0);
        
        if (todayPoints > 0) {
          // Auto-save today's points
          const savedRecords = localStorage.getItem('tessaChoreTrackerDaily');
          const dailyRecords: DailyRecord[] = savedRecords ? JSON.parse(savedRecords) : [];
          
          const existingRecordIndex = dailyRecords.findIndex(record => record.date === today);
          
          if (existingRecordIndex >= 0) {
            dailyRecords[existingRecordIndex].totalPoints += todayPoints;
          } else {
            dailyRecords.unshift({
              date: today,
              totalPoints: todayPoints
            });
          }
          
          localStorage.setItem('tessaChoreTrackerDaily', JSON.stringify(dailyRecords));
          
          // Reset today's points after auto-save
          setChores(prevChores =>
            prevChores.map(chore => ({
              ...chore,
              todayPoints: 0,
            }))
          );
        }
        
        setLastAutoSave(today);
      }
    };

    // Check immediately and then every minute
    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    
    return () => clearInterval(interval);
  }, [chores, lastAutoSave]);

  // Initialize lastAutoSave on component mount
  useEffect(() => {
    setLastAutoSave(new Date().toDateString());
  }, []);

  const totalPoints = chores.reduce((sum, chore) => sum + chore.totalPoints, 0);
  const todayPoints = chores.reduce((sum, chore) => sum + chore.todayPoints, 0);
  
  // Calculate saved points (points that have been earned but not redeemed)
  const savedRecords = localStorage.getItem('tessaChoreTrackerDaily');
  const dailyRecords: DailyRecord[] = savedRecords ? JSON.parse(savedRecords) : [];
  const totalSavedPoints = dailyRecords.reduce((sum, record) => sum + record.totalPoints, 0);

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

  const handleEditChores = (updatedChores: Chore[]) => {
    setChores(updatedChores);
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

  const handleSaveDay = () => {
    // Reset today's points after saving
    setChores(prevChores =>
      prevChores.map(chore => ({
        ...chore,
        todayPoints: 0,
      }))
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2 font-kalam">
          <span>✨</span>
          Tessa's Chore Tracker v2.0
          <span>✨</span>
        </h1>
        
        <div className="flex justify-center mb-4">
          <Brush className="w-12 h-12 text-pink-500" />
        </div>
        
        <p className="text-lg text-purple-600 mb-4">Complete chores to earn diamonds!</p>
        
        <div className="bg-white/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border-2 border-pink-200 inline-block">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-700 mb-2">
            <Diamond className="w-8 h-8 text-blue-500 fill-blue-200" />
            <span>{totalPoints}</span>
            <span className="text-lg font-medium">Total Diamonds</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-orange-600">
            <span>💰</span>
            <span>{totalSavedPoints}</span>
            <span className="text-sm font-medium">Saved Diamonds</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chores" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="chores" className="text-lg font-medium">
            🧹 Chores & Rewards
          </TabsTrigger>
          <TabsTrigger value="history" className="text-lg font-medium">
            📅 Daily History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chores">
          <div className="grid lg:grid-cols-2 gap-8">
            <ChoreList 
              chores={chores} 
              onCompleteChore={completeChore}
              onEditChores={handleEditChores}
            />
            <RewardsList 
              rewards={rewards} 
              totalPoints={totalPoints} 
              onPurchaseReward={purchaseReward} 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <DailyTally 
            currentDayPoints={todayPoints}
            totalSavedPoints={totalSavedPoints}
            onSaveDay={handleSaveDay}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChoreTracker;
