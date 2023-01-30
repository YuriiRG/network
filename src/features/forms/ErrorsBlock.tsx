export default function ErrosBlock({
  errors
}: {
  errors: readonly (string | undefined)[];
}) {
  return !errors.every((e) => !e) ? (
    <div className='rounded-r-lg border-l-8 border-red-600 bg-red-100 p-4'>
      <ul>
        {errors.map((error, i) => (
          <li key={i} className='font-semibold'>
            {error}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}
