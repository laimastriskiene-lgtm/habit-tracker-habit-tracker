export function getRecoveryErrorMessage(error) {
  if (error?.status === 429 || /rate_limit/.test(error?.code || '')) return 'Per daug bandymų. Palaukite ir bandykite dar kartą.';
  if (error?.code === 'same_password') return 'Naujas slaptažodis turi skirtis nuo ankstesnio.';
  if (error?.code === 'weak_password') return 'Slaptažodis per silpnas. Pasirinkite stipresnį pagal paskyros reikalavimus.';
  if (error?.code === 'email_address_invalid') return 'Įveskite galiojantį el. pašto adresą.';
  if (error?.status === 401 || error?.status === 403 || /session|token|otp_expired/.test(error?.code || '')) return 'Sesija arba atkūrimo nuoroda nebegalioja. Paprašykite naujos nuorodos.';
  if (error?.name === 'AuthRetryableFetchError' || /fetch|network|load failed/i.test(error?.message || '')) return 'Nepavyko prisijungti prie serverio. Patikrinkite interneto ryšį ir bandykite dar kartą.';
  return 'Veiksmo atlikti nepavyko. Bandykite dar kartą.';
}
