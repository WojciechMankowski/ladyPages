import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Footer from './Footer.vue';

describe('Footer.vue', () => {
  it('2.12 linki social (LinkedIn/GitHub) mają target="_blank" i rel="noopener noreferrer"', () => {
    const wrapper = mount(Footer);
    const socialLinks = wrapper.findAll('.footer-socials a');
    expect(socialLinks).toHaveLength(2);
    socialLinks.forEach((link) => {
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
    });
  });

  it('2.13 linki stopki wskazują wyłącznie na id sekcji, które faktycznie istnieją na stronie', () => {
    // Sekcje istniejące w App.vue mają id: #about, #ebook (Specializations),
    // #target-audience/#signup-reward (Process), #faq/#contact (Contact).
    // Wcześniej stopka linkowała do #specializations, #projects, #process — żadne
    // z nich nie istniało w markupie (patrz test_frontend.md, sekcja 8: bugi P0).
    // Naprawione w Footer.vue: #specializations→#ebook, #process→#target-audience,
    // link "Projekty" usunięty (sekcja nigdy nie istniała na stronie).
    const wrapper = mount(Footer);
    const hrefs = wrapper.findAll('.footer-links a').map((a) => a.attributes('href'));
    const existingSectionIds = ['#about', '#ebook', '#target-audience', '#signup-reward', '#faq', '#contact'];

    hrefs
      .filter((href) => href?.startsWith('#'))
      .forEach((href) => {
        expect(existingSectionIds).toContain(href);
      });
  });
});
