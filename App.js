import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

const PriorityMatrix = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  // 象限の定義（タイトルなし）
  const quadrants = [
    { id: 1, top: 0, left: '50%' },
    { id: 2, top: 0, left: 0 },
    { id: 3, top: '50%', left: '50%' },
    { id: 4, top: '50%', left: 0 }
  ];

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, {
        id: Date.now(),
        text: newItem,
        quadrant: 4,
        position: { x: 10, y: 10 }
      }]);
      setNewItem('');
    }
  };

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e, quadrant) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (draggedItem) {
      const updatedItems = items.map(item => 
        item.id === draggedItem.id 
          ? { ...item, quadrant, position: { x, y } }
          : item
      );
      setItems(updatedItems);
    }
  };

  const deleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="新しい項目を追加"
          className="flex-1"
        />
        <Button onClick={addItem}>
          <Plus className="w-4 h-4 mr-2" />
          追加
        </Button>
      </div>

      <div className="relative w-full aspect-square border border-gray-200 rounded-lg">
        {/* 軸のラベル */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium">緊急度 高</div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium">緊急度 低</div>
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-sm font-medium">重要度 低</div>
        <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-sm font-medium">重要度 高</div>

        {/* 象限（タイトルなし） */}
        {quadrants.map(quadrant => (
          <div
            key={quadrant.id}
            className="absolute w-1/2 h-1/2 border border-gray-200 p-2"
            style={{ top: quadrant.top, left: quadrant.left }}
            onDragOver={(e) => handleDragOver(e, quadrant.id)}
          >
            {items
              .filter(item => item.quadrant === quadrant.id)
              .map(item => (
                <div
                  key={item.id}
                  className="absolute inline-flex items-center gap-2 p-2 bg-white border rounded shadow-sm cursor-move"
                  style={{ 
                    left: `${item.position.x}px`,
                    top: `${item.position.y}px`
                  }}
                  draggable
                  onDragStart={() => handleDragStart(item)}
                >
                  <span>{item.text}</span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityMatrix;
