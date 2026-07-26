/**
 * Reusable form input wired for react-hook-form's `register()` spread.
 * Centralizes label + error message rendering so form components stay
 * focused on field lists, not repeated markup.
 */
export default function InputField({ label, error, as = 'input', register, name, rules, ...rest }) {
  const Component = as;
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Component
        id={name}
        {...(register ? register(name, rules) : {})}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'}`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
