import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

const Dictionary = () => {
  // ローカルストレージから初期データを読み込む
  const [words, setWords] = useState(() => {
    const saved = localStorage.getItem('dictionary');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [newWord, setNewWord] = useState({ term: '', definition: '' });
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // データが変更されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('dictionary', JSON.stringify(words));
  }, [words]);

  const addWord = () => {
    if (newWord.term && newWord.definition) {
      if (editMode) {
        const updatedWords = [...words];
        updatedWords[editIndex] = newWord;
        setWords(updatedWords);
        setEditMode(false);
        setEditIndex(null);
      } else {
        setWords([...words, newWord]);
      }
      setNewWord({ term: '', definition: '' });
    }
  };

  const editWord = (index) => {
    setNewWord(words[index]);
    setEditMode(true);
    setEditIndex(index);
  };

  const deleteWord = (index) => {
    const updatedWords = words.filter((_, i) => i !== index);
    setWords(updatedWords);
  };

  const filteredWords = words.filter(word => 
    word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>個人用辞書</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="単語を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="space-y-2">
          <Input
            placeholder="新しい単語"
            value={newWord.term}
            onChange={(e) => setNewWord({ ...newWord, term: e.target.value })}
          />
          <Input
            placeholder="定義"
            value={newWord.definition}
            onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
          />
          <Button 
            onClick={addWord}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            {editMode ? '更新' : '追加'}
          </Button>
        </div>

        <div className="space-y-2">
          {filteredWords.map((word, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{word.term}</h3>
                  <p className="text-gray-600">{word.definition}</p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => editWord(index)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteWord(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Dictionary;
