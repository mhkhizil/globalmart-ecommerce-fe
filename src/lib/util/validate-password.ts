export function testPasswordStrength(password: string): number {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()]/.test(password);
  const length = password.length;

  let score = 0;
  if (hasLowercase) score++;
  if (hasUppercase) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;
  if (length >= 8) score++;

  return score;
}

export function hasPasswordCriteria(password: string): boolean {
  let criteria =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;
  return criteria.test(password);
}
