import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Contact from './Contact.vue';
import Hero from './Hero.vue';

describe('Contact.vue', () => {
  it('2.10 renderuje dokładnie 4 pozycje FAQ', () => {
    const wrapper = mount(Contact);
    expect(wrapper.findAll('.faq-item')).toHaveLength(4);
  });

  it('2.11 formularz Contact ma stan niezależny od formularza Hero (osobne instancje useSubscribe)', async () => {
    const heroWrapper = mount(Hero);
    const contactWrapper = mount(Contact);

    await heroWrapper.get('#hero-name').setValue('Krystyna');

    expect((contactWrapper.get('#final-name').element as HTMLInputElement).value).toBe('');
  });
});
