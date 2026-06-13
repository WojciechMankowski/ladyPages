import { ref, watch } from 'vue';

export function useSubscribe() {
  const name = ref('');
  const email = ref('');
  
  const nameError = ref('');
  const emailError = ref('');
  
  const isSubmitting = ref(false);
  const statusMessage = ref('');
  const statusType = ref<'success' | 'error' | ''>('');

  const validateEmail = (val: string) => {
    if (!val) {
      return 'Adres e-mail jest wymagany.';
    }
    // Simple robust email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Wprowadź poprawny adres e-mail (np. nazwa@domena.pl).';
    }
    return '';
  };

  const validateName = (val: string) => {
    if (!val || !val.trim()) {
      return 'Imię jest wymagane.';
    }
    if (val.trim().length < 2) {
      return 'Imię powinno mieć co najmniej 2 znaki.';
    }
    return '';
  };

  // Listeners to validate/clear errors in real-time as user types
  watch(name, (newVal) => {
    if (newVal) {
      nameError.value = validateName(newVal);
    } else {
      nameError.value = '';
    }
  });

  watch(email, (newVal) => {
    if (newVal) {
      emailError.value = validateEmail(newVal);
    } else {
      emailError.value = '';
    }
  });

  const subscribe = async () => {
    // Run validation on submit
    nameError.value = validateName(name.value);
    emailError.value = validateEmail(email.value);

    if (nameError.value || emailError.value) {
      statusMessage.value = 'Proszę poprawić błędy w formularzu.';
      statusType.value = 'error';
      return false;
    }

    isSubmitting.value = true;
    statusMessage.value = '';
    statusType.value = '';

    try {
      // Simulate API call to register subscriber (1.5s delay)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      statusMessage.value = 'Gotowe! Sprawdź skrzynkę. Ebook już leci. Jakby nie dotarł w 5 minut, zajrzyj do folderu Oferty/Spam.';
      statusType.value = 'success';
      
      // Clear inputs and error states on success
      name.value = '';
      email.value = '';
      nameError.value = '';
      emailError.value = '';
      
      return true;
    } catch (err) {
      statusMessage.value = 'Wystąpił błąd podczas zapisu. Spróbuj ponownie później.';
      statusType.value = 'error';
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    name,
    email,
    nameError,
    emailError,
    isSubmitting,
    statusMessage,
    statusType,
    subscribe
  };
}
