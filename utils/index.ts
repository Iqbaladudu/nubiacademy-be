export function splitName(fullName: string) {
  // Split the full name into an array of words
  const nameParts = fullName.trim().split(/\s+/)

  // If there's only one name, treat it as both first and last
  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      lastName: '',
    }
  }

  // Otherwise, the first element is the first name, and the rest are the last name
  return {
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' '),
  }
}
