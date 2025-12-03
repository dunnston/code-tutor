import React, { useState } from 'react';
import { McqQuestion, QuestionDifficulty, ProgrammingLanguage } from '../../types/mcqQuestions';

interface QuestionEditorProps {
  question: McqQuestion | null;
  onSave: (question: McqQuestion) => void;
  onCancel: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onSave, onCancel }) => {
  const [formData, setFormData] = useState<McqQuestion>(
    question || {
      id: crypto.randomUUID(),
      questionText: '',
      explanation: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      difficulty: QuestionDifficulty.EASY,
      topic: '',
      language: ProgrammingLanguage.PYTHON,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ''],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) {
      alert('A question must have at least 2 options');
      return;
    }

    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions,
      // Adjust correct answer if needed
      correctAnswerIndex:
        formData.correctAnswerIndex >= newOptions.length
          ? newOptions.length - 1
          : formData.correctAnswerIndex,
    });
  };

  const handleSave = () => {
    if (!formData.questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (formData.options.length < 2) {
      alert('Please provide at least 2 answer options');
      return;
    }

    const emptyOptions = formData.options.filter((opt) => !opt.trim());
    if (emptyOptions.length > 0) {
      alert('All answer options must have text');
      return;
    }

    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-lg border-2 border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>❓</span>
            {question ? 'Edit Question' : 'Create New Question'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg
                       transition-colors text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                       transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Question *</label>
              <textarea
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="What is the correct way to...?"
              />
            </div>

            {/* Answer Options */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-white">
                  Answer Options * (Select the correct one)
                </label>
                <button
                  onClick={handleAddOption}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
                >
                  + Add Option
                </button>
              </div>

              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={formData.correctAnswerIndex === index}
                      onChange={() => setFormData({ ...formData, correctAnswerIndex: index })}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                               text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Option ${index + 1}`}
                    />
                    {formData.options.length > 2 && (
                      <button
                        onClick={() => handleRemoveOption(index)}
                        className="px-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Click the radio button to mark the correct answer
              </p>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Explanation (shown after answering)
              </label>
              <textarea
                value={formData.explanation || ''}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                         text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Explain why this is the correct answer..."
              />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as QuestionDifficulty,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={QuestionDifficulty.EASY}>Easy</option>
                  <option value={QuestionDifficulty.MEDIUM}>Medium</option>
                  <option value={QuestionDifficulty.HARD}>Hard</option>
                  <option value={QuestionDifficulty.EXPERT}>Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      language: e.target.value as ProgrammingLanguage,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ProgrammingLanguage.PYTHON}>Python</option>
                  <option value={ProgrammingLanguage.JAVASCRIPT}>JavaScript</option>
                  <option value={ProgrammingLanguage.GDSCRIPT}>GDScript</option>
                  <option value={ProgrammingLanguage.GENERAL}>General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Topic</label>
                <input
                  type="text"
                  value={formData.topic || ''}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg
                           text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., variables, loops"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
