import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';
import { Plus, GripVertical, Trash } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import type { Question } from '../../types/survey';

interface QuestionBuilderProps {
  control: Control<any>;
}

export function QuestionBuilder({ control }: QuestionBuilderProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions'
  });

  const handleAddQuestion = () => {
    append({
      id: crypto.randomUUID(),
      type: 'text',
      text: '',
      required: true
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Questions</h2>
        <Button onClick={handleAddQuestion} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative flex gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <button
              type="button"
              className="cursor-move text-gray-400 hover:text-gray-500"
            >
              <GripVertical className="h-5 w-5" />
            </button>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Question Text"
                  {...control.register(`questions.${index}.text`)}
                />
                
                <Select
                  label="Question Type"
                  {...control.register(`questions.${index}.type`)}
                >
                  <option value="text">Text</option>
                  <option value="rating">Rating</option>
                  <option value="multipleChoice">Multiple Choice</option>
                </Select>
              </div>

              <Checkbox
                label="Required"
                {...control.register(`questions.${index}.required`)}
              />
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">No questions added yet.</p>
            <Button onClick={handleAddQuestion} variant="outline" size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}