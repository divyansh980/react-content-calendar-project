import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Save, X, PlusCircle, PlusSquare } from 'lucide-react';

const ContentCalendarPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [content, setContent] = useState({});
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [newContent, setNewContent] = useState({
    title: '',
    platform: 'Instagram',
    type: 'Post',
    status: 'Planned',
    notes: ''
  });

  const platforms = ['Instagram', 'Facebook', 'Twitter/X', 'LinkedIn', 'TikTok', 'YouTube', 'Blog', 'Email'];
  const contentTypes = ['Post', 'Story', 'Reel', 'Video', 'Article', 'Newsletter', 'Live', 'Poll'];
  const statuses = ['Planned', 'In Progress', 'Ready', 'Published'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const addContent = () => {
    if (!selectedDate || !newContent.title.trim()) return;
    const dateKey = formatDateKey(selectedDate);
    const contentId = Date.now().toString();

    setContent(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { ...newContent, id: contentId }]
    }));

    resetForm();
  };

  const updateContent = () => {
    if (!editingContent || !newContent.title.trim()) return;
    const dateKey = formatDateKey(selectedDate);

    setContent(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].map(item =>
        item.id === editingContent.id ? { ...newContent, id: editingContent.id } : item
      )
    }));

    resetForm();
  };

  const deleteContent = (date, contentId) => {
    const dateKey = formatDateKey(date);
    setContent(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(item => item.id !== contentId)
    }));
  };

  const resetForm = () => {
    setNewContent({
      title: '',
      platform: 'Instagram',
      type: 'Post',
      status: 'Planned',
      notes: ''
    });
    setIsAddingContent(false);
    setEditingContent(null);
    setSelectedDate(null);
  };

  const startEdit = (date, contentItem) => {
    setSelectedDate(date);
    setEditingContent(contentItem);
    setNewContent(contentItem);
    setIsAddingContent(true);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planned': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      'Ready': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'Published': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white';
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold">Content Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
          >
            ←
          </button>
          <span className="text-lg font-semibold min-w-[200px] text-center text-stone-500 dark:text-stone-300">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {days.map((day, index) => {
          const dateKey = day ? formatDateKey(day) : null;
          const dayContent = dateKey ? content[dateKey] || [] : [];

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border rounded-lg ${
                day ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{day.getDate()}</span>
                    <button
                      onClick={() => {
                        setSelectedDate(day);
                        setIsAddingContent(true);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                    >
                      <PlusSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {dayContent.map((item) => (
                      <div
                        key={item.id}
                        className={`p-1 text-xs border rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 ${getStatusColor(item.status)}`}
                        onClick={() => startEdit(day, item)}
                      >
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="flex items-center justify-between">
                          <span>{item.platform}</span>
                          <span className={`px-1 rounded ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {isAddingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md text-gray-900 dark:text-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingContent ? 'Edit Content' : 'Add Content'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Content Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md"
                  placeholder="Enter content title..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Platform</label>
                  <select
                    value={newContent.platform}
                    onChange={(e) => setNewContent(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content Type</label>
                  <select
                    value={newContent.type}
                    onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md"
                  >
                    {contentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newContent.status}
                  onChange={(e) => setNewContent(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newContent.notes}
                  onChange={(e) => setNewContent(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md h-20"
                  placeholder="Add notes, hashtags, or ideas..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {editingContent && (
                <button
                  onClick={() => deleteContent(selectedDate, editingContent.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={editingContent ? updateContent : addContent}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                {editingContent ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendarPlanner;
