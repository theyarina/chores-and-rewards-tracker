
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Chore } from './ChoreTracker';

interface EditChorePointsProps {
  isOpen: boolean;
  onClose: () => void;
  chores: Chore[];
  onSave: (updatedChores: Chore[]) => void;
}

const EditChorePoints = ({ isOpen, onClose, chores, onSave }: EditChorePointsProps) => {
  const [editedChores, setEditedChores] = useState<Chore[]>(chores);
  const [originalChores, setOriginalChores] = useState<Chore[]>(chores);

  // Update original chores when the component opens
  useEffect(() => {
    if (isOpen) {
      setOriginalChores(chores);
      setEditedChores(chores);
    }
  }, [isOpen, chores]);

  const handlePointsChange = (choreId: string, newTotalPoints: number) => {
    setEditedChores(prev => 
      prev.map(chore => 
        chore.id === choreId 
          ? { ...chore, totalPoints: Math.max(0, newTotalPoints) }
          : chore
      )
    );
  };

  const handleSave = () => {
    onSave(editedChores);
    onClose();
  };

  const handleClose = () => {
    setEditedChores(chores);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-purple-700">Edit Chore Points</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {editedChores.map((chore) => {
            const originalChore = originalChores.find(orig => orig.id === chore.id);
            return (
              <div key={chore.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{chore.emoji}</span>
                  <Label className="font-medium text-purple-700">{chore.name}</Label>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-purple-600">
                    Original: <span className="font-semibold">{originalChore?.totalPoints || 0}</span> 
                    <span className="text-blue-500 ml-1">💎</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-purple-600">New:</Label>
                    <Input
                      type="number"
                      min="0"
                      value={chore.totalPoints}
                      onChange={(e) => handlePointsChange(chore.id, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <span className="text-blue-500">💎</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-purple-500 hover:bg-purple-600">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditChorePoints;
