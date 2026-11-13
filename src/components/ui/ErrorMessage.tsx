interface ErrorMessageProps {
  id?: string
  message: string | null
}

export function ErrorMessage({ id, message }: ErrorMessageProps) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-rose-400">
      {message}
    </p>
  )
}
