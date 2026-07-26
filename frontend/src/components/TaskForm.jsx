import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import { TASK_STATUS, TASK_PRIORITY } from '../utils/constants';

/**
 * One form component for both "create task" and "edit task" - the caller
 * passes `defaultValues` (empty for create, the existing task for edit)
 * and `onSubmit`. Avoids duplicating the field list and validation rules
 * across two separate components.
 */
export default function TaskForm({ defaultValues, onSubmit, isSubmitting, onCancel, submitLabel = 'Save Task' }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset({ ...defaultValues, dueDate: defaultValues.dueDate?.slice(0, 10) || '' });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Title"
        name="title"
        register={register}
        error={errors.title}
        placeholder="e.g. Finish quarterly report"
        rules={{
          required: 'Title is required',
          maxLength: { value: 120, message: 'Title must be at most 120 characters' },
        }}
      />

      <InputField
        as="textarea"
        rows={3}
        label="Description"
        name="description"
        register={register}
        error={errors.description}
        placeholder="Optional details…"
        rules={{
          maxLength: { value: 2000, message: 'Description must be at most 2000 characters' },
        }}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Status" name="status" register={register} options={TASK_STATUS} />
        <SelectField label="Priority" name="priority" register={register} options={TASK_PRIORITY} />
      </div>

      <InputField type="date" label="Due Date" name="dueDate" register={register} error={errors.dueDate} />

      <div className="mt-2 flex justify-end gap-3">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
