import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { submitCheckin } from '../../api/checkins';
import { useToast } from '../ui/Toast';

const moods = [
  { value: 1, emoji: '😔' },
  { value: 2, emoji: '😐' },
  { value: 3, emoji: '🙂' },
  { value: 4, emoji: '😊' },
  { value: 5, emoji: '🤩' },
];

export default function CheckInModal({ onClose, onSuccess }) {
  const { addToast } = useToast();
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await submitCheckin({ mood: selected, note });
      addToast('Check-in recorded!', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong';
      if (err.response?.status === 409) setError("You've already checked in today. Come back tomorrow!");
      else setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-[1.5rem] text-near-black">Today's Check-In</h2>
      <p className="font-body text-warm-gray mt-1">How are you feeling today?</p>
      <div className="flex justify-center gap-3 my-6">
        {moods.map((m) => (
          <button key={m.value} onClick={() => setSelected(m.value)}
            className={`w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center text-[1.5rem] cursor-pointer transition-all duration-150 ${selected === m.value ? 'border-amber bg-amber/10 scale-110' : 'border-border bg-cream-light hover:border-amber'}`}>
            {m.emoji}
          </button>
        ))}
      </div>
      <Input as="textarea" rows={3} label="Share a quick update with your partner (optional)" placeholder="What did you work on today?" value={note} onChange={(e) => setNote(e.target.value)} />
      {error && <p className="font-body text-[0.85rem] text-coral mt-3">{error}</p>}
      <Button variant="primary" className="w-full mt-6" disabled={!selected || loading} onClick={handleSubmit}>
        {loading ? 'Submitting...' : 'Submit Check-In →'}
      </Button>
      <button onClick={onClose} className="block mx-auto mt-4 font-body text-[0.85rem] text-warm-gray hover:text-near-black transition-colors cursor-pointer">Cancel</button>
    </Modal>
  );
}
