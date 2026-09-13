import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

export interface ConsortiumPartner {
  slug: string;
  name: string;
  country: string;
  website: string;
  logo: string;
  description: string;
  role: string;
}

export const CONSORTIUM_PARTNERS: ConsortiumPartner[] = [
  { slug: 'eurecat', name: 'Eurecat', country: 'Spain', website: 'https://eurecat.org/home/en/', logo: '/images/webimages/partners/EURECAT.jpeg', description: 'Eurecat is one of Europe’s leading technology centres for accelerating innovation through distinctive technological solutions that combine knowledge, social and environmental impact.', role: 'Eurecat coordinates BRIDGE-AI through its Applied Artificial Intelligence Unit, leading the development of advanced digital solutions for climate-smart agriculture in Africa.' },
  { slug: 'upm', name: 'Universidad Politécnica de Madrid', country: 'Spain', website: 'https://www.upm.es/internacional', logo: '/images/webimages/partners/Universidad Politécnica de Madrid.jpeg', description: 'Universidad Politécnica de Madrid is the largest Spanish technology university and a renowned European institution with strong research capacity across engineering and applied sciences.', role: 'UPM contributes scientific expertise and fine-tunes generative AI models for BRIDGE-AI use cases, while supporting training and long-term deployment across Africa.' },
  { slug: 'jkuat', name: 'Jomo Kenyatta University of Agriculture and Technology', country: 'Kenya', website: 'https://www.jkuat.ac.ke/', logo: '/images/webimages/partners/Jomo Kenyatta University of Agriculture and Technology.jpeg', description: 'JKUAT is a premier public university in Kenya, renowned for excellence in science, engineering and technology education, with a strong commitment to practical solutions.', role: 'JKUAT serves as the implementing partner for the Smart Mushroom pilot, harnessing generative AI and IoT to build climate-resilient, youth-driven mushroom farming systems.' },
  { slug: 'university-of-sousse', name: 'University of Sousse', country: 'Tunisia', website: 'https://www.uc.rnu.tn/', logo: '/images/webimages/partners/University of Sousse.jpeg', description: 'The University of Sousse is one of Tunisia’s leading public universities, bringing together expertise in engineering, computer science, artificial intelligence, agriculture and digital technologies.', role: 'The University of Sousse leads WP2 and coordinates requirements definition, stakeholder engagement, data collection and use-case preparation for the Tunisian pilot.' },
  { slug: 'moome', name: 'MooMe', country: 'Tunisia', website: 'https://moome.tn/', logo: '/images/webimages/partners/moome.png', description: 'MooMe, developed by STE LIFEYE SARL, is a mobile-first operating system for livestock that connects farmers, veterinarians and value-chain partners through shared digital records.', role: 'Within BRIDGE-AI, MooMe contributes to the co-design, implementation and validation of use cases, including AI-optimised, climate-resilient pasture management.' },
  { slug: 'agroinfotech', name: 'AgroInfoTech Labs Limited', country: 'Nigeria', website: 'https://agroinfotech.com.ng/', logo: '/images/webimages/partners/Agroinfotech.jpeg', description: 'AgroInfoTech Labs is a Nigerian research, innovation and venture design company developing resilient, trusted and inclusive digital food systems across Africa.', role: 'AgroInfoTech Labs serves as the Nigerian user-case provider for climate-smart maize production and contributes to validation of generative AI, Earth observation and decision-support systems.' },
  { slug: 'austria-card', name: 'Austria Card Plastikkarten und Ausweissysteme G.M.B.H.', country: 'Austria', website: 'https://www.austriacard.com/', logo: '/images/webimages/partners/Austria Card.jpeg', description: 'Austriacard is an innovative company specialising in embedded hardware security, information management and secure digital services.', role: 'Austria Card contributes secure digital solutions, scalable deployment and exploitation of AI-enabled infrastructures for reliable agricultural services.' },
  { slug: 'seamless', name: 'Seamless Middleware Technologies SL', country: 'Spain', website: 'https://www.seamware.eu/', logo: '/images/webimages/partners/Seamless.jpeg', description: 'Seamless Middleware Technologies, also known as SEAMWARE, specialises in technological integration, middleware solutions and connectivity between systems.', role: 'SEAMWARE supports BRIDGE-AI interoperability through context management, smart data models and semantic integration across distributed digital environments.' }
];

@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-partners',
  styleUrl: './partners.css',
  templateUrl: './partners.html',
})
export class Partners {
  protected readonly partners = CONSORTIUM_PARTNERS;
  protected detailPartner: ConsortiumPartner | null = null;
  protected readonly activeRelated = 0;

  constructor(route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      this.detailPartner = CONSORTIUM_PARTNERS.find(partner => partner.slug === slug) ?? null;
    });
  }
}
