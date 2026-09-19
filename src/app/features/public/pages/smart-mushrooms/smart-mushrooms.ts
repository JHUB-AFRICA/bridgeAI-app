import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-smart-mushrooms',
  styleUrl: './smart-mushrooms.component.css',
  templateUrl: './smart-mushrooms.html',
})
export class SmartMushrooms implements AfterViewInit, OnDestroy {
  protected readonly materialRequestTemplates = {
    structure: [
      'I would like to request a quotation for a Smart Mushroom growing room structure.',
      '',
      'Please include the full list of materials required for a complete build, including:',
      '- Pumice blocks or pumice-concrete materials',
      '- Cement, sand and foundation materials',
      '- Metal frame and structural support',
      '- Reflective insulation',
      '- Shade netting',
      '- Waterproof roof and overhang materials',
      '- Shelves and rack components',
      '- Ventilation and exhaust system',
      '- Humidifier and water setup',
      '- Lighting and electrical fittings',
      '',
      'Please also advise on quantities, recommended dimensions and guidance for a clean, insulated mushroom room.'
    ].join('\n'),
    sensors: [
      'I would like to request a shopping list for the smart sensor and automation kit for my mushroom room.',
      '',
      'Please include the full hardware list for the complete system, including:',
      '- ESP32 Development Board',
      '- Raspberry Pi 4',
      '- DHT22 Temperature & Humidity Sensor',
      '- CO₂ Sensor',
      '- Light Sensor',
      '- Water Level Sensor',
      '- Soil Moisture Sensor (optional)',
      '- Exhaust Fan',
      '- Humidifier',
      '- Heater',
      '- LED Grow Lights',
      '- Water Pump',
      '- Relay Module',
      '- LCD Display',
      '- Power Supply',
      '- Jumper Wires',
      '',
      'Please advise on quantities, compatibility and installation guidance for a complete IoT-based mushroom cultivation setup.'
    ].join('\n')
  } as const;

  protected scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();

    const target = document.getElementById(sectionId);
    if (!target) return;

    const header = document.querySelector('.site-header') as HTMLElement | null;
    const sectionNav = document.querySelector('.smart-page .section-nav') as HTMLElement | null;
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const navHeight = sectionNav?.getBoundingClientRect().height ?? 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - navHeight - 18;

    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${sectionId}`);
  }

  private sectionObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.bindSectionNavigation();
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
  }

  private bindSectionNavigation(): void {
    if (!('IntersectionObserver' in window)) return;

    const nav = document.querySelector('.smart-page .section-nav') as HTMLElement | null;
    const navLinks = Array.from(document.querySelectorAll('.smart-page .section-nav a[data-section]')) as HTMLAnchorElement[];
    const sections = navLinks
      .map(link => document.getElementById(link.dataset['section'] ?? ''))
      .filter((section): section is HTMLElement => section !== null);

    if (!nav || !navLinks.length || !sections.length) return;

    const setActiveSection = (sectionId: string): void => {
      const link = navLinks.find(item => item.dataset['section'] === sectionId);
      if (!link) return;

      navLinks.forEach(item => item.classList.toggle('active', item === link));
      if (nav.scrollWidth > nav.clientWidth) {
        nav.scrollTo({
          left: Math.max(0, link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2),
          behavior: 'smooth'
        });
      }
    };

    setActiveSection(sections[0].id);
    this.sectionObserver = new IntersectionObserver(entries => {
      const activeEntry = entries
        .filter(entry => entry.isIntersecting)
        .sort((first, second) => Math.abs(first.boundingClientRect.top - window.innerHeight * 0.45)
          - Math.abs(second.boundingClientRect.top - window.innerHeight * 0.45))[0];

      if (activeEntry) setActiveSection(activeEntry.target.id);
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => this.sectionObserver?.observe(section));
  }
}
