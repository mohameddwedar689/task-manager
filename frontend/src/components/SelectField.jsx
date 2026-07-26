export default function SelectField({ label, error, register, name, options, ...rest }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        {...(register ? register(name) : {})}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
