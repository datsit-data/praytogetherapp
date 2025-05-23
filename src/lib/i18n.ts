
// src/lib/i18n.ts
export type Locale = 'en' | 'es';

export const translations = {
  en: {
    appName: "PrayTogether",
    tagline: "Share your heart, and let us help you craft a personalized prayer journey, guided by wisdom and scripture.",
    welcome: "Welcome to PrayTogether",
    prayerReasonLabel: "What would you like to pray for?",
    prayerReasonPlaceholder: "E.g., for strength during a challenging time, for guidance in a decision, for gratitude for blessings received...",
    createPlanButton: "Create My Prayer Plan",
    generatingPlanButton: "Generating Plan...",
    planGeneratedSuccessMessage: "Your prayer plan for \"{reason}\" has been generated!",
    savedPlansNav: "Saved Plans",
    selectLanguage: "Select language",
    english: "English",
    spanish: "Español (Spanish)",
    footerRights: "All rights reserved.",
    footerCrafted: "Crafted with care for your spiritual journey.",
    loadingSavedPlans: "Loading saved plans...",
    noSavedPlansTitle: "No Saved Plans Yet",
    noSavedPlansDescription: "You haven't saved any prayer plans. Create a new plan from the homepage and save it to see it here.",
    yourSavedPlans: "Your Saved Prayer Plans",
    planFor: "Plan for:",
    saved: "Saved:",
    deletePlan: "Delete plan",
    deletePlanConfirmTitle: "Are you sure?",
    deletePlanConfirmDescription: "This action cannot be undone. This will permanently delete this prayer plan.",
    cancel: "Cancel",
    delete: "Delete",
    noPlanGeneratedTitle: "No Plan Generated",
    noPlanGeneratedDescription: "We couldn't generate a prayer plan based on your input. Please try rephrasing your reason or try again later.",
    yourPersonalizedPlan: "Your Personalized Prayer Plan",
    for: "For:",
    language: "Language:",
    savedOn: "Saved on:",
    recommendedDaysAndDuration: "Recommended Days & Duration",
    saveThisPlan: "Save This Plan",
    planSavedTitle: "Plan Saved!",
    planSavedDescription: "Your prayer plan for \"{reason}\" has been saved.",
    errorSavingPlanTitle: "Error Saving Plan",
    errorSavingPlanDescription: "Could not save the plan. LocalStorage might be unavailable or full.",
    success: "Success!",
    error: "Error",
    planGenerationFailedTitle: "Plan Generation Failed",
    planGenerationFailedDescription: "{error} Please try modifying your prayer reason or try again later.",
    notice: "Notice",
    selectAppLanguage: "Select App Language:",
    createAnotherPlan: "Create Another Plan",
    reflectionTitle: "Reflection",
    guidedPrayerTitle: "Guided Prayer",
    tipOfTheDayTitle: "Tip of the Day",
    actionableStepsTitle: "Actionable Steps",
    // Auth translations
    loginTitle: "Log In",
    loginButton: "Log In",
    loggingInButton: "Logging In...",
    loginPrompt: "Log in to your PrayTogether account.",
    emailLabel: "Email",
    passwordLabel: "Password",
    passwordPlaceholder: "At least 6 characters",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    dontHaveAccountPrompt: "Don't have an account?",
    signupLink: "Sign up",
    signupTitle: "Create Account",
    signupButton: "Sign Up",
    creatingAccountButton: "Creating Account...",
    signupPrompt: "Create a new PrayTogether account.",
    alreadyHaveAccountPrompt: "Already have an account?",
    loginLink: "Log in",
    logoutButton: "Log Out",
    myAccount: "My Account",
    profile: "Profile", 
    signupFailedError: "Signup failed. Please try again.",
    loginFailedError: "Login failed. Please check your credentials.",
    logoutFailedError: "Logout failed. Please try again.",
    passwordsDontMatchError: "Passwords do not match.",
    checkingAuthStatus: "Checking authentication status...",
    accessDeniedTitle: "Access Denied",
    mustBeLoggedInToViewPlans: "You must be logged in to view your saved plans.",
    createFirstPlanButton: "Create Your First Plan",
    orContinueWith: "Or continue with",
    signInWithGoogleButton: "Sign in with Google",
    googleSignInFailedError: "Google Sign-In failed. Please try again.",
    googlePopupClosedError: "Google Sign-In popup closed by user. Please try again if it was accidental.",
    profileFetchError: "Could not load your profile information. Please try again later.",
    mustBeLoggedInToSaveProfile: "You must be logged in to save your profile.",
    // Profile Page
    editProfileTitle: "Edit Profile",
    editProfileDescription: "Update your personal information and preferences.",
    completeYourProfileTitle: "Complete Your Profile",
    completeYourProfileDescription: "Tell us a bit about yourself to personalize your experience.",
    profileNameLabel: "Name",
    profilePhotoUrlLabel: "Photo URL",
    profileBioLabel: "Bio (optional)",
    profileBioPlaceholder: "Tell us a little about yourself...",
    profileReligionLabel: "Religion",
    profileReligionPlaceholder: "Select your religion",
    profileCountryLabel: "Country (optional)",
    profileCountryPlaceholder: "E.g., United States",
    profileCityLabel: "City (optional)",
    profileCityPlaceholder: "E.g., New York",
    profilePreferredLanguageLabel: "Preferred App Language",
    profilePreferredBibleVersionLabel: "Preferred Bible Version",
    profileBibleVersionPlaceholder: "Select Bible version",
    noBibleVersionsForLanguage: "No Bible versions available for the selected language.",
    selectLanguageForBibleVersions: "Select your preferred language to see available Bible versions.",
    saveProfileButton: "Save Profile",
    savingProfileButton: "Saving...",
    profileSavedTitle: "Profile Saved!",
    profileSavedDescription: "Your profile information has been updated successfully.",
    errorSavingProfileTitle: "Error Saving Profile",
    errorSavingProfileDescription: "An unexpected error occurred while saving your profile. Please try again.",
    // Religions
    christianity: "Christianity",
    judaism: "Judaism",
    islam: "Islam",
    hinduism: "Hinduism",
    buddhism: "Buddhism",
    spiritual_not_religious: "Spiritual but not religious",
    agnostic: "Agnostic",
    atheist: "Atheist",
    other: "Other",
    prefer_not_to_say: "Prefer not to say",

  },
  es: {
    appName: "OremosJuntos",
    tagline: "Comparte tu corazón y permítenos ayudarte a crear un viaje de oración personalizado, guiado por la sabiduría y las Escrituras.",
    welcome: "Bienvenido a OremosJuntos",
    prayerReasonLabel: "¿Por qué te gustaría orar?",
    prayerReasonPlaceholder: "Ej., por fortaleza en un momento difícil, por guía en una decisión, por gratitud por las bendiciones recibidas...",
    createPlanButton: "Crear Mi Plan de Oración",
    generatingPlanButton: "Generando Plan...",
    planGeneratedSuccessMessage: "¡Tu plan de oración para \"{reason}\" ha sido generado!",
    savedPlansNav: "Planes Guardados",
    selectLanguage: "Selecciona el idioma",
    english: "Inglés",
    spanish: "Español",
    footerRights: "Todos los derechos reservados.",
    footerCrafted: "Creado con esmero para tu camino espiritual.",
    loadingSavedPlans: "Cargando planes guardados...",
    noSavedPlansTitle: "Aún No Hay Planes Guardados",
    noSavedPlansDescription: "No has guardado ningún plan de oración. Crea un nuevo plan desde la página de inicio y guárdalo para verlo aquí.",
    yourSavedPlans: "Tus Planes de Oración Guardados",
    planFor: "Plan para:",
    saved: "Guardado:",
    deletePlan: "Eliminar plan",
    deletePlanConfirmTitle: "¿Estás seguro?",
    deletePlanConfirmDescription: "Esta acción no se puede deshacer. Esto eliminará permanentemente este plan de oración.",
    cancel: "Cancelar",
    delete: "Eliminar",
    noPlanGeneratedTitle: "No se Generó Ningún Plan",
    noPlanGeneratedDescription: "No pudimos generar un plan de oración basado en tu solicitud. Intenta reformular tu motivo o inténtalo de nuevo más tarde.",
    yourPersonalizedPlan: "Tu Plan de Oración Personalizado",
    for: "Para:",
    language: "Idioma:",
    savedOn: "Guardado el:",
    recommendedDaysAndDuration: "Días y Duración Recomendados",
    saveThisPlan: "Guardar Este Plan",
    planSavedTitle: "¡Plan Guardado!",
    planSavedDescription: "Tu plan de oración para \"{reason}\" ha sido guardado.",
    errorSavingPlanTitle: "Error al Guardar el Plan",
    errorSavingPlanDescription: "No se pudo guardar el plan. Es posible que LocalStorage no esté disponible o esté lleno.",
    success: "¡Éxito!",
    error: "Error",
    planGenerationFailedTitle: "Falló la Generación del Plan",
    planGenerationFailedDescription: "{error} Por favor, intenta modificar el motivo de tu oración o inténtalo de nuevo más tarde.",
    notice: "Aviso",
    selectAppLanguage: "Seleccionar Idioma de la Aplicación:",
    createAnotherPlan: "Crear Otro Plan",
    reflectionTitle: "Reflexión",
    guidedPrayerTitle: "Oración Guiada",
    tipOfTheDayTitle: "Consejo del Día",
    actionableStepsTitle: "Cosas que puedes hacer en el día a día",
    // Auth translations
    loginTitle: "Iniciar Sesión",
    loginButton: "Iniciar Sesión",
    loggingInButton: "Iniciando Sesión...",
    loginPrompt: "Inicia sesión en tu cuenta de OremosJuntos.",
    emailLabel: "Correo Electrónico",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Mínimo 6 caracteres",
    confirmPasswordLabel: "Confirmar Contraseña",
    confirmPasswordPlaceholder: "Vuelve a escribir tu contraseña",
    dontHaveAccountPrompt: "¿No tienes una cuenta?",
    signupLink: "Regístrate",
    signupTitle: "Crear Cuenta",
    signupButton: "Registrarse",
    creatingAccountButton: "Creando Cuenta...",
    signupPrompt: "Crea una nueva cuenta en OremosJuntos.",
    alreadyHaveAccountPrompt: "¿Ya tienes una cuenta?",
    loginLink: "Inicia sesión",
    logoutButton: "Cerrar Sesión",
    myAccount: "Mi Cuenta",
    profile: "Perfil", 
    signupFailedError: "Error al registrarse. Por favor, inténtalo de nuevo.",
    loginFailedError: "Error al iniciar sesión. Verifica tus credenciales.",
    logoutFailedError: "Error al cerrar sesión. Por favor, inténtalo de nuevo.",
    passwordsDontMatchError: "Las contraseñas no coinciden.",
    checkingAuthStatus: "Verificando estado de autenticación...",
    accessDeniedTitle: "Acceso Denegado",
    mustBeLoggedInToViewPlans: "Debes iniciar sesión para ver tus planes guardados.",
    createFirstPlanButton: "Crea Tu Primer Plan",
    orContinueWith: "O continuar con",
    signInWithGoogleButton: "Iniciar sesión con Google",
    googleSignInFailedError: "Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.",
    googlePopupClosedError: "La ventana de inicio de sesión de Google fue cerrada por el usuario. Por favor, inténtalo de nuevo si fue accidental.",
    profileFetchError: "No se pudo cargar la información de tu perfil. Por favor, inténtalo más tarde.",
    mustBeLoggedInToSaveProfile: "Debes iniciar sesión para guardar tu perfil.",
    // Profile Page
    editProfileTitle: "Editar Perfil",
    editProfileDescription: "Actualiza tu información personal y preferencias.",
    completeYourProfileTitle: "Completa Tu Perfil",
    completeYourProfileDescription: "Cuéntanos un poco sobre ti para personalizar tu experiencia.",
    profileNameLabel: "Nombre",
    profilePhotoUrlLabel: "URL de Foto",
    profileBioLabel: "Biografía (opcional)",
    profileBioPlaceholder: "Cuéntanos un poco sobre ti...",
    profileReligionLabel: "Religión",
    profileReligionPlaceholder: "Selecciona tu religión",
    profileCountryLabel: "País (opcional)",
    profileCountryPlaceholder: "Ej., Estados Unidos",
    profileCityLabel: "Ciudad (opcional)",
    profileCityPlaceholder: "Ej., Nueva York",
    profilePreferredLanguageLabel: "Idioma Preferido de la App",
    profilePreferredBibleVersionLabel: "Versión de Biblia Preferida",
    profileBibleVersionPlaceholder: "Selecciona versión de la Biblia",
    noBibleVersionsForLanguage: "No hay versiones de la Biblia disponibles para el idioma seleccionado.",
    selectLanguageForBibleVersions: "Selecciona tu idioma preferido para ver las versiones de la Biblia disponibles.",
    saveProfileButton: "Guardar Perfil",
    savingProfileButton: "Guardando...",
    profileSavedTitle: "¡Perfil Guardado!",
    profileSavedDescription: "La información de tu perfil ha sido actualizada exitosamente.",
    errorSavingProfileTitle: "Error Guardando Perfil",
    errorSavingProfileDescription: "Ocurrió un error inesperado al guardar tu perfil. Por favor, inténtalo de nuevo.",
    // Religions (Spanish)
    christianity: "Cristianismo",
    judaism: "Judaísmo",
    islam: "Islam",
    hinduism: "Hinduismo",
    buddhism: "Budismo",
    spiritual_not_religious: "Espiritual pero no religioso/a",
    agnostic: "Agnóstico/a",
    atheist: "Ateo/a",
    other: "Otro",
    prefer_not_to_say: "Prefiero no decirlo",
  },
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en;
}
