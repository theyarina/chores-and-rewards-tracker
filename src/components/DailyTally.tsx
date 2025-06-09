
import { useState, useEffect } from 'react';
import { Calendar, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DailyRecord {
  date: string;
  totalPoints: number;
}

interface DailyTallyProps {
  currentDayPoints: number;
  onSaveDay: () => void;
}

const DailyTally = ({ currentDayPoints, onSaveDay }: DailyTallyProps) => {
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);

  // Load daily records from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem('tessaChoreTrackerDaily');
    if (savedRecords) {
      setDailyRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save daily records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tessaChoreTrackerDaily', JSON.stringify(dailyRecords));
  }, [dailyRecords]);

  const saveTodaysPoints = () => {
    const today = new Date().toDateString();
    const existingRecordIndex = dailyRecords.findIndex(record => record.date === today);
    
    const newRecord: DailyRecord = {
      date: today,
      totalPoints: currentDayPoints
    };

    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecords = [...dailyRecords];
      updatedRecords[existingRecordIndex] = newRecord;
      setDailyRecords(updatedRecords);
    } else {
      // Add new record
      setDailyRecords([newRecord, ...dailyRecords]);
    }
    
    onSaveDay();
  };

  const getBestDays = () => {
    return [...dailyRecords]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const bestDays = getBestDays();
  const today = new Date().toDateString();
  const todaysRecord = dailyRecords.find(record => record.date === today);

  return (
    <div className="space-y-6">
      {/* Current Day Summary */}
      <div className="bg-white/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border-2 border-blue-200">
        <h3 className="text-xl font-bold text-blue-600 mb-4 text-center flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6" />
          Today's Summary
        </h3>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-700 mb-2">
            {currentDayPoints} diamonds earned today! 💎
          </div>
          
          {todaysRecord && (
            <div className="text-sm text-purple-600 mb-4">
              Last saved: {todaysRecord.totalPoints} diamonds
            </div>
          )}
          
          <Button
            onClick={saveTodaysPoints}
            className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-full px-6 py-2 font-medium"
          >
            Save Today's Progress 💾
          </Button>
        </div>
      </div>

      {/* Best Days */}
      {bestDays.length > 0 && (
        <div className="bg-white/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border-2 border-yellow-200">
          <h3 className="text-xl font-bold text-yellow-600 mb-4 text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            Best Days
          </h3>
          
          <div className="space-y-3">
            {bestDays.map((record, index) => (
              <div
                key={record.date}
                className={`flex justify-between items-center p-3 rounded-xl border-2 ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                    : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                  </span>
                  <span className="font-medium text-purple-700">
                    {formatDate(record.date)}
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-700">
                  {record.totalPoints} 💎
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Days History */}
      {dailyRecords.length > 0 && (
        <div className="bg-white/70 rounded-3xl p-6 shadow-lg backdrop-blur-sm border-2 border-green-200">
          <h3 className="text-xl font-bold text-green-600 mb-4 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Recent Days
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dailyRecords.slice(0, 10).map((record) => (
              <div
                key={record.date}
                className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
              >
                <span className="font-medium text-purple-700">
                  {formatDate(record.date)}
                </span>
                <span className="text-lg font-bold text-purple-700">
                  {record.totalPoints} 💎
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTally;
