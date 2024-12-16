import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';
import { Plus, Trash } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import type { Survey } from '../../types/survey';

interface QuestionBuilderProps {
  control: Control<Survey>;
}

export function QuestionBuilder({ control }: QuestionBuilderProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const handleAddQuestion = () => {
    append({
      id: crypto.randomUUID(),
      type: 'text',
      text: '',
      required: true,
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Questions</h2>
        <Button onClick={handleAddQuestion} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="relative flex gap-4 rounded-lg border border-gray-200 p-4">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Question Text" {...control.register(`questions.${index}.text`)} />

                <Select label="Question Type" {...control.register(`questions.${index}.type`)}>
                  <option value="text">Text</option>
                  <option value="rating">Rating</option>
                  <option value="multipleChoice">Multiple Choice</option>
                </Select>
              </div>

              <Checkbox label="Required" {...control.register(`questions.${index}.required`)} />
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
          <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
            <p className="text-sm text-gray-500">No questions added yet.</p>
            <Button onClick={handleAddQuestion} variant="outline" size="sm" className="mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
