
import { Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reward } from './ChoreTracker';

interface RewardsListProps {
  rewards: Reward[];
  totalPoints: number;
  onPurchaseReward: (rewardId: string) => void;
}

const RewardsList = ({ rewards, totalPoints, onPurchaseReward }: RewardsListProps) => {
  return (
    <div className="bg-white/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border-2 border-purple-200">
      <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center flex items-center justify-center gap-2">
        <span>🎁</span>
        Rewards Shop
        <span>🎁</span>
      </h2>
      
      <div className="space-y-4">
        {rewards.map((reward) => {
          const canAfford = totalPoints >= reward.cost;
          
          return (
            <div
              key={reward.id}
              className={`bg-gradient-to-r rounded-2xl p-4 border-2 transition-all duration-200 hover:shadow-md ${
                canAfford
                  ? 'from-green-50 to-blue-50 border-green-100 hover:border-green-300'
                  : 'from-gray-50 to-gray-100 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{reward.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-purple-700">{reward.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-purple-600">
                      <Diamond className="w-4 h-4 text-blue-500 fill-blue-200" />
                      <span>{reward.cost} diamonds</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => onPurchaseReward(reward.id)}
                  disabled={!canAfford}
                  className={`rounded-full px-6 py-2 font-medium transition-all duration-200 ${
                    canAfford
                      ? 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Buy! 💎' : 'Need More 💎'}
                </Button>
              </div>
              
              {reward.purchased > 0 && (
                <div className="bg-yellow-100 rounded-xl p-2 text-center border border-yellow-200">
                  <span className="text-sm font-medium text-yellow-700">
                    🌟 Purchased {reward.purchased} time{reward.purchased > 1 ? 's' : ''}! 🌟
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsList;
