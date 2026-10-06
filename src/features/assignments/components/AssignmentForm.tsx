import { useForm } from '../../../hooks/useForm';
import type { Validator } from '../../../hooks/useForm';
import { PRIORITIES, PRIORITY_META, isPriority } from '../../../types/assignment';
import type {
  AssignmentFormValues,
  FormErrors,
  NewAssignmentInput,
} from '../../../types/assignment';
import { addDays, isValidISODate } from '../../../utils/date';

const emptyForm = (): AssignmentFormValues => ({
  subject: '',
  title: '',
  dueDate: addDays(3),
  priority: 'medium',
});

const validateForm: Validator<AssignmentFormValues> = (values) => {
  const errors: FormErrors<AssignmentFormValues> = {};

  if (!values.subject.trim()) errors.subject = 'Nhập tên môn học';
  if (!values.title.trim()) errors.title = 'Nhập tên bài tập';
  else if (values.title.trim().length < 3) errors.title = 'Tên quá ngắn';
  if (!values.dueDate) errors.dueDate = 'Chọn hạn nộp';
  else if (!isValidISODate(values.dueDate)) errors.dueDate = 'Ngày không hợp lệ';
  if (!isPriority(values.priority)) errors.priority = 'Độ ưu tiên không hợp lệ';

  return errors;
};

interface Props {
  onSubmit: (input: NewAssignmentInput) => void;
}

function AssignmentForm({ onSubmit }: Props) {
  const { values, errors, register, setField, reset, handleSubmit } = useForm(
    emptyForm(),
    validateForm
  );

  const submit = handleSubmit((form) => {
    if (!isPriority(form.priority)) return;

    onSubmit({
      subject: form.subject.trim(),
      title: form.title.trim(),
      dueDate: form.dueDate,
      priority: form.priority,
    });
    reset(emptyForm());
  });

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <h2 className="card__title">Thêm bài tập</h2>

      <label className="field">
        <span>Môn học</span>
        <input placeholder="VD: Lập trình Web" {...register('subject')} />
        {errors.subject && <em>{errors.subject}</em>}
      </label>

      <label className="field">
        <span>Tên bài tập</span>
        <input placeholder="VD: Bài tập lớn cuối kỳ" {...register('title')} />
        {errors.title && <em>{errors.title}</em>}
      </label>

      <label className="field">
        <span>Hạn nộp</span>
        <input type="date" {...register('dueDate')} />
        {errors.dueDate && <em>{errors.dueDate}</em>}
      </label>

      <div className="quick">
        {[
          { label: 'Hôm nay', days: 0 },
          { label: '+3 ngày', days: 3 },
          { label: '+7 ngày', days: 7 },
        ].map((option) => (
          <button
            key={option.days}
            type="button"
            className={values.dueDate === addDays(option.days) ? 'quick__btn is-on' : 'quick__btn'}
            onClick={() => setField('dueDate', addDays(option.days))}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="field">
        <span>Độ ưu tiên</span>
        <div className="segmented">
          {PRIORITIES.map((priority) => (
            <button
              key={priority}
              type="button"
              className={values.priority === priority ? 'segmented__btn is-on' : 'segmented__btn'}
              onClick={() => setField('priority', priority)}
            >
              <i className="prio__dot" style={{ background: PRIORITY_META[priority].color }} />
              {PRIORITY_META[priority].label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn--primary btn--block">
        Thêm vào danh sách
      </button>
    </form>
  );
}

export default AssignmentForm;
