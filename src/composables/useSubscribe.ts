import { ref, watch } from 'vue';

export function useSubscribe() {
  const name = ref('');
  const email = ref('');
  
  const nameError = ref('');
  const emailError = ref('');
  
  const isSubmitting = ref(false);
  const statusMessage = ref('');
  const statusType = ref<'success' | 'error' | ''>('');

  // MailerLite embedded form (account / form IDs from the MailerLite embed)
  const ML_ACCOUNT_ID = '2264313';
  const ML_FORM_ID = '190235065838471016';

  // MailerLite's subscribe endpoint is JSONP-only (CORS blocks a normal fetch),
  // so we submit by injecting a <script> with a callback param.
  const submitToMailerLite = (payload: { email: string; name: string }) => {
    return new Promise<void>((resolve, reject) => {
      const callbackName = `ml_jsonp_${Date.now()}`;
      const params = new URLSearchParams({
        'fields[email]': payload.email,
        'fields[name]': payload.name,
        'ml-submit': '1',
        anticsrf: 'true',
        callback: callbackName
      });

      const script = document.createElement('script');
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('timeout'));
      }, 15000);

      const cleanup = () => {
        clearTimeout(timeout);
        delete (window as Record<string, any>)[callbackName];
        script.remove();
      };

      (window as Record<string, any>)[callbackName] = (response: any) => {
        cleanup();
        // MailerLite returns { success: true, ... } on a accepted subscription.
        if (response && response.success === false) {
          reject(new Error(response.message || 'mailerlite_rejected'));
        } else {
          resolve();
        }
      };

      script.onerror = () => {
        cleanup();
        reject(new Error('network'));
      };

      script.src =
        `https://assets.mailerlite.com/jsonp/${ML_ACCOUNT_ID}/forms/${ML_FORM_ID}/subscribe?` +
        params.toString();
      document.body.appendChild(script);
    });
  };

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
      // Register the subscriber in MailerLite
      await submitToMailerLite({ email: email.value.trim(), name: name.value.trim() });

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
