
import { Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Chore } from './ChoreTracker';

interface ChoreListProps {
  chores: Chore[];
  onCompleteChore: (choreId: string) => void;
}

const ChoreList = ({ chores, onCompleteChore }: ChoreListProps) => {
  return (
    <div className="bg-white/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border-2 border-pink-200">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center flex items-center justify-center gap-2">
        <span>🧹</span>
        Daily Chores
        <span>🧹</span>
      </h2>
      
      <div className="space-y-4">
        {chores.map((chore) => (
          <div
            key={chore.id}
            className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border-2 border-pink-100 hover:border-pink-300 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{chore.emoji}</span>
                <div>
                  <h3 className="font-semibold text-purple-700">{chore.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-purple-600">
                    <Diamond className="w-4 h-4 text-blue-500 fill-blue-200" />
                    <span>{chore.dailyPoints} points</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => onCompleteChore(chore.id)}
                className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full px-6 py-2 font-medium transition-all duration-200 hover:scale-105"
              >
                Complete! ✨
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/60 rounded-xl p-3 border border-pink-200">
                <div className="text-sm text-purple-600 font-medium">Today</div>
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-purple-700">
                  <Diamond className="w-5 h-5 text-blue-500 fill-blue-200" />
                  <span>{chore.todayPoints}</span>
                </div>
              </div>
              
              <div className="bg-white/60 rounded-xl p-3 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Total</div>
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-purple-700">
                  <Diamond className="w-5 h-5 text-blue-500 fill-blue-200" />
                  <span>{chore.totalPoints}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoreList;
