import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await login(values);
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-center text-sm text-gray-500">Log in to your account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          rules={{ required: 'Password is required' }}
          placeholder="••••••••"
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log In
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
