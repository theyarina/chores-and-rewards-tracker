import { useState, useEffect } from 'react';
import { Calendar, Trophy, TrendingUp, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordVerification from './PasswordVerification';

interface DailyRecord {
  date: string;
  totalPoints: number;
}

interface DailyTallyProps {
  currentDayPoints: number;
  totalSavedPoints: number;
  onSaveDay: () => void;
  onSavedPointsChange: (newSavedPoints: number) => void;
}

const DailyTally = ({ currentDayPoints, totalSavedPoints, onSaveDay, onSavedPointsChange }: DailyTallyProps) => {
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DailyRecord | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingSavedPoints, setEditingSavedPoints] = useState(false);
  const [savedPointsEditValue, setSavedPointsEditValue] = useState('');

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
    
    // Calculate new saved points total and notify parent
    const newSavedPoints = dailyRecords.reduce((sum, record) => sum + record.totalPoints, 0);
    onSavedPointsChange(newSavedPoints);
    
    // Dispatch custom event for other components that might be listening
    window.dispatchEvent(new CustomEvent('dailyRecordsUpdated'));
  }, [dailyRecords, onSavedPointsChange]);

  const saveTodaysPoints = () => {
    const today = new Date().toDateString();
    const existingRecordIndex = dailyRecords.findIndex(record => record.date === today);
    
    if (existingRecordIndex >= 0) {
      // Add to existing record instead of replacing
      const updatedRecords = [...dailyRecords];
      updatedRecords[existingRecordIndex] = {
        ...updatedRecords[existingRecordIndex],
        totalPoints: updatedRecords[existingRecordIndex].totalPoints + currentDayPoints
      };
      setDailyRecords(updatedRecords);
    } else {
      // Create new record
      const newRecord: DailyRecord = {
        date: today,
        totalPoints: currentDayPoints
      };
      setDailyRecords([newRecord, ...dailyRecords]);
    }
    
    onSaveDay();
  };

  const handleEditRecord = (record: DailyRecord) => {
    setEditingRecord(record);
    setEditValue(record.totalPoints.toString());
    setEditingSavedPoints(false);
    setShowPasswordDialog(true);
  };

  const handleEditSavedPoints = () => {
    setEditingSavedPoints(true);
    setSavedPointsEditValue(totalSavedPoints.toString());
    setShowPasswordDialog(true);
  };

  const handlePasswordSuccess = () => {
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingSavedPoints) {
      // Edit total saved points by setting the total directly
      const newTotal = parseInt(savedPointsEditValue) || 0;
      
      // Clear all existing records and create a single record with the new total
      if (newTotal > 0) {
        const today = new Date().toDateString();
        const newRecord: DailyRecord = {
          date: today,
          totalPoints: newTotal
        };
        setDailyRecords([newRecord]);
      } else {
        // If setting to 0, clear all records
        setDailyRecords([]);
      }
    } else if (editingRecord) {
      const newPoints = parseInt(editValue) || 0;
      if (newPoints <= 0) {
        // Remove the record if points are 0 or less
        setDailyRecords(prev => prev.filter(record => record.date !== editingRecord.date));
      } else {
        // Update the record with new points
        setDailyRecords(prev => 
          prev.map(record => 
            record.date === editingRecord.date 
              ? { ...record, totalPoints: newPoints }
              : record
          )
        );
      }
    }
    
    setShowEditDialog(false);
    setEditingRecord(null);
    setEditValue('');
    setEditingSavedPoints(false);
    setSavedPointsEditValue('');
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
            {currentDayPoints} diamonds to save 💎
          </div>
          
          {todaysRecord && (
            <div className="text-lg text-green-600 mb-2 font-semibold">
              Already saved today: {todaysRecord.totalPoints} diamonds
            </div>
          )}
          
          <div className="text-sm text-purple-600 mb-4">
            Total for today will be: {(todaysRecord?.totalPoints || 0) + currentDayPoints} diamonds
          </div>

          <div className="flex items-center justify-center gap-2 text-lg text-orange-600 mb-4 font-semibold">
            <span>💰 Saved diamonds: {totalSavedPoints}</span>
            <Button
              onClick={handleEditSavedPoints}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
          
          <Button
            onClick={saveTodaysPoints}
            disabled={currentDayPoints === 0}
            className="bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white rounded-full px-6 py-2 font-medium disabled:opacity-50"
          >
            {currentDayPoints === 0 ? 'No points to save' : `Save ${currentDayPoints} diamonds 💾`}
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
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-purple-700">
                    {record.totalPoints} 💎
                  </div>
                  <Button
                    onClick={() => handleEditRecord(record)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
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
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-purple-700">
                    {record.totalPoints} 💎
                  </span>
                  <Button
                    onClick={() => handleEditRecord(record)}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <PasswordVerification
        isOpen={showPasswordDialog}
        onClose={() => {
          setShowPasswordDialog(false);
          setEditingRecord(null);
          setEditValue('');
          setEditingSavedPoints(false);
          setSavedPointsEditValue('');
        }}
        onSuccess={handlePasswordSuccess}
        title={editingSavedPoints ? "Edit Saved Diamonds" : "Edit Daily Points"}
      />

      <Dialog open={showEditDialog} onOpenChange={() => setShowEditDialog(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-purple-700">
              {editingSavedPoints 
                ? "Edit Total Saved Diamonds" 
                : `Edit Points for ${editingRecord && formatDate(editingRecord.date)}`
              }
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="points" className="text-sm font-medium text-purple-600">
                {editingSavedPoints ? "Total Saved Diamonds" : "Total Points"}
              </Label>
              <Input
                id="points"
                type="number"
                min="0"
                value={editingSavedPoints ? savedPointsEditValue : editValue}
                onChange={(e) => editingSavedPoints 
                  ? setSavedPointsEditValue(e.target.value) 
                  : setEditValue(e.target.value)
                }
                className="text-center text-lg"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditDialog(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEdit} 
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DailyTally;
