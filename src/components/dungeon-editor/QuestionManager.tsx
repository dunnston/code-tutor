import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { McqQuestion, QuestionListItem, QuestionDifficulty, ProgrammingLanguage } from '../../types/mcqQuestions';
import { QuestionEditor } from './QuestionEditor';

interface QuestionManagerProps {
  onClose: () => void;
  onSelectQuestion?: (question: QuestionListItem) => void; // Optional: for selecting questions in nodes
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({ onClose, onSelectQuestion }) => {
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<McqQuestion | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [filterTopic, setFilterTopic] = useState<string>('');

  useEffect(() => {
    loadQuestions();
  }, [filterDifficulty, filterLanguage, filterTopic]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const diffFilter = filterDifficulty === '' ? null : filterDifficulty;
      const langFilter = filterLanguage === '' ? null : filterLanguage;
      const topicFilter = filterTopic === '' ? null : filterTopic;

      const loadedQuestions: QuestionListItem[] = await invoke('list_mcq_questions', {
        difficultyFilter: diffFilter,
        languageFilter: langFilter,
        topicFilter: topicFilter,
      });
      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Failed to load questions:', error);
      alert('Failed to load questions: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingQuestion(null);
    setShowEditor(true);
  };

  const handleEdit = async (questionId: string) => {
    try {
      const question: McqQuestion = await invoke('load_mcq_question', { questionId });
      // Convert options from JSON string to array
      const questionData = {
        ...question,
        options: JSON.parse(question.options),
        tags: question.tags ? JSON.parse(question.tags) : [],
      };
      setEditingQuestion(questionData);
      setShowEditor(true);
    } catch (error) {
      console.error('Failed to load question:', error);
      alert('Failed to load question: ' + error);
    }
  };

  const handleSave = async (question: McqQuestion) => {
    try {
      // Convert arrays to JSON strings for backend
      const questionToSave = {
        ...question,
        options: JSON.stringify(question.options),
        tags: question.tags ? JSON.stringify(question.tags) : null,
      };

      await invoke('save_mcq_question', { question: questionToSave });
      setShowEditor(false);
      setEditingQuestion(null);
      loadQuestions();
      alert('✅ Question saved successfully!');
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('❌ Failed to save question: ' + error);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm(`Delete this question? This cannot be undone.`)) {
      return;
    }

    try {
      await invoke('delete_mcq_question', { questionId });
      loadQuestions();
      alert('✅ Question deleted successfully!');
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('❌ Failed to delete question: ' + error);
    }
  };

  const handleDuplicate = async (questionId: string) => {
    try {
      await invoke('duplicate_mcq_question', { questionId });
      loadQuestions();
      alert('✅ Question duplicated successfully!');
    } catch (error) {
      console.error('Failed to duplicate question:', error);
      alert('❌ Failed to duplicate question: ' + error);
    }
  };

  if (showEditor) {
    return (
      <QuestionEditor
        question={editingQuestion}
        onSave={handleSave}
        onCancel={() => {
          setShowEditor(false);
          setEditingQuestion(null);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-lg border-2 border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>❓</span>
            Question Manager
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg
                       transition-colors text-sm font-medium flex items-center gap-2"
            >
              <span>➕</span>
              Create Question
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg
                       transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-800/50 border-b border-slate-700 p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-400">Filters:</label>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>

            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Languages</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="gdscript">GDScript</option>
              <option value="general">General</option>
            </select>

            <input
              type="text"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              placeholder="Filter by topic..."
              className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => {
                setFilterDifficulty('');
                setFilterLanguage('');
                setFilterTopic('');
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <p className="text-gray-400 text-center">Loading questions...</p>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No questions found. Create your first question!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-blue-500
                           transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-white font-medium mb-2">{question.questionText}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`inline-block px-2 py-0.5 rounded ${
                            question.difficulty === 'easy'
                              ? 'bg-green-600'
                              : question.difficulty === 'medium'
                              ? 'bg-yellow-600'
                              : question.difficulty === 'hard'
                              ? 'bg-orange-600'
                              : 'bg-red-600'
                          }`}
                        >
                          {question.difficulty}
                        </span>
                        <span className="bg-blue-600 px-2 py-0.5 rounded">
                          {question.language}
                        </span>
                        {question.topic && (
                          <span className="bg-purple-600 px-2 py-0.5 rounded">
                            {question.topic}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {onSelectQuestion && (
                        <button
                          onClick={() => {
                            onSelectQuestion(question);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded
                                   transition-colors text-sm"
                        >
                          Select
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(question.id)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded
                                 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(question.id)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded
                                 transition-colors text-sm"
                        title="Duplicate"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded
                                 transition-colors text-sm"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
