import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-center text-sm text-gray-500">Create your account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Name"
          name="name"
          register={register}
          error={errors.name}
          rules={{ required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } }}
          placeholder="Jane Doe"
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          rules={{ required: 'Email is required' }}
          placeholder="you@example.com"
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          rules={{
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
            pattern: { value: /\d/, message: 'Must contain at least one number' },
          }}
          placeholder="••••••••"
        />
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          error={errors.confirmPassword}
          rules={{
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          }}
          placeholder="••••••••"
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
