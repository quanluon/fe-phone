'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EmailModalProps {
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function EmailModal({ onClose, onSubmit }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    setLoading(true);
    onSubmit(email);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">Nhập email để tiếp tục</h2>
        <p className="text-gray-600 mb-6">
          Vui lòng nhập email để chúng tôi có thể liên hệ với bạn về đơn hàng.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1"
            >
              {loading ? 'Đang xử lý...' : 'Tiếp tục'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
