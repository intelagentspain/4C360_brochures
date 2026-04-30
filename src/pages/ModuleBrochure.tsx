import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import {
  Anchor,
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  DoorOpen,
  Factory,
  Flame,
  Leaf,
  Mic,
  Network,
  PhoneOff,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Users,
  Waves,
  Wrench,
  X,
} from 'lucide-react';

type Audience = 'Executive' | 'Operations' | 'Property Management' | 'Field Teams' | 'Residents' | 'Compliance' | 'HSE' | 'Marine' | 'Contractors' | 'Retail';
type SolutionSlug = 'properties' | 'fm' | 'marine' | 'osh' | 'retail-compliance';

interface SolutionModule {
  id: string;
  name: string;
  tagline: string;
  category: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  accent: string;
  audiences: Audience[];
  summary: string;
  outcomes: string[];
  workflows: string[];
  aiCapabilities: string[];
  kpis: string[];
  integrations: string[];
  clientValue: string;
}

interface Solution {
  slug: SolutionSlug;
  name: string;
  label: string;
  headline: string;
  subheadline: string;
  audience: string;
  accent: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  stats: Array<[string, string]>;
  modules: SolutionModule[];
  organizationValue: Array<[string, string]>;
  ctas: string[];
}

const SOLUTIONS_AGENT_ID = (import.meta.env.VITE_ELEVENLABS_SOLUTIONS_AGENT_ID as string | undefined)?.trim();
const DEMO_URL = 'https://calendly.com/4c360/intro-meeting';

const audiences: Array<'All' | Audience> = ['All', 'Executive', 'Operations', 'Property Management', 'Field Teams', 'Residents', 'Compliance', 'HSE', 'Marine', 'Retail'];

const propertiesModules: SolutionModule[] = [
  {
    id: 'projectcommand',
    name: 'ProjectCommand',
    tagline: 'Predictive project command centre',
    category: 'Property Development',
    icon: Factory,
    accent: '#7C3AED',
    audiences: ['Executive', 'Property Management', 'Compliance'],
    summary: 'A construction intelligence layer for project owners and developers. It combines programme, cost, risk, obligations, evidence, stage gates, and AI forecast views into one operating picture.',
    outcomes: ['Forecast project delays before they become claims', 'Connect programme risk with cost impact', 'Track obligations, evidence, and stage-gate readiness', 'Give leaders one view of delivery confidence'],
    workflows: ['Review AI threat score and top decisions', 'Switch between projects and compare delivery health', 'Track stage gates, obligations, risks, and evidence', 'Run forecast scenarios for handover and final cost'],
    aiCapabilities: ['Delay and cost forecast narratives', 'Metric explanations on KPI cards', 'AI readiness and risk summaries', 'Scenario-based recommendations'],
    kpis: ['Completion %', 'Budget used', 'CPI / SPI', 'Float remaining', 'Open blockers', 'Evidence compliance'],
    integrations: ['Programme data', 'Cost reports', 'Risk register', 'Evidence repository', 'Vendor performance', 'FieldOps submissions'],
    clientValue: 'Turns project reporting from a backward-looking status update into a forward-looking decision system.',
  },
  {
    id: 'fieldops',
    name: 'FieldOps',
    tagline: 'AI-assisted mobile surveys and inspections',
    category: 'Field Execution',
    icon: ClipboardCheck,
    accent: '#E11D2E',
    audiences: ['Operations', 'Field Teams', 'Compliance'],
    summary: 'A mobile survey studio for creating, assigning, sharing, capturing, and tracking inspections across properties, assets, teams, vendors, and contractors.',
    outcomes: ['Standardize field inspections across properties', 'Capture evidence, GPS, readings, and signatures', 'Convert failed checks into incidents', 'Track live submissions from email or QR code'],
    workflows: ['Create a survey with AI, template, or manual flow', 'Assign to teams, vendors, roles, sites, and assets', 'Share by email, QR, WhatsApp, or link', 'Review submitted answers, photos, and issues'],
    aiCapabilities: ['Prompt-based checklist generation', 'AI draft preview by inspection type', 'Copilot guidance for technical checks', 'AI-assisted instructions and readiness checks'],
    kpis: ['Active surveys', 'In progress', 'Completed', 'Overdue', 'Open issues detected', 'Evidence files'],
    integrations: ['ServiceDesk', 'SnapFix', 'Assets', 'ProjectCommand evidence', 'Email service', 'QR capture'],
    clientValue: 'Replaces scattered paper checklists and ad hoc site updates with a governed, evidence-backed mobile capture process.',
  },
  {
    id: 'residentportal',
    name: 'ResidentPortal',
    tagline: 'Resident and owner service experience',
    category: 'Community Services',
    icon: DoorOpen,
    accent: '#2E7FFF',
    audiences: ['Residents', 'Property Management', 'Operations'],
    summary: 'A connected resident and owner portal for requests, notices, documents, community services, payments, and communication with property management.',
    outcomes: ['Improve resident satisfaction and transparency', 'Reduce support calls with self-service tracking', 'Connect resident requests to operations', 'Manage notices, documents, and community services'],
    workflows: ['Resident reports an issue with photo or voice note', 'AI classifies and routes the request', 'Management tracks status and communication', 'Resident confirms resolution and rates service'],
    aiCapabilities: ['Issue description assistance', 'Request status summaries', 'Repeat complaint detection', 'Priority and escalation suggestions'],
    kpis: ['Total residents', 'Open requests', 'Pending payments', 'Notices sent', 'Read rate', 'Satisfaction score'],
    integrations: ['SnapFix', 'ServiceDesk', 'Payments', 'Documents', 'Notices', 'Resident messaging'],
    clientValue: 'Creates a calmer resident experience while giving management a live view of demand, service quality, and satisfaction risk.',
  },
  {
    id: 'vendoriq',
    name: 'VendorIQ',
    tagline: 'Vendor performance intelligence',
    category: 'Procurement and Partners',
    icon: ShieldCheck,
    accent: '#00B894',
    audiences: ['Executive', 'Operations', 'Property Management'],
    summary: 'A vendor performance cockpit that connects SLA, quality, evidence, cost, first-time-fix, compliance, and risk into one partner score.',
    outcomes: ['Rank vendors by true operational performance', 'Identify SLA and quality drift early', 'Support renewals and contract reviews with evidence', 'Reduce repeat visits and unmanaged cost leakage'],
    workflows: ['Review vendor score and AI insights', 'Compare vendors by property and service type', 'Open contract and job performance details', 'Trigger corrective action or escalation'],
    aiCapabilities: ['Performance explanation badges', 'Repeat failure detection', 'Cost efficiency insights', 'Recommended escalation actions'],
    kpis: ['Vendor score', 'SLA compliance', 'First-time fix', 'Evidence compliance', 'Jobs last 30 days', 'Average cost per job'],
    integrations: ['Work orders', 'Contracts', 'ServiceDesk', 'FieldOps evidence', 'ProjectCommand risks'],
    clientValue: 'Turns vendor management into a measurable, defensible, and improvement-focused operating model.',
  },
  {
    id: 'snapfix',
    name: 'SnapFix',
    tagline: 'Defect and issue capture',
    category: 'Issue Intake',
    icon: Radar,
    accent: '#FF4B4B',
    audiences: ['Operations', 'Field Teams', 'Residents'],
    summary: 'Fast photo, voice, and QR-based issue capture that converts field observations into structured incidents or service requests.',
    outcomes: ['Reduce friction at the point of issue capture', 'Improve classification quality', 'Route issues faster', 'Attach clean evidence from the start'],
    workflows: ['Scan asset or location QR', 'Capture photo or voice note', 'AI classifies issue and suggests priority', 'Create incident or request for dispatch'],
    aiCapabilities: ['Image and text classification', 'Structured issue summary', 'Suggested severity and category', 'Duplicate issue hints'],
    kpis: ['Issues captured', 'Auto-classification rate', 'Evidence completeness', 'Time to dispatch', 'Duplicate reduction'],
    integrations: ['ServiceDesk', 'FieldOps', 'Assets', 'ResidentPortal', 'GIS map'],
    clientValue: 'Makes issue reporting fast enough for field teams and residents to actually use, while keeping data structured for operations.',
  },
  {
    id: 'servicedesk',
    name: 'ServiceDesk',
    tagline: 'Ticket and SLA command layer',
    category: 'Service Operations',
    icon: TicketCheck,
    accent: '#00C6FF',
    audiences: ['Operations', 'Property Management', 'Residents'],
    summary: 'A ticket management layer for reviewing, assigning, escalating, communicating, and closing service requests across properties and vendors.',
    outcomes: ['Control SLA exposure in real time', 'Improve dispatch decisions', 'Keep residents and clients informed', 'Close work with proper evidence'],
    workflows: ['Review incoming requests', 'Assign internal team or vendor', 'Track SLA and escalation rules', 'Close with evidence and confirmation'],
    aiCapabilities: ['Priority suggestions', 'SLA risk warnings', 'Assignment recommendations', 'Closure summary drafting'],
    kpis: ['Open tickets', 'SLA compliance', 'Average resolution', 'Escalations', 'Resident confirmation', 'Closure evidence'],
    integrations: ['SnapFix', 'ResidentPortal', 'VendorIQ', 'Work orders', 'Notifications'],
    clientValue: 'Brings discipline to service delivery and makes every request visible from intake to close.',
  },
  {
    id: 'facilitycore',
    name: 'FacilityCore',
    tagline: 'Asset and facility management backbone',
    category: 'Operations Backbone',
    icon: Wrench,
    accent: '#C8A020',
    audiences: ['Operations', 'Field Teams', 'Property Management'],
    summary: 'The operational backbone for assets, PPM schedules, work orders, site teams, service areas, and property-level maintenance planning.',
    outcomes: ['Know what assets exist and where they are', 'Plan preventive maintenance by asset and risk', 'Coordinate work orders across teams', 'Reduce reactive maintenance through better cadence'],
    workflows: ['Maintain asset registry', 'Create PPM plans and schedules', 'Assign work orders', 'Review completion and evidence'],
    aiCapabilities: ['Asset risk suggestions', 'PPM schedule recommendations', 'Work order preparation', 'Failure pattern detection'],
    kpis: ['Asset count', 'PPM compliance', 'Work order backlog', 'Open defects', 'Mean time to repair'],
    integrations: ['FieldOps', 'ServiceDesk', 'VendorIQ', 'GIS', 'Data sources'],
    clientValue: 'Creates the operational structure needed to manage properties consistently at scale.',
  },
  {
    id: 'greentrack',
    name: 'GreenTrack',
    tagline: 'Sustainability and ESG tracking',
    category: 'ESG and Utilities',
    icon: Leaf,
    accent: '#38D98A',
    audiences: ['Executive', 'Property Management', 'Compliance'],
    summary: 'A sustainability intelligence module for monitoring utility performance, ESG evidence, initiatives, alerts, and portfolio-wide improvement opportunities.',
    outcomes: ['Track consumption and efficiency by property', 'Identify anomalies and waste', 'Support ESG reporting with evidence', 'Prioritize sustainability investments'],
    workflows: ['Review utility and carbon trends', 'Open anomalies by property or asset', 'Track improvement initiatives', 'Export evidence for reporting'],
    aiCapabilities: ['Consumption anomaly detection', 'Savings opportunity summaries', 'ESG evidence completeness checks', 'Forecasted utility impact'],
    kpis: ['Energy intensity', 'Water usage', 'Carbon trend', 'Savings forecast', 'Evidence completeness'],
    integrations: ['IoT sensors', 'Utility data', 'Assets', 'Evidence repository', 'Executive dashboard'],
    clientValue: 'Helps property teams move from passive utility reporting to active sustainability performance management.',
  },
  {
    id: 'inspectpro',
    name: 'InspectPro',
    tagline: 'Inspection and audit assurance',
    category: 'Compliance and Assurance',
    icon: ClipboardList,
    accent: '#A855F7',
    audiences: ['Compliance', 'Field Teams', 'Property Management'],
    summary: 'A structured inspection and audit module for evidence, control checks, corrective actions, readiness scoring, and inspection history.',
    outcomes: ['Prepare for audits with confidence', 'Link evidence to controls and obligations', 'Track failed checks and remediation', 'Reduce compliance blind spots'],
    workflows: ['Plan inspection cycle', 'Capture findings and evidence', 'Review exceptions and corrective actions', 'Export audit-ready packs'],
    aiCapabilities: ['Readiness score explanations', 'Evidence gap detection', 'Corrective action suggestions', 'Inspection summary generation'],
    kpis: ['Inspection completion', 'Failed controls', 'Evidence gaps', 'Open actions', 'Audit readiness'],
    integrations: ['FieldOps', 'ProjectCommand obligations', 'Evidence repository', 'ServiceDesk'],
    clientValue: 'Makes assurance work practical, traceable, and connected to the operational teams who can fix issues.',
  },
];

const solutions: Solution[] = [
  {
    slug: 'properties',
    name: '4C360 Properties',
    label: 'Property Development & Management',
    headline: 'One operating system for properties, projects, people, and performance.',
    subheadline: 'Connect development, operations, field teams, vendors, residents, evidence, and AI-assisted decisions in one platform.',
    audience: 'Property developers, owners, operators, and community managers',
    accent: '#E11D2E',
    icon: Building2,
    stats: [['12+', 'Connected capability areas'], ['AI-first', 'Guidance inside workflows'], ['360', 'Portfolio to field visibility'], ['1 source', 'Evidence and decisions aligned']],
    modules: propertiesModules,
    organizationValue: [
      ['Leadership', 'Portfolio risk, cost, service, and delivery confidence in one view.'],
      ['Operations', 'Clear workflows for tickets, surveys, vendors, work orders, and evidence.'],
      ['Field teams', 'Mobile-first guidance, QR capture, photo evidence, and fewer manual reports.'],
      ['Residents and owners', 'Simple self-service requests, communication, tracking, and transparency.'],
    ],
    ctas: ['Book a walkthrough', 'Ask the AI advisor', 'Explore modules', 'Discuss this solution'],
  },
  {
    slug: 'fm',
    name: '4C360 FM',
    label: 'Facilities Management',
    headline: 'An AI operating layer for modern facilities management.',
    subheadline: 'Connect CAFM, hard services, soft services, mobile teams, subcontractors, energy, QHSE, evidence, and client reporting in one live command model.',
    audience: 'FM operators, asset owners, service providers, real estate groups, and portfolio managers',
    accent: '#00C6FF',
    icon: Wrench,
    stats: [['CAFM+', 'Connected service backbone'], ['PPM', 'Risk-aware maintenance'], ['SLA', 'Live exposure tracking'], ['AI', 'Workforce and client intelligence']],
    modules: [
      {
        id: 'facilitycore',
        name: 'FacilityCore',
        tagline: 'CAFM, asset, and maintenance backbone',
        category: 'Core FM Platform',
        icon: Wrench,
        accent: '#C8A020',
        audiences: ['Executive', 'Operations', 'Field Teams'],
        summary: 'The operational system of record for properties, sites, assets, locations, PPM schedules, reactive work orders, job history, and completion evidence.',
        outcomes: ['Create a trusted asset and location register', 'Standardize hard-services and soft-services workflows', 'Improve PPM completion and auditability', 'Reduce reactive firefighting through better planning'],
        workflows: ['Register sites, zones, assets, service lines, and responsibilities', 'Build PPM calendars by asset class, statutory need, and risk', 'Assign work orders to internal teams or subcontractors', 'Capture job completion, readings, photos, and sign-off'],
        aiCapabilities: ['PPM risk scoring', 'Asset failure pattern detection', 'Work package preparation', 'Maintenance frequency suggestions'],
        kpis: ['PPM compliance', 'Reactive backlog', 'MTTR', 'Asset risk', 'First-time fix', 'Evidence completion'],
        integrations: ['Asset register', 'FieldOps', 'ServiceDesk', 'VendorIQ', 'IoT/BMS', 'ERP/finance'],
        clientValue: 'Gives FM teams one governed backbone for the full service lifecycle, from asset planning to proof of completion.',
      },
      {
        id: 'servicedesk',
        name: 'ServiceDesk',
        tagline: 'Ticket and SLA command layer',
        category: 'Service Delivery',
        icon: TicketCheck,
        accent: '#00C6FF',
        audiences: ['Executive', 'Operations', 'Property Management'],
        summary: 'A service request command layer for intake, assignment, escalation, resident/client communication, and closure.',
        outcomes: ['Protect SLA commitments', 'Improve dispatch speed', 'Reduce missed follow-ups', 'Close jobs with evidence'],
        workflows: ['Receive request', 'Classify priority', 'Assign technician or vendor', 'Close and confirm'],
        aiCapabilities: ['Priority suggestions', 'SLA risk explanations', 'Assignment recommendations', 'Closure summaries'],
        kpis: ['Open tickets', 'SLA compliance', 'Average resolution', 'Escalations'],
        integrations: ['SnapFix', 'ResidentPortal', 'FieldOps', 'Notifications'],
        clientValue: 'Keeps every service request visible and controlled from intake to close.',
      },
      {
        id: 'snapfix',
        name: 'SnapFix',
        tagline: 'Photo-first issue capture',
        category: 'Defect and Issue Capture',
        icon: Sparkles,
        accent: '#E11D2E',
        audiences: ['Operations', 'Field Teams', 'Property Management'],
        summary: 'A fast capture flow for defects, breakdowns, leaks, safety observations, cleaning issues, and client-reported problems, with AI-assisted classification and routing.',
        outcomes: ['Reduce friction in reporting issues', 'Improve first-time triage accuracy', 'Route defects to the right team faster', 'Capture stronger before-and-after evidence'],
        workflows: ['Take or upload photo', 'AI classifies issue and location context', 'Confirm priority and asset', 'Create ticket or work order'],
        aiCapabilities: ['Image-assisted classification', 'Priority suggestions', 'Duplicate issue detection', 'Structured description drafting'],
        kpis: ['Issues captured', 'Classification accuracy', 'Duplicate rate', 'Time to dispatch', 'Evidence completeness'],
        integrations: ['ServiceDesk', 'FieldOps', 'FacilityCore', 'ResidentPortal', 'Notifications'],
        clientValue: 'Turns informal issue reporting into clean operational data that can be assigned, tracked, and evidenced.',
      },
      {
        id: 'fieldops',
        name: 'FieldOps',
        tagline: 'Mobile workforce and inspection execution',
        category: 'Mobile Operations',
        icon: ClipboardCheck,
        accent: '#E11D2E',
        audiences: ['Executive', 'Operations', 'Field Teams', 'Compliance', 'Property Management'],
        summary: 'A mobile execution layer for technicians, supervisors, inspectors, cleaning teams, security checks, and subcontractors working across large portfolios.',
        outcomes: ['Digitize field checklists and job completion', 'Capture GPS, readings, photos, voice notes, and signatures', 'Standardize inspections across sites and contracts', 'Turn failed checks into follow-up work automatically'],
        workflows: ['Dispatch mobile tasks or inspection surveys', 'Guide the user through job-specific checks', 'Capture required evidence and supervisor sign-off', 'Submit live results to dashboards and client reports'],
        aiCapabilities: ['Checklist generation by asset or service type', 'Copilot guidance for technical checks', 'Evidence requirement suggestions', 'Failed-item issue creation'],
        kpis: ['Mobile submissions', 'Evidence files', 'Failed checks', 'Technician productivity', 'Supervisor review cycle'],
        integrations: ['ServiceDesk', 'FacilityCore', 'Evidence repository', 'Notifications', 'Email/QR links'],
        clientValue: 'Makes field execution visible as it happens, with consistent evidence rather than after-the-fact manual reporting.',
      },
      {
        id: 'commandcentre',
        name: 'CommandCentre',
        tagline: 'Portfolio operations and control-room view',
        category: 'Command and Control',
        icon: BarChart3,
        accent: '#2E7FFF',
        audiences: ['Executive', 'Operations', 'Property Management'],
        summary: 'A live control-room layer for multi-site FM operations, combining service volume, SLA exposure, critical incidents, PPM health, workforce activity, and client commitments.',
        outcomes: ['Prioritize the right sites and jobs first', 'Spot SLA cascades before they damage service confidence', 'Give leaders one version of operational truth', 'Coordinate supervisors, helpdesk, field teams, and vendors'],
        workflows: ['Review portfolio pulse and critical events', 'Drill into sites, service lines, teams, and vendors', 'Open high-risk incidents or overdue work', 'Generate management-ready operational summaries'],
        aiCapabilities: ['Portfolio risk narrative', 'Next-best-action recommendations', 'SLA breach prediction', 'Executive summary drafting'],
        kpis: ['Critical incidents', 'Live sites', 'SLA exposure', 'PPM health', 'Open escalations', 'Workforce activity'],
        integrations: ['ServiceDesk', 'FacilityCore', 'VendorIQ', 'FieldOps', 'IoT/BMS', 'Client reporting'],
        clientValue: 'Moves FM leadership from static reports to a live operating picture that supports daily decisions.',
      },
      {
        id: 'vendoriq',
        name: 'VendorIQ',
        tagline: 'Vendor performance intelligence',
        category: 'Partner Management',
        icon: ShieldCheck,
        accent: '#00B894',
        audiences: ['Executive', 'Operations'],
        summary: 'Vendor scoring across SLA, quality, cost, first-time fix, and evidence compliance.',
        outcomes: ['Identify underperforming vendors', 'Support contract reviews', 'Reduce repeat visits', 'Improve accountability'],
        workflows: ['Review vendor score', 'Open service history', 'Compare cost and quality', 'Trigger action plan'],
        aiCapabilities: ['Performance explanations', 'Repeat failure detection', 'Cost efficiency insights', 'Escalation recommendations'],
        kpis: ['Vendor score', 'SLA', 'First-time fix', 'Evidence compliance'],
        integrations: ['ServiceDesk', 'FieldOps', 'Contracts'],
        clientValue: 'Makes outsourced service quality visible, comparable, and easier to improve.',
      },
      {
        id: 'softservices',
        name: 'SoftServices',
        tagline: 'Cleaning, security, landscaping, and support services',
        category: 'Soft FM',
        icon: Users,
        accent: '#38D98A',
        audiences: ['Operations', 'Field Teams', 'Property Management'],
        summary: 'Operational workflows for soft-services teams, including cleaning audits, security patrols, waste checks, pest control, landscaping rounds, and service quality inspections.',
        outcomes: ['Standardize service quality checks', 'Track site attendance and route completion', 'Capture issues with evidence', 'Make soft-service performance visible to clients'],
        workflows: ['Plan routines by site, zone, route, and shift', 'Capture mobile audit results and photos', 'Flag missed standards or exceptions', 'Review quality score and corrective actions'],
        aiCapabilities: ['Audit checklist generation', 'Service quality trend summaries', 'Missed-route detection', 'Corrective action drafting'],
        kpis: ['Audit score', 'Route completion', 'Missed checks', 'Cleaning defects', 'Security exceptions', 'Client complaints'],
        integrations: ['FieldOps', 'ServiceDesk', 'Client reporting', 'VendorIQ'],
        clientValue: 'Brings the same operational discipline to soft services that asset-heavy FM teams expect for technical maintenance.',
      },
      {
        id: 'energyops',
        name: 'EnergyOps',
        tagline: 'Utilities, BMS, and sustainability performance',
        category: 'Energy and ESG',
        icon: Leaf,
        accent: '#00B894',
        audiences: ['Executive', 'Operations', 'Compliance'],
        summary: 'A utilities and sustainability layer for tracking consumption, anomalies, energy-saving actions, BMS alerts, carbon indicators, and evidence-backed ESG reporting.',
        outcomes: ['Identify abnormal consumption and waste', 'Connect BMS alerts to work orders', 'Track savings initiatives by site', 'Support ESG and client reporting with evidence'],
        workflows: ['Ingest utility, meter, IoT, or BMS signals', 'Review anomalies by site or asset', 'Create corrective work orders', 'Track savings, actions, and evidence'],
        aiCapabilities: ['Consumption anomaly explanations', 'Savings opportunity summaries', 'BMS alert prioritization', 'ESG evidence gap checks'],
        kpis: ['Energy intensity', 'Water usage', 'BMS alarms', 'Savings forecast', 'Carbon trend', 'Action closure'],
        integrations: ['BMS', 'IoT sensors', 'Utility data', 'FacilityCore', 'ServiceDesk', 'Evidence repository'],
        clientValue: 'Connects sustainability ambition to operational action, measurement, and proof.',
      },
      {
        id: 'qhseassurance',
        name: 'QHSE Assurance',
        tagline: 'Safety, compliance, and audit readiness',
        category: 'QHSE and Compliance',
        icon: ShieldCheck,
        accent: '#A855F7',
        audiences: ['Executive', 'Compliance', 'Field Teams'],
        summary: 'A QHSE assurance layer for permits, safety checks, incident evidence, statutory inspections, control testing, audit readiness, and corrective actions.',
        outcomes: ['Reduce compliance blind spots', 'Keep certificates and evidence current', 'Link findings to corrective actions', 'Prepare client and regulator packs faster'],
        workflows: ['Track obligations, certificates, and controls', 'Run safety inspections and audits', 'Capture findings, evidence, and sign-off', 'Monitor corrective action closure'],
        aiCapabilities: ['Readiness score explanations', 'Evidence gap detection', 'Safety finding summaries', 'Corrective action recommendations'],
        kpis: ['Audit readiness', 'Expired evidence', 'Open actions', 'Safety findings', 'Inspection completion', 'Control failures'],
        integrations: ['FieldOps', 'Evidence repository', 'ServiceDesk', 'Obligations register'],
        clientValue: 'Makes compliance and QHSE visible, evidenced, and connected to the teams responsible for action.',
      },
      {
        id: 'evidencevault',
        name: 'EvidenceVault',
        tagline: 'Proof of service and audit evidence',
        category: 'Evidence and Assurance',
        icon: ClipboardList,
        accent: '#7C3AED',
        audiences: ['Executive', 'Operations', 'Compliance', 'Property Management'],
        summary: 'A searchable evidence layer for job photos, readings, signatures, statutory certificates, inspection results, client reports, and corrective action proof.',
        outcomes: ['Reduce evidence hunting', 'Make service claims defensible', 'Support audits and client reviews', 'Connect proof to assets, tickets, and contracts'],
        workflows: ['Capture evidence during the job', 'Link proof to asset, ticket, or obligation', 'Review completeness', 'Prepare client or audit pack'],
        aiCapabilities: ['Evidence classification', 'Missing proof detection', 'Service summary drafting', 'Audit-pack readiness checks'],
        kpis: ['Evidence completeness', 'Jobs with proof', 'Expired documents', 'Audit pack readiness'],
        integrations: ['FieldOps', 'ServiceDesk', 'QHSE Assurance', 'ClientPortal'],
        clientValue: 'Makes FM performance provable, not just reported.',
      },
      {
        id: 'clientportal',
        name: 'ClientPortal',
        tagline: 'Client reporting and service transparency',
        category: 'Client Experience',
        icon: Building2,
        accent: '#FFB020',
        audiences: ['Executive', 'Property Management', 'Operations'],
        summary: 'A client-facing reporting layer for service health, SLA performance, planned works, evidence, escalations, sustainability metrics, and management summaries.',
        outcomes: ['Improve transparency and trust', 'Reduce manual monthly report production', 'Show evidence behind service claims', 'Support governance meetings with live facts'],
        workflows: ['Select client, contract, site, or portfolio view', 'Review SLA, PPM, incident, and evidence status', 'Generate management summaries', 'Share action plans and performance packs'],
        aiCapabilities: ['Client summary drafting', 'Service-risk explanations', 'Meeting note preparation', 'Performance narrative generation'],
        kpis: ['SLA compliance', 'PPM completion', 'Open escalations', 'Evidence completeness', 'Client satisfaction', 'Savings actions'],
        integrations: ['CommandCentre', 'ServiceDesk', 'FacilityCore', 'VendorIQ', 'EnergyOps', 'Evidence repository'],
        clientValue: 'Turns client reporting from a manual monthly exercise into a transparent, always-ready service conversation.',
      },
    ],
    organizationValue: [
      ['FM leadership', 'Portfolio performance, cost exposure, SLA risk, QHSE readiness, and vendor quality in one place.'],
      ['Helpdesk and supervisors', 'Clearer intake, triage, dispatch, escalation, and shift-level control across hard and soft FM.'],
      ['Technicians and field teams', 'Mobile jobs, guided checklists, photo evidence, readings, QR links, and AI support at the point of work.'],
      ['Clients and asset owners', 'Transparent reporting backed by live status, proof of service, sustainability actions, and measurable outcomes.'],
    ],
    ctas: ['Book a walkthrough', 'Ask the AI advisor', 'Explore FM workflows', 'Discuss rollout'],
  },
  {
    slug: 'retail-compliance',
    name: '4C360 Retail Compliance',
    label: 'Retail Governance, Risk & Compliance',
    headline: 'Compliance intelligence for retail networks, stores, vendors, and operating evidence.',
    subheadline: 'Connect obligations, controls, policies, FieldOps store checks, audits, incidents, third parties, evidence, and management reporting into one AI-assisted compliance operating model.',
    audience: 'Retail groups, franchise operators, compliance teams, store operations, internal audit, risk leaders, and executive management',
    accent: '#22D3EE',
    icon: Building2,
    stats: [['Stores', 'FieldOps execution'], ['Obligations', 'Tracked to evidence'], ['AI', 'Risk and gap guidance'], ['Audit', 'Ready packs']],
    modules: [
      {
        id: 'retailcommand',
        name: 'RetailCompliance Command',
        tagline: 'Compliance control room for retail networks',
        category: 'Command Centre',
        icon: BarChart3,
        accent: '#22D3EE',
        audiences: ['Executive', 'Compliance', 'Retail'],
        summary: 'A live command view for obligations, store compliance, open issues, overdue actions, audit readiness, policy attestations, and third-party exposure.',
        outcomes: ['See compliance exposure across stores and regions', 'Prioritize overdue actions and high-risk sites', 'Give leadership a single compliance picture', 'Reduce fragmented spreadsheet reporting'],
        workflows: ['Review compliance pulse', 'Drill into region or store risk', 'Open overdue action or control gap', 'Generate management summary'],
        aiCapabilities: ['Executive compliance summaries', 'Risk trend explanations', 'Hotspot detection', 'Recommended next actions'],
        kpis: ['Compliance score', 'Overdue actions', 'High-risk stores', 'Control effectiveness', 'Audit readiness'],
        integrations: ['FieldOps', 'Obligations register', 'Evidence repository', 'Audit workflows', 'Notifications'],
        clientValue: 'Turns retail compliance from periodic reporting into a live management system.',
      },
      {
        id: 'obligationsregister',
        name: 'Obligations Register',
        tagline: 'Regulatory and contractual commitments',
        category: 'Obligations',
        icon: ClipboardList,
        accent: '#A855F7',
        audiences: ['Compliance', 'Executive', 'Retail'],
        summary: 'Track regulatory, licensing, lease, brand, operating, privacy, safety, and supplier obligations across retail portfolios.',
        outcomes: ['Know what is due and who owns it', 'Reduce missed reviews and renewals', 'Link each obligation to evidence', 'Prepare for inspections faster'],
        workflows: ['Create obligation', 'Assign owner and review cycle', 'Attach required evidence', 'Monitor status and escalation'],
        aiCapabilities: ['Obligation summaries', 'Renewal risk prompts', 'Evidence requirement suggestions', 'Compliance impact explanations'],
        kpis: ['Open obligations', 'Overdue reviews', 'Upcoming renewals', 'Evidence coverage'],
        integrations: ['FieldOps', 'Evidence repository', 'Notifications', 'Store checks'],
        clientValue: 'Keeps commitments visible, owned, and backed by proof.',
      },
      {
        id: 'controlslibrary',
        name: 'Controls Library',
        tagline: 'Standard controls across stores and functions',
        category: 'Controls',
        icon: ShieldCheck,
        accent: '#2E7FFF',
        audiences: ['Compliance', 'Operations', 'Retail'],
        summary: 'A reusable control library for store operations, cash handling, privacy, safety, stock, vendor governance, approvals, and customer-facing processes.',
        outcomes: ['Standardize control expectations', 'Map controls to obligations and risks', 'Identify weak or failed controls', 'Support repeatable assurance'],
        workflows: ['Define control', 'Map to obligation and owner', 'Schedule FieldOps testing', 'Record exceptions and actions'],
        aiCapabilities: ['Control wording improvement', 'Control gap detection', 'Testing suggestions', 'Exception summaries'],
        kpis: ['Controls active', 'Controls tested', 'Failed controls', 'Control maturity'],
        integrations: ['FieldOps', 'Audit & Assurance', 'Risk Register', 'Evidence repository'],
        clientValue: 'Makes compliance expectations operational and measurable across every store and team.',
      },
      {
        id: 'storeassurance',
        name: 'Store Assurance',
        tagline: 'Branch and store compliance checks',
        category: 'Store Operations',
        icon: ClipboardCheck,
        accent: '#E11D2E',
        audiences: ['Retail', 'Field Teams', 'Compliance'],
        summary: 'FieldOps-powered store audits and checks for merchandising, safety, customer notices, cash controls, hygiene, asset condition, documentation, and operational standards.',
        outcomes: ['Run consistent store checks', 'Capture photo evidence', 'Find repeat non-compliance', 'Turn failed checks into actions', 'Compare store readiness by region'],
        workflows: ['Select FieldOps checklist', 'Capture pass/fail checks and photos', 'Flag failed controls', 'Submit live result for review and action'],
        aiCapabilities: ['Checklist generation', 'Photo evidence prompts', 'Failed-item classification', 'Store risk summary', 'Regional trend explanation'],
        kpis: ['Checks completed', 'Failed items', 'Evidence completeness', 'Repeat findings', 'Store readiness score'],
        integrations: ['FieldOps', 'ServiceDesk', 'Evidence repository'],
        clientValue: 'Connects field assurance to live compliance dashboards instead of static audit forms.',
      },
      {
        id: 'fieldops',
        name: 'FieldOps',
        tagline: 'Retail field compliance execution engine',
        category: 'Mobile Execution',
        icon: ClipboardCheck,
        accent: '#E11D2E',
        audiences: ['Executive', 'Retail', 'Field Teams', 'Compliance', 'Operations'],
        summary: 'The mobile execution engine for retail compliance: store visits, remote self-certifications, franchise checks, mystery/shop-floor audits, loss-prevention walks, food/safety checks, vendor visits, QR submissions, and evidence capture.',
        outcomes: ['Digitize store visits and control checks', 'Capture photo, GPS, signature, QR, and reading evidence', 'Distribute surveys by QR, email, link, role, store, or region', 'Feed live submissions into compliance dashboards', 'Create issues automatically from failed answers'],
        workflows: ['AI generates checklist by process, risk, or store type', 'Assign to store, region, vendor, role, or public QR', 'Capture answers, evidence, comments, and sign-off', 'Trigger remediation, incident, or evidence review'],
        aiCapabilities: ['Checklist generation by store process', 'Copilot guidance for field auditors', 'Evidence requirement suggestions', 'Failed-item action drafting', 'Live submission summaries', 'Repeat non-compliance detection'],
        kpis: ['Mobile submissions', 'Stores checked', 'Failed checks', 'Evidence files', 'Review cycle', 'Auto-created issues'],
        integrations: ['Store Assurance', 'Controls Library', 'Evidence Repository', 'Issues & Remediation', 'Policy & Attestation', 'Notifications'],
        clientValue: 'Makes retail compliance executable at store level, not just documented at head office.',
      },
      {
        id: 'fieldcampaigns',
        name: 'Field Campaigns',
        tagline: 'Targeted compliance campaigns by store, region, or risk',
        category: 'Mobile Execution',
        icon: Network,
        accent: '#38D98A',
        audiences: ['Executive', 'Retail', 'Compliance', 'Operations', 'Field Teams'],
        summary: 'Launch rapid FieldOps campaigns for seasonal checks, product recalls, safety notices, branch readiness, promotion compliance, licence evidence, and urgent control confirmations.',
        outcomes: ['Reach every store quickly', 'Track live completion by region', 'Escalate non-response', 'Collect comparable evidence at scale'],
        workflows: ['Choose campaign objective', 'Select stores, roles, or vendors', 'Send checklist by app, QR, or email', 'Monitor live submissions and exceptions'],
        aiCapabilities: ['Campaign checklist drafting', 'Store targeting suggestions', 'Non-response escalation summaries', 'Executive completion narrative'],
        kpis: ['Campaign completion', 'Stores pending', 'Exceptions found', 'Evidence submitted', 'Escalations open'],
        integrations: ['FieldOps', 'Notifications', 'Evidence Repository', 'RetailCompliance Command'],
        clientValue: 'Lets retail compliance teams move from slow audit cycles to rapid, network-wide assurance.',
      },
      {
        id: 'policyattestation',
        name: 'Policy & Attestation',
        tagline: 'Policies, acknowledgements, and training proof',
        category: 'Policies',
        icon: TicketCheck,
        accent: '#FFB020',
        audiences: ['Compliance', 'Operations', 'Retail'],
        summary: 'Manage policy distribution, staff acknowledgements, training attestations, version control, exceptions, and campaign completion across stores and offices.',
        outcomes: ['Improve policy reach', 'Track acknowledgement gaps', 'Support conduct and training evidence', 'Reduce manual chasing'],
        workflows: ['Publish policy or campaign', 'Assign audience', 'Track acknowledgement', 'Escalate missing attestations'],
        aiCapabilities: ['Policy summaries', 'Audience targeting suggestions', 'Attestation gap summaries', 'Reminder drafting'],
        kpis: ['Attestation completion', 'Policies current', 'Overdue acknowledgements', 'Training proof'],
        integrations: ['Identity directory', 'Notifications', 'Evidence repository'],
        clientValue: 'Proves that important policies reached the right people and were acknowledged on time.',
      },
      {
        id: 'issuesremediation',
        name: 'Issues & Remediation',
        tagline: 'Findings, breaches, and corrective actions',
        category: 'Issue Management',
        icon: Radar,
        accent: '#F97316',
        audiences: ['Compliance', 'Operations', 'Executive'],
        summary: 'A structured workflow for compliance breaches, audit findings, customer-impacting issues, failed controls, remediation plans, and closure evidence.',
        outcomes: ['Improve issue ownership', 'Reduce overdue remediation', 'Track repeat breaches', 'Escalate material risks'],
        workflows: ['Log finding or breach', 'Assess severity', 'Assign remediation owner', 'Close with evidence and review'],
        aiCapabilities: ['Severity suggestions', 'Root-cause prompts', 'Remediation drafting', 'Repeat issue detection'],
        kpis: ['Open issues', 'Material breaches', 'Actions overdue', 'Repeat findings'],
        integrations: ['Controls Library', 'Store Assurance', 'Notifications'],
        clientValue: 'Turns compliance findings into accountable action and management visibility.',
      },
      {
        id: 'auditassurance',
        name: 'Audit & Assurance',
        tagline: 'Audit plans, testing, and readiness packs',
        category: 'Assurance',
        icon: CheckCircle2,
        accent: '#00D084',
        audiences: ['Compliance', 'Executive', 'Retail'],
        summary: 'Plan audits, test controls, collect evidence, review findings, track recommendations, and prepare audit-ready packs by store, region, process, or obligation.',
        outcomes: ['Prepare audits faster', 'Reduce evidence gaps', 'Track assurance coverage', 'Improve finding closure'],
        workflows: ['Create audit plan', 'Select controls and stores', 'Capture testing evidence', 'Issue findings and actions'],
        aiCapabilities: ['Audit scope suggestions', 'Evidence gap detection', 'Finding summaries', 'Readiness score explanations'],
        kpis: ['Audit readiness', 'Tests completed', 'Evidence gaps', 'Findings closed'],
        integrations: ['Controls Library', 'Evidence repository', 'Issues & Remediation'],
        clientValue: 'Makes assurance work faster, more repeatable, and easier to defend.',
      },
      {
        id: 'thirdpartyrisk',
        name: 'Third-Party Risk',
        tagline: 'Supplier and partner compliance',
        category: 'Third-Party Governance',
        icon: Users,
        accent: '#38D98A',
        audiences: ['Compliance', 'Operations', 'Executive'],
        summary: 'Track supplier onboarding, due diligence, documents, contract obligations, service risk, insurance, certifications, and remediation actions.',
        outcomes: ['Reduce supplier compliance exposure', 'Track missing documents', 'Improve partner governance', 'Support procurement decisions'],
        workflows: ['Onboard supplier', 'Collect due diligence evidence', 'Monitor expiry and risk', 'Assign remediation'],
        aiCapabilities: ['Supplier risk summaries', 'Missing document prompts', 'Due diligence review notes', 'Renewal risk alerts'],
        kpis: ['Suppliers current', 'Expired documents', 'High-risk partners', 'Remediation overdue'],
        integrations: ['VendorIQ', 'Evidence repository', 'Contract records'],
        clientValue: 'Gives retail groups stronger visibility over the third parties that support stores and customer operations.',
      },
      {
        id: 'evidencerepository',
        name: 'Evidence Repository',
        tagline: 'Compliance proof in one searchable layer',
        category: 'Evidence',
        icon: ClipboardList,
        accent: '#22D3EE',
        audiences: ['Compliance', 'Retail', 'Executive'],
        summary: 'A searchable evidence layer for certificates, store photos, policies, attestations, audit files, control tests, issue closure proof, and supplier documents.',
        outcomes: ['Reduce evidence hunting', 'Prepare inspection packs quickly', 'Connect proof to controls and obligations', 'Protect compliance memory'],
        workflows: ['Capture evidence at source', 'Link to obligation, control, or issue', 'Review completeness', 'Generate readiness pack'],
        aiCapabilities: ['Document classification', 'Missing proof detection', 'Evidence summaries', 'Readiness pack drafting'],
        kpis: ['Evidence completeness', 'Expired evidence', 'Linked obligations', 'Audit pack readiness'],
        integrations: ['Store Assurance', 'Audit & Assurance', 'Obligations Register'],
        clientValue: 'Turns compliance records into usable proof for management, audit, and regulator conversations.',
      },
      {
        id: 'reportinginsights',
        name: 'Compliance Reporting',
        tagline: 'Board, management, and regulator-ready narratives',
        category: 'Reporting',
        icon: Network,
        accent: '#C8A020',
        audiences: ['Executive', 'Compliance', 'Retail'],
        summary: 'Produce compliance dashboards, management summaries, risk heatmaps, audit packs, store scorecards, and action plans from live data.',
        outcomes: ['Improve management reporting', 'Tell a clearer risk story', 'Reduce manual reporting effort', 'Support governance meetings'],
        workflows: ['Select reporting view', 'Review key risks and actions', 'Generate AI narrative', 'Share management summary'],
        aiCapabilities: ['Board summary drafting', 'Risk narrative generation', 'Trend explanations', 'Action plan recommendations'],
        kpis: ['Compliance score', 'Risk trend', 'Action closure', 'Governance pack readiness'],
        integrations: ['Command Centre', 'Controls Library', 'Evidence repository'],
        clientValue: 'Turns compliance data into clear conversations and decisions.',
      },
    ],
    organizationValue: [
      ['Compliance leaders', 'Live visibility over obligations, controls, issues, evidence, and assurance readiness.'],
      ['Store operations', 'Clear checklists, actions, and evidence expectations across every store or branch.'],
      ['Internal audit', 'Reusable controls, test evidence, findings, and audit packs in one place.'],
      ['Risk and executives', 'Management-ready compliance narratives, exposure trends, and action status.'],
      ['Third-party owners', 'Supplier documents, due diligence, obligations, and remediation kept current.'],
    ],
    ctas: ['Book a walkthrough', 'Ask the AI advisor', 'Explore retail compliance workflows', 'Discuss this solution'],
  },
  {
    slug: 'marine',
    name: '4C360 Marine',
    label: 'Marine Operations & Compliance',
    headline: 'A connected command layer for marine assets, port operations, safety, and compliance.',
    subheadline: 'Unify fleet readiness, berth and marina operations, inspections, service work, permits, environmental evidence, contractors, and audit readiness in one AI-assisted marine operating model.',
    audience: 'Marine operators, ports, marinas, vessel service teams, facility owners, and compliance leaders',
    accent: '#38BDF8',
    icon: Anchor,
    stats: [['Fleet', 'Readiness visibility'], ['Port', 'Live operations'], ['Safety', 'Inspection evidence'], ['AI', 'Risk and compliance guidance']],
    modules: [
      {
        id: 'marinecommand',
        name: 'MarineCommand',
        tagline: 'Fleet, marina, and port command centre',
        category: 'Command Centre',
        icon: Anchor,
        accent: '#38BDF8',
        audiences: ['Marine', 'Operations', 'Executive'],
        summary: 'A live command view for fleet readiness, marina activity, port-side tasks, open incidents, service status, risk, and compliance exposure.',
        outcomes: ['Improve marine asset readiness', 'See operational risk in one place', 'Prioritize critical service work', 'Give leadership a reliable marine view'],
        workflows: ['Review fleet and facility status', 'Open high-risk asset or site', 'Assign urgent service actions', 'Prepare operating summary'],
        aiCapabilities: ['Readiness briefings', 'Operational risk summaries', 'Priority recommendations', 'Leadership narrative drafting'],
        kpis: ['Fleet readiness', 'Open critical tasks', 'Service backlog', 'Inspection compliance', 'Compliance exposure'],
        integrations: ['MarineInspect', 'ServiceDesk', 'Evidence repository', 'Notifications'],
        clientValue: 'Gives marine leadership one operating picture across assets, facilities, people, risk, and evidence.',
      },
      {
        id: 'fleetregistry',
        name: 'FleetRegistry',
        tagline: 'Vessels, berths, docks, and marine assets',
        category: 'Asset Management',
        icon: Waves,
        accent: '#00C6FF',
        audiences: ['Marine', 'Operations', 'Compliance'],
        summary: 'A structured register for vessels, pontoons, docks, berths, navigation aids, safety equipment, pumps, shore power, and critical marine infrastructure.',
        outcomes: ['Create a trusted marine asset record', 'Track condition and readiness', 'Link assets to inspections and evidence', 'Reduce fragmented spreadsheets'],
        workflows: ['Register marine asset', 'Attach documents and certificates', 'Schedule inspection or service', 'Review lifecycle and readiness'],
        aiCapabilities: ['Asset profile summaries', 'Missing data prompts', 'Inspection frequency suggestions', 'Condition risk explanations'],
        kpis: ['Assets registered', 'Readiness score', 'Certificates linked', 'Inspection coverage'],
        integrations: ['FieldOps', 'Evidence repository', 'MarineCompliance'],
        clientValue: 'Turns marine assets into manageable, inspectable, and evidence-backed operating objects.',
      },
      {
        id: 'marinaservice',
        name: 'MarinaServiceDesk',
        tagline: 'Marine service requests and dispatch',
        category: 'Service Operations',
        icon: TicketCheck,
        accent: '#2E7FFF',
        audiences: ['Marine', 'Operations', 'Field Teams'],
        summary: 'A service workflow for berth issues, shore power faults, water supply, dock defects, cleaning, waste, vessel support, and resident or operator requests.',
        outcomes: ['Capture requests consistently', 'Improve dispatch and response times', 'Connect issues to assets and zones', 'Reduce service blind spots'],
        workflows: ['Receive request or issue', 'Classify by asset and location', 'Dispatch team or vendor', 'Close with evidence'],
        aiCapabilities: ['Issue classification', 'Priority suggestions', 'Dispatch recommendations', 'Client update drafting'],
        kpis: ['Open requests', 'SLA compliance', 'First-time fix', 'Repeat issues'],
        integrations: ['ServiceDesk', 'Notifications', 'VendorIQ', 'Evidence repository'],
        clientValue: 'Brings service discipline to marina and port operations without losing marine-specific context.',
      },
      {
        id: 'marineinspect',
        name: 'MarineInspect',
        tagline: 'Mobile inspections and condition checks',
        category: 'Inspections',
        icon: ClipboardCheck,
        accent: '#00C6FF',
        audiences: ['Marine', 'Field Teams', 'Compliance'],
        summary: 'Mobile inspection templates for vessels, berths, pontoons, docks, navigation equipment, lifesaving equipment, utilities, and environmental checks.',
        outcomes: ['Capture inspection evidence consistently', 'Reduce manual forms', 'Flag failed items quickly', 'Support audit readiness'],
        workflows: ['Select marine template', 'Capture checklist and photos', 'Record readings and defects', 'Submit for review'],
        aiCapabilities: ['Inspection prompt generation', 'Photo evidence guidance', 'Defect classification', 'Risk summary'],
        kpis: ['Inspections completed', 'Defects found', 'Evidence completeness', 'Failed safety checks'],
        integrations: ['FieldOps', 'ServiceDesk', 'Evidence repository'],
        clientValue: 'Moves marine inspection work from paper and email into traceable, operationally useful data.',
      },
      {
        id: 'fieldops',
        name: 'FieldOps',
        tagline: 'Mobile marine work execution',
        category: 'Mobile Execution',
        icon: ClipboardCheck,
        accent: '#E11D2E',
        audiences: ['Marine', 'Field Teams', 'Operations', 'Compliance'],
        summary: 'A mobile execution layer for dock walks, vessel checks, marina rounds, environmental readings, contractor tasks, and QR-based field submissions.',
        outcomes: ['Standardize mobile marine fieldwork', 'Capture evidence at the point of work', 'Distribute surveys by link or QR', 'Turn failed checks into service actions'],
        workflows: ['Select marine checklist', 'Capture readings, photos, GPS, and notes', 'Submit live field result', 'Route exceptions to service or compliance'],
        aiCapabilities: ['Marine checklist generation', 'Technical check guidance', 'Evidence requirement prompts', 'Exception summaries'],
        kpis: ['Mobile submissions', 'Rounds completed', 'Failed checks', 'Evidence files', 'Exceptions routed'],
        integrations: ['MarineInspect', 'MarineServiceDesk', 'MarineEvidence', 'Notifications'],
        clientValue: 'Connects marine field activity directly to operations, compliance, and proof.',
      },
      {
        id: 'marinesafety',
        name: 'MarineSafety',
        tagline: 'Safety checks, incidents, and corrective actions',
        category: 'Safety',
        icon: ShieldCheck,
        accent: '#E11D2E',
        audiences: ['Marine', 'HSE', 'Operations'],
        summary: 'Safety workflows for incidents, near misses, lifesaving equipment checks, emergency readiness, unsafe conditions, and corrective action follow-up.',
        outcomes: ['Improve safety visibility', 'Close corrective actions faster', 'Track emergency readiness', 'Reduce repeat unsafe conditions'],
        workflows: ['Log safety event', 'Classify severity', 'Assign investigation or action', 'Close with evidence'],
        aiCapabilities: ['Severity suggestions', 'Root-cause prompts', 'Corrective action drafting', 'Safety hotspot summaries'],
        kpis: ['Open incidents', 'Near misses', 'Actions overdue', 'Emergency readiness'],
        integrations: ['OSH', 'FieldOps', 'Evidence repository'],
        clientValue: 'Connects marine safety activity to accountable actions and proof.',
      },
      {
        id: 'berthops',
        name: 'BerthOps',
        tagline: 'Berth, dock, and marina operations',
        category: 'Port & Marina Operations',
        icon: DoorOpen,
        accent: '#FFB020',
        audiences: ['Marine', 'Operations', 'Field Teams'],
        summary: 'Operational control for berth readiness, dock walks, occupancy checks, utility availability, visitor movements, and service quality rounds.',
        outcomes: ['Improve berth readiness', 'Track recurring dock defects', 'Coordinate daily marina rounds', 'Make service quality visible'],
        workflows: ['Review berth or zone plan', 'Run daily readiness checks', 'Capture defects and evidence', 'Assign operational follow-up'],
        aiCapabilities: ['Readiness summaries', 'Recurring defect detection', 'Route and checklist suggestions', 'Shift handover drafting'],
        kpis: ['Berths ready', 'Dock defects', 'Utility issues', 'Rounds completed'],
        integrations: ['FieldOps', 'ServiceDesk', 'ClientPortal'],
        clientValue: 'Helps marina and port teams run daily operations with the same discipline as critical asset management.',
      },
      {
        id: 'marinecompliance',
        name: 'MarineCompliance',
        tagline: 'Certificates, permits, and obligations',
        category: 'Compliance',
        icon: ShieldCheck,
        accent: '#A855F7',
        audiences: ['Marine', 'Compliance', 'Executive'],
        summary: 'Compliance tracking for certificates, permits, statutory inspections, environmental records, corrective actions, and readiness packs.',
        outcomes: ['Track expiring certificates', 'Link evidence to obligations', 'Prepare for audits faster', 'Reduce compliance exposure'],
        workflows: ['Monitor permit register', 'Attach evidence', 'Review gaps', 'Export readiness summary'],
        aiCapabilities: ['Expiry risk summaries', 'Evidence gap detection', 'Corrective action suggestions', 'Audit readiness explanations'],
        kpis: ['Current certificates', 'Expired evidence', 'Open obligations', 'Readiness score'],
        integrations: ['Evidence repository', 'Obligations register', 'FieldOps'],
        clientValue: 'Keeps marine compliance visible, current, and tied to operational action.',
      },
      {
        id: 'environmentalwatch',
        name: 'EnvironmentalWatch',
        tagline: 'Environmental checks and sustainability evidence',
        category: 'Environmental Compliance',
        icon: Leaf,
        accent: '#00D084',
        audiences: ['Marine', 'Compliance', 'Executive'],
        summary: 'Track waste, spills, water quality checks, fuel handling, emissions indicators, environmental incidents, and sustainability evidence.',
        outcomes: ['Reduce environmental blind spots', 'Capture spill and waste evidence', 'Support sustainability reporting', 'Escalate environmental incidents quickly'],
        workflows: ['Run environmental checklist', 'Capture reading or incident', 'Attach photos and location', 'Create corrective action'],
        aiCapabilities: ['Environmental risk summaries', 'Abnormal reading explanations', 'Evidence requirement prompts', 'Sustainability narrative drafting'],
        kpis: ['Environmental checks', 'Open spill actions', 'Waste exceptions', 'Evidence coverage'],
        integrations: ['FieldOps', 'Evidence repository', 'Compliance register'],
        clientValue: 'Makes environmental responsibility operational, measurable, and evidence-backed.',
      },
      {
        id: 'marinevendor',
        name: 'MarineVendorIQ',
        tagline: 'Contractor and specialist service performance',
        category: 'Vendor Performance',
        icon: Users,
        accent: '#38D98A',
        audiences: ['Marine', 'Operations', 'Executive'],
        summary: 'Performance visibility for diving contractors, marine engineers, cleaning crews, equipment suppliers, inspection partners, and specialist maintenance teams.',
        outcomes: ['Compare vendor performance', 'Track SLA and evidence quality', 'Reduce repeat contractor issues', 'Support procurement decisions'],
        workflows: ['Assign service or inspection', 'Capture completion evidence', 'Review SLA and quality', 'Flag repeat issues'],
        aiCapabilities: ['Vendor performance summaries', 'Repeat issue detection', 'SLA risk explanations', 'Corrective action suggestions'],
        kpis: ['Vendor SLA', 'Evidence compliance', 'Repeat issues', 'Cost per job'],
        integrations: ['VendorIQ', 'ServiceDesk', 'Evidence repository'],
        clientValue: 'Gives marine operators clearer control over specialist suppliers and service quality.',
      },
      {
        id: 'marineevidence',
        name: 'MarineEvidence',
        tagline: 'Operational proof and audit packs',
        category: 'Evidence & Assurance',
        icon: ClipboardList,
        accent: '#00C6FF',
        audiences: ['Marine', 'Compliance', 'Executive'],
        summary: 'A searchable evidence repository for inspection photos, certificates, permits, service reports, environmental records, incidents, and close-out proof.',
        outcomes: ['Find evidence quickly', 'Prepare regulator or client packs', 'Connect proof to assets and obligations', 'Protect operational memory'],
        workflows: ['Capture evidence at source', 'Link to asset or obligation', 'Review completeness', 'Generate readiness pack'],
        aiCapabilities: ['Evidence classification', 'Missing proof detection', 'Readiness pack summaries', 'Document risk explanations'],
        kpis: ['Evidence completeness', 'Expired documents', 'Linked assets', 'Audit pack readiness'],
        integrations: ['MarineInspect', 'MarineCompliance', 'FieldOps'],
        clientValue: 'Turns marine records into a reliable evidence layer for compliance, assurance, and client confidence.',
      },
    ],
    organizationValue: [
      ['Marine leadership', 'Fleet, marina, service, risk, and compliance readiness shown in one executive view.'],
      ['Operations teams', 'Daily berth, dock, vessel, and port-side tasks connected to action and evidence.'],
      ['Field teams', 'Guided mobile inspections, service capture, photos, readings, and close-out proof.'],
      ['Compliance teams', 'Certificates, permits, statutory checks, environmental records, and obligations connected to proof.'],
      ['Clients and asset owners', 'Greater transparency on readiness, service quality, safety, and compliance confidence.'],
    ],
    ctas: ['Book a walkthrough', 'Ask the AI advisor', 'Explore marine workflows', 'Discuss this solution'],
  },
  {
    slug: 'osh',
    name: '4C360 OSH',
    label: 'Occupational Safety & Health',
    headline: 'One OSH command layer for safer work, stronger assurance, and faster action.',
    subheadline: 'Connect inspections, observations, permits, incidents, risk assessments, training, corrective actions, and audit evidence in one AI-assisted safety operating model.',
    audience: 'HSE leaders, safety officers, contractors, compliance teams, and operations managers',
    accent: '#FF9B38',
    icon: Flame,
    stats: [['360', 'Safety operating model'], ['Live', 'Incidents and actions'], ['AI', 'Risk and control guidance'], ['Audit', 'Evidence-ready assurance']],
    modules: [
      {
        id: 'safetycommand',
        name: 'SafetyCommand',
        tagline: 'OSH executive command centre',
        category: 'Command Centre',
        icon: BarChart3,
        accent: '#FF9B38',
        audiences: ['Executive', 'HSE', 'Operations'],
        summary: 'A live safety command view for incident trends, high-risk sites, overdue actions, inspections, controls, and assurance readiness.',
        outcomes: ['See safety exposure across the portfolio', 'Prioritize high-risk sites and teams', 'Track corrective action closure', 'Give leadership a clear OSH view'],
        workflows: ['Review portfolio risk', 'Open high-risk site detail', 'Drill into incidents and actions', 'Prepare leadership summary'],
        aiCapabilities: ['Executive safety briefings', 'Risk trend explanations', 'Hotspot detection', 'Next-best-action suggestions'],
        kpis: ['TRIR/LTIR trend', 'Open high-risk actions', 'Inspection completion', 'Safety readiness score'],
        integrations: ['FieldOps', 'IncidentOS', 'Evidence repository', 'Notifications'],
        clientValue: 'Gives leadership a single, credible view of safety performance and what needs attention now.',
      },
      {
        id: 'safetywalk',
        name: 'SafetyWalk',
        tagline: 'Mobile safety inspections',
        category: 'Safety Fieldwork',
        icon: ClipboardCheck,
        accent: '#FF9B38',
        audiences: ['HSE', 'Field Teams', 'Compliance'],
        summary: 'Guided safety inspections and walkthroughs with photos, GPS, mandatory checks, and corrective action triggers.',
        outcomes: ['Standardize safety checks', 'Capture better evidence', 'Escalate failed safety items', 'Track corrective actions'],
        workflows: ['Pick safety template', 'Capture pass/fail checks', 'Add evidence and notes', 'Create corrective action'],
        aiCapabilities: ['Safety checklist generation', 'Risk wording suggestions', 'Evidence requirement prompts', 'Corrective action drafting'],
        kpis: ['Inspections completed', 'Failed checks', 'Corrective actions', 'Evidence completeness'],
        integrations: ['FieldOps', 'ServiceDesk', 'Evidence repository'],
        clientValue: 'Makes safety fieldwork easier to execute and stronger as compliance evidence.',
      },
      {
        id: 'fieldops',
        name: 'FieldOps',
        tagline: 'Mobile HSE inspections and survey execution',
        category: 'Mobile Execution',
        icon: ClipboardCheck,
        accent: '#E11D2E',
        audiences: ['HSE', 'Field Teams', 'Operations', 'Contractors'],
        summary: 'A mobile layer for toolbox checks, site walks, permit confirmations, contractor inspections, incident evidence, and QR-based safety surveys.',
        outcomes: ['Capture HSE evidence at source', 'Guide inspectors through technical checks', 'Distribute safety surveys quickly', 'Feed live submissions into assurance views'],
        workflows: ['Generate or choose HSE checklist', 'Assign to site, contractor, or role', 'Capture answers, photos, GPS, and signatures', 'Escalate failed safety items'],
        aiCapabilities: ['HSE checklist generation', 'Inspector copilot guidance', 'Evidence prompts', 'Failed-item action drafting'],
        kpis: ['Mobile HSE submissions', 'Failed safety checks', 'Evidence completeness', 'Supervisor review cycle'],
        integrations: ['SafetyWalk', 'IncidentOS', 'Permit to Work', 'Evidence Repository'],
        clientValue: 'Makes safety data live, structured, and immediately actionable for HSE teams.',
      },
      {
        id: 'incidentos',
        name: 'IncidentOS',
        tagline: 'Safety incident and observation management',
        category: 'Incident Management',
        icon: Radar,
        accent: '#E11D2E',
        audiences: ['HSE', 'Operations', 'Executive'],
        summary: 'A structured workflow for observations, near misses, incidents, investigations, actions, and closure evidence.',
        outcomes: ['Improve incident visibility', 'Track actions to closure', 'Reduce repeat risk', 'Support executive safety reporting'],
        workflows: ['Log observation or incident', 'Classify severity', 'Assign investigation/action', 'Close with evidence'],
        aiCapabilities: ['Severity suggestions', 'Root-cause prompts', 'Action recommendations', 'Executive summaries'],
        kpis: ['Open incidents', 'Near misses', 'Actions overdue', 'Repeat findings'],
        integrations: ['ServiceDesk', 'FieldOps', 'Notifications'],
        clientValue: 'Turns safety events into structured learning and accountable action.',
      },
      {
        id: 'observations',
        name: 'Observation & Near Miss',
        tagline: 'Proactive safety reporting',
        category: 'Risk Prevention',
        icon: Radar,
        accent: '#00C6FF',
        audiences: ['HSE', 'Field Teams', 'Operations'],
        summary: 'Simple reporting for unsafe acts, unsafe conditions, positive observations, near misses, and supervisor interventions.',
        outcomes: ['Increase proactive reporting', 'Spot repeat unsafe conditions', 'Close weak signals before incidents', 'Reward positive safety behaviours'],
        workflows: ['Capture observation', 'Classify risk and location', 'Assign follow-up', 'Trend recurring patterns'],
        aiCapabilities: ['Observation classification', 'Repeat pattern detection', 'Suggested follow-up actions', 'Safety culture summaries'],
        kpis: ['Near misses logged', 'Positive observations', 'Repeat hotspots', 'Follow-up closure'],
        integrations: ['Mobile capture', 'Notifications', 'Analytics'],
        clientValue: 'Moves safety from reactive incident response to proactive risk prevention.',
      },
      {
        id: 'riskassess',
        name: 'Risk Assessments / JSA',
        tagline: 'Task-based risk controls',
        category: 'Risk Assessment',
        icon: ShieldCheck,
        accent: '#A855F7',
        audiences: ['HSE', 'Operations', 'Field Teams'],
        summary: 'Digital risk assessments, job safety analysis, method statement checks, and control verification before high-risk work starts.',
        outcomes: ['Standardize task risk reviews', 'Improve control selection', 'Create auditable pre-work records', 'Reduce uncontrolled high-risk activity'],
        workflows: ['Select work activity', 'Review hazards and controls', 'Confirm supervisor approval', 'Attach evidence and sign-off'],
        aiCapabilities: ['Hazard suggestions', 'Control recommendation', 'Residual risk explanation', 'Method statement review prompts'],
        kpis: ['Assessments completed', 'High-risk tasks approved', 'Controls verified', 'Residual risk trend'],
        integrations: ['Permit to Work', 'FieldOps', 'Document repository'],
        clientValue: 'Helps teams prove that high-risk work was assessed, controlled, and approved before execution.',
      },
      {
        id: 'permitwork',
        name: 'Permit to Work',
        tagline: 'Controlled high-risk work',
        category: 'Permit Management',
        icon: TicketCheck,
        accent: '#EAB308',
        audiences: ['HSE', 'Operations', 'Contractors'],
        summary: 'Permit workflows for hot works, confined space, working at height, isolation, lifting, excavation, and contractor-controlled tasks.',
        outcomes: ['Control high-risk activity', 'Avoid expired or incomplete permits', 'Connect permits to evidence', 'Improve contractor accountability'],
        workflows: ['Create permit request', 'Review controls and attachments', 'Approve and activate', 'Close with evidence'],
        aiCapabilities: ['Permit completeness checks', 'Missing control warnings', 'Expiry risk prompts', 'Close-out evidence guidance'],
        kpis: ['Active permits', 'Expired permits', 'Blocked permits', 'Close-out evidence coverage'],
        integrations: ['Risk assessments', 'Contractor management', 'Evidence repository'],
        clientValue: 'Keeps risky work visible, permissioned, and connected to proof.',
      },
      {
        id: 'correctiveactions',
        name: 'Corrective Actions',
        tagline: 'Actions, owners, and closure evidence',
        category: 'Action Management',
        icon: CheckCircle2,
        accent: '#00D084',
        audiences: ['HSE', 'Operations', 'Executive'],
        summary: 'A corrective and preventive action workflow for audit findings, failed inspections, incidents, observations, and control exceptions.',
        outcomes: ['Assign clear owners', 'Reduce overdue actions', 'Verify closure evidence', 'Escalate repeat failures'],
        workflows: ['Create action from finding', 'Assign owner and due date', 'Upload closure evidence', 'Approve or reopen'],
        aiCapabilities: ['Action wording drafts', 'Priority suggestions', 'Overdue escalation summaries', 'Closure evidence checks'],
        kpis: ['CAPA open', 'Overdue actions', 'Closure rate', 'Repeat findings'],
        integrations: ['IncidentOS', 'SafetyWalk', 'ControlAssurance'],
        clientValue: 'Makes safety follow-through measurable, accountable, and audit-ready.',
      },
      {
        id: 'trainingcompetency',
        name: 'Training & Competency',
        tagline: 'Competence linked to work risk',
        category: 'People Safety',
        icon: Users,
        accent: '#2E7FFF',
        audiences: ['HSE', 'Operations', 'Contractors'],
        summary: 'Track safety inductions, role-based competencies, certifications, toolbox talks, and training gaps by person, contractor, site, and activity.',
        outcomes: ['Know who is competent for high-risk work', 'Reduce expired training exposure', 'Target toolbox talks', 'Support contractor governance'],
        workflows: ['Map roles to competencies', 'Track certificates and expiry', 'Assign refreshers', 'Record toolbox talk attendance'],
        aiCapabilities: ['Training gap summaries', 'Role-based competency suggestions', 'Expiry risk alerts', 'Toolbox talk drafting'],
        kpis: ['Competency coverage', 'Expired certificates', 'Inductions completed', 'Training overdue'],
        integrations: ['Contractor management', 'Permit to Work', 'Notifications'],
        clientValue: 'Connects workforce readiness to the actual risks and permits in the field.',
      },
      {
        id: 'controlassurance',
        name: 'ControlAssurance',
        tagline: 'Controls, obligations, and audit readiness',
        category: 'Assurance',
        icon: ShieldCheck,
        accent: '#A855F7',
        audiences: ['HSE', 'Compliance', 'Executive'],
        summary: 'Links safety controls, obligations, evidence, inspections, and corrective actions into a readiness view.',
        outcomes: ['Know which controls are effective', 'Find missing evidence', 'Prepare for audits', 'Prioritize high-risk gaps'],
        workflows: ['Map controls to obligations', 'Review evidence coverage', 'Open exceptions', 'Track remediation'],
        aiCapabilities: ['Readiness score explanation', 'Evidence gap detection', 'Control exception summaries', 'Risk-based prioritization'],
        kpis: ['Control effectiveness', 'Evidence coverage', 'Open exceptions', 'Audit readiness'],
        integrations: ['Evidence repository', 'Obligations register', 'Stage gates'],
        clientValue: 'Connects safety activity to assurance, proof, and management confidence.',
      },
      {
        id: 'evidencerepository',
        name: 'Evidence Repository',
        tagline: 'Safety proof in one place',
        category: 'Evidence & Audit',
        icon: ClipboardList,
        accent: '#00C6FF',
        audiences: ['HSE', 'Compliance', 'Executive'],
        summary: 'A searchable repository for inspection records, permits, photos, certificates, training evidence, audit packs, and closure proof.',
        outcomes: ['Reduce evidence hunting', 'Prove compliance faster', 'Link proof to controls and obligations', 'Protect institutional memory'],
        workflows: ['Capture evidence at source', 'Link to finding or control', 'Review completeness', 'Prepare audit pack'],
        aiCapabilities: ['Evidence summaries', 'Missing proof detection', 'Document classification', 'Audit pack recommendations'],
        kpis: ['Evidence completeness', 'Expired documents', 'Audit pack readiness', 'Linked controls'],
        integrations: ['SafetyWalk', 'Permit to Work', 'ControlAssurance'],
        clientValue: 'Turns everyday safety records into trusted evidence for inspections, audits, and leadership reviews.',
      },
    ],
    organizationValue: [
      ['HSE leaders', 'A live view of incidents, controls, permits, evidence, and corrective action health.'],
      ['Safety officers', 'Guided field capture, stronger inspections, and faster escalation of critical findings.'],
      ['Operations', 'Safety actions, permits, risk assessments, and work teams connected in one workflow.'],
      ['Contractors', 'Clear expectations for permits, competencies, evidence, and close-out responsibilities.'],
      ['Executives', 'Board-ready OSH performance, assurance visibility, and AI-supported risk narratives.'],
    ],
    ctas: ['Book a walkthrough', 'Ask the AI advisor', 'Explore OSH workflows', 'Discuss this solution'],
  },
];

function getBasePath() {
  const path = window.location.pathname;
  if (path.startsWith('/4c360')) return '/4c360';
  return path.startsWith('/brochure') ? '/brochure' : '';
}

function getCurrentSolutionSlug(): SolutionSlug | null {
  const path = window.location.pathname.replace(/\/$/, '');
  const basePath = getBasePath();
  const segment = (basePath ? path.replace(basePath, '') : path).split('/').filter(Boolean)[0];
  if (segment && solutions.some(solution => solution.slug === segment)) return segment as SolutionSlug;
  return null;
}

function routeTo(slug?: SolutionSlug) {
  const basePath = getBasePath() || (window.location.hostname === 'brochures.4cgrc.com' ? '/4c360' : '/brochure');
  const nextPath = slug ? `${basePath}/${slug}` : basePath;
  window.history.pushState({}, '', nextPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

const solutionNavigationAliases: Record<SolutionSlug, string[]> = {
  properties: ['properties', 'property', 'real estate', 'development', 'developer', 'residents', 'project command', 'projectcommand'],
  fm: ['fm', 'facilities', 'facility', 'facility management', 'maintenance', 'cafm', 'work orders', 'asset maintenance'],
  marine: ['marine', 'maritime', 'port', 'ports', 'fleet', 'vessel', 'vessels', 'marina'],
  osh: ['osh', 'hse', 'safety', 'health and safety', 'occupational safety', 'incident safety', 'permits'],
  'retail-compliance': ['retail', 'retail compliance', 'store compliance', 'stores', 'branches', 'branch compliance', 'bank compliance'],
};

function findSolutionIntent(value?: string): SolutionSlug | null {
  if (!value) return null;
  const input = value.toLowerCase().replace(/[-_]/g, ' ').trim();
  const direct = solutions.find(solution => solution.slug === value || solution.name.toLowerCase() === input);
  if (direct) return direct.slug;

  for (const [slug, aliases] of Object.entries(solutionNavigationAliases) as Array<[SolutionSlug, string[]]>) {
    if (aliases.some(alias => input.includes(alias))) return slug;
  }

  return null;
}

function navigateToSolutionIntent(value?: string) {
  const slug = findSolutionIntent(value);
  if (!slug) return null;
  routeTo(slug);
  return solutions.find(solution => solution.slug === slug) ?? null;
}

function MetricPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[rgba(46,127,255,0.22)] bg-[#07111F] px-3 py-1 text-[11px] font-bold text-[#B8C7DB]">
      {children}
    </span>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#7EB8F7]">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(46,127,255,0.22)] bg-[#0A1628] text-[#2E7FFF]">
        <Icon size={14} />
      </span>
      {children}
    </div>
  );
}

function SolutionAgentWidget({ solution }: { solution?: Solution }) {
  const [open, setOpen] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  const conversationRef = useRef<{ endSession(): Promise<void> } | null>(null);
  const lastAutoNavigationRef = useRef('');
  const agentAvailable = Boolean(SOLUTIONS_AGENT_ID);

  const openSolutionFromAdvisor = (value?: string) => {
    const nextSolution = navigateToSolutionIntent(value);
    if (!nextSolution) return null;
    setOpen(true);
    return nextSolution;
  };

  const maybeNavigateFromMessage = (message: string, source: string) => {
    if (source !== 'user') return;
    const normalized = message.toLowerCase();
    const looksLikeNavigation =
      /\b(open|show|take me|go to|navigate|switch|explore|see|view)\b/.test(normalized) ||
      /\b(fm|osh|marine|properties|property|retail|compliance)\b/.test(normalized);
    if (!looksLikeNavigation || normalized === lastAutoNavigationRef.current) return;

    const nextSolution = openSolutionFromAdvisor(normalized);
    if (nextSolution) lastAutoNavigationRef.current = normalized;
  };

  const stopVoice = async () => {
    if (conversationRef.current) {
      try {
        await conversationRef.current.endSession();
      } catch {
        // no-op
      }
    }
    conversationRef.current = null;
    setVoiceActive(false);
    setStatus('idle');
  };

  const startVoice = async () => {
    if (!agentAvailable || voiceActive) return;
    try {
      setOpen(true);
      setVoiceActive(true);
      setStatus('connecting');
      const { Conversation } = await import('@11labs/client');
      conversationRef.current = await Conversation.startSession({
        agentId: SOLUTIONS_AGENT_ID!,
        connectionType: 'websocket',
        dynamicVariables: {
          current_solution: solution?.name ?? '4C360 solutions hub',
          available_solutions: solutions.map(item => `${item.name} (${item.slug})`).join(', '),
          navigation_instruction:
            'When the user asks to open, show, explore, or switch to a solution, call navigate_to_solution with one of: properties, fm, marine, osh, retail-compliance.',
        },
        clientTools: {
          navigate_to_solution: ({ solution: requestedSolution, slug }: { solution?: string; slug?: string }) => {
            const nextSolution = openSolutionFromAdvisor(requestedSolution ?? slug);
            return nextSolution
              ? `Opened ${nextSolution.name}.`
              : 'I could not match that to a 4C360 solution. Available options are Properties, FM, Marine, OSH, and Retail Compliance.';
          },
          show_solutions_hub: () => {
            routeTo();
            setOpen(true);
            return 'Opened the 4C360 solutions hub.';
          },
        },
        onConnect: () => setStatus('listening'),
        onDisconnect: () => {
          conversationRef.current = null;
          setVoiceActive(false);
          setStatus('idle');
        },
        onError: () => {
          conversationRef.current = null;
          setVoiceActive(false);
          setStatus('error');
        },
        onMessage: ({ message, source }: { message: string; source: string }) => {
          maybeNavigateFromMessage(message, source);
        },
        onModeChange: (mode: { mode: 'speaking' | 'listening' }) => setStatus(mode.mode),
      });
    } catch {
      conversationRef.current = null;
      setVoiceActive(false);
      setStatus('error');
    }
  };

  useEffect(() => () => {
    void stopVoice();
  }, []);

  useEffect(() => {
    const openAdvisor = () => setOpen(true);
    window.addEventListener('open-solutions-agent', openAdvisor);
    return () => window.removeEventListener('open-solutions-agent', openAdvisor);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-40px))] rounded-3xl border border-[#E11D2E]/35 bg-[#07111F]/96 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FFB4BC]">4C360 AI Advisor</div>
              <h3 className="mt-1 text-lg font-black">{solution ? `${solution.name} questions` : 'Solutions questions'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#B8C7DB]">
                Ask about modules, business benefits, implementation approach, integrations, rollout options, or which solution fits your client.
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-xl border border-white/10 p-2 text-[#B8C7DB] hover:text-white" aria-label="Close AI advisor">
              <X size={16} />
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-[rgba(46,127,255,0.16)] bg-[#0A1628] p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold">{agentAvailable ? 'Voice advisor ready' : 'Voice advisor not configured'}</div>
                <div className="mt-1 text-[12px] text-[#7A94B4]">
                  {agentAvailable ? 'Uses the dedicated solutions agent, not the platform Copilot.' : 'Set VITE_ELEVENLABS_SOLUTIONS_AGENT_ID to enable this widget.'}
                </div>
              </div>
              <button
                onClick={voiceActive ? stopVoice : startVoice}
                disabled={!agentAvailable || status === 'connecting'}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                  !agentAvailable
                    ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/35'
                    : voiceActive
                    ? 'border-[#E11D2E]/50 bg-[#E11D2E]/20 text-[#FFB4BC] hover:bg-[#E11D2E]/30'
                    : 'border-[#2E7FFF]/35 bg-[#2E7FFF]/12 text-[#B8C7DB] hover:text-white'
                }`}
                aria-label={voiceActive ? 'End voice advisor session' : 'Start voice advisor'}
                title={voiceActive ? 'End voice session' : 'Start voice advisor'}
              >
                {voiceActive ? <PhoneOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
            <div className="mt-3 rounded-xl bg-black/20 px-3 py-2 text-[12px] font-semibold text-[#B8C7DB]">
              {status === 'connecting' && 'Connecting to the solutions advisor...'}
              {status === 'listening' && 'Listening now. Ask your question.'}
              {status === 'speaking' && 'Advisor is responding. You can speak again when it returns to listening.'}
              {status === 'error' && 'Voice connection failed. Check the dedicated agent ID and browser microphone permissions.'}
              {status === 'idle' && (agentAvailable ? 'Click the microphone to start.' : 'Agent ID missing.')}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(value => !value)}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E11D2E]/50 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.22),rgba(46,127,255,0.18)_34%,#08111F_64%,#050A14)] text-white shadow-xl shadow-[#E11D2E]/20"
        aria-label="Open 4C360 AI advisor"
      >
        <Sparkles size={26} />
      </button>
    </div>
  );
}

function SolutionsLanding() {
  return (
    <div className="min-h-screen bg-[#07101C] text-[#EEF3FA]">
      <section className="relative overflow-hidden border-b border-[rgba(46,127,255,0.16)] bg-[radial-gradient(circle_at_18%_12%,rgba(225,29,46,0.2),transparent_34%),radial-gradient(circle_at_76%_20%,rgba(46,127,255,0.24),transparent_36%),linear-gradient(135deg,#07101C,#0A1628_48%,#101A34)] px-6 py-10 lg:px-10">
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: 'linear-gradient(rgba(46,127,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(46,127,255,.12) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <img src="/4c-logo.png" alt="4C360" className="h-12 w-12 rounded-xl border border-white/10 bg-[#07111F]" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#FFB4BC]">brochures.4cgrc.com / 4C360</p>
                  <p className="text-[12px] font-semibold text-[#7A94B4]">Interactive solution brochures</p>
                </div>
              </div>
              <h1 className="mt-8 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.02em] text-white lg:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Explore 4C360 solutions by industry, workflow, and client outcome.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#B8C7DB]">
                A public microsite for prospects to understand each 4C360 solution, the modules inside it, the benefits it creates, and how AI supports the operating model.
              </p>
            </div>
            <a href={DEMO_URL} target="_blank" rel="noreferrer" className="flex h-11 items-center gap-2 rounded-xl bg-[#E11D2E] px-4 text-sm font-black text-white shadow-lg shadow-[#E11D2E]/20 hover:bg-[#F02A3A]">
              <ArrowRight size={16} />
              Book Demo
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6 lg:px-10">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {solutions.map(solution => {
            const Icon = solution.icon;
            return (
              <button
                key={solution.slug}
                onClick={() => routeTo(solution.slug)}
                className="group rounded-3xl border border-[rgba(46,127,255,0.18)] bg-[#0A1628] p-5 text-left transition hover:-translate-y-1 hover:border-[#E11D2E]/55 hover:bg-[#0D1C34]"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10" style={{ background: `${solution.accent}22`, color: solution.accent }}>
                  <Icon size={26} />
                </span>
                <div className="mt-5 text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: solution.accent }}>{solution.label}</div>
                <h2 className="mt-2 text-2xl font-black text-white">{solution.name}</h2>
                <p className="mt-3 min-h-[96px] text-sm leading-6 text-[#B8C7DB]">{solution.subheadline}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-black text-[#7EB8F7]">
                  Open brochure <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </section>

        <section className="rounded-3xl border border-[#E11D2E]/25 bg-[linear-gradient(135deg,rgba(225,29,46,0.16),rgba(46,127,255,0.08))] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FFB4BC]">Client-facing by design</div>
              <h2 className="mt-2 text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Built for public sharing, sales conversations, and AI-assisted discovery.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#B8C7DB]">
                Each brochure is independent from the platform app, easy to send as a link, and ready for a dedicated ElevenLabs sales advisor that can answer prospect questions.
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new Event('open-solutions-agent'))}
              className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#E11D2E] px-4 text-sm font-black text-white shadow-lg shadow-[#E11D2E]/20"
            >
              <Sparkles size={16} />
              Ask the AI advisor
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function SolutionBrochure({ solution }: { solution: Solution }) {
  const [activeAudience, setActiveAudience] = useState<'All' | Audience>('All');
  const [selectedId, setSelectedId] = useState(solution.modules[0].id);
  const [query, setQuery] = useState('');
  const detailRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveAudience('All');
    setQuery('');
    setSelectedId(solution.modules[0].id);
  }, [solution.slug]);

  const filteredModules = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return solution.modules.filter(module => {
      const matchesAudience = activeAudience === 'All' || module.audiences.includes(activeAudience);
      const matchesQuery = !lower || `${module.name} ${module.tagline} ${module.category} ${module.summary}`.toLowerCase().includes(lower);
      return matchesAudience && matchesQuery;
    });
  }, [activeAudience, query, solution.modules]);

  useEffect(() => {
    if (!filteredModules.length) return;
    if (!filteredModules.some(module => module.id === selectedId)) {
      setSelectedId(filteredModules[0].id);
    }
  }, [filteredModules, selectedId]);

  const selected = solution.modules.find(module => module.id === selectedId) ?? solution.modules[0];
  const relevantAudiences = audiences.filter(audience => audience === 'All' || solution.modules.some(module => module.audiences.includes(audience)));

  const openModuleBrief = (id: string) => {
    setSelectedId(id);
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="min-h-screen bg-[#07101C] text-[#EEF3FA]">
      <section className="relative overflow-hidden border-b border-[rgba(46,127,255,0.16)] bg-[radial-gradient(circle_at_20%_20%,rgba(225,29,46,0.18),transparent_34%),radial-gradient(circle_at_76%_12%,rgba(46,127,255,0.22),transparent_36%),linear-gradient(135deg,#07101C,#0A1628_48%,#101A34)] px-6 py-8 lg:px-10">
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: 'linear-gradient(rgba(46,127,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(46,127,255,.12) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => routeTo()} className="flex items-center gap-2 text-sm font-bold text-[#7EB8F7] hover:text-white">
              <ArrowRight size={16} className="rotate-180" />
              Solutions hub
            </button>
            <div className="flex flex-wrap gap-2">
              {solutions.map(item => (
                <button
                  key={item.slug}
                  onClick={() => routeTo(item.slug)}
                  className={`rounded-full px-3 py-1.5 text-[12px] font-black transition ${item.slug === solution.slug ? 'bg-[#E11D2E] text-white' : 'border border-[rgba(46,127,255,0.22)] bg-[#07111F] text-[#B8C7DB] hover:text-white'}`}
                >
                  {item.name.replace('4C360 ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <img src="/4c-logo.png" alt="4C360" className="h-11 w-11 rounded-xl border border-white/10 bg-[#07111F]" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#FFB4BC]">{solution.name}</p>
                  <p className="text-[12px] font-semibold text-[#7A94B4]">{solution.label}</p>
                </div>
              </div>
              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.02em] text-white lg:text-6xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {solution.headline}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#B8C7DB]">{solution.subheadline}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={DEMO_URL} target="_blank" rel="noreferrer" className="flex h-11 items-center gap-2 rounded-xl bg-[#E11D2E] px-4 text-sm font-black text-white shadow-lg shadow-[#E11D2E]/20 hover:bg-[#F02A3A]">
                <ArrowRight size={16} />
                Book Demo
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event('open-solutions-agent'))}
                className="flex h-11 items-center gap-2 rounded-xl border border-[#E11D2E]/45 bg-[#E11D2E]/14 px-4 text-sm font-black text-[#FFB4BC] hover:bg-[#E11D2E]/22 hover:text-white"
              >
                <Sparkles size={16} />
                Ask the AI advisor
              </button>
              <button onClick={() => document.getElementById('solution-modules')?.scrollIntoView({ behavior: 'smooth' })} className="flex h-11 items-center gap-2 rounded-xl border border-[rgba(46,127,255,0.28)] bg-[#0A1628] px-4 text-sm font-bold text-[#B8C7DB] hover:text-white">
                Explore modules
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {solution.stats.map(([value, label]) => (
              <div key={value} className="rounded-2xl border border-[rgba(46,127,255,0.18)] bg-[#0A1628]/80 p-4">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="mt-1 text-[12px] font-semibold text-[#7A94B4]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6 lg:px-10">
        <section className="rounded-2xl border border-[rgba(46,127,255,0.18)] bg-[#0A1628] p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A94B4]" />
              <input
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search modules, workflows, benefits..."
                className="h-11 w-full rounded-xl border border-[rgba(46,127,255,0.18)] bg-[#07111F] pl-10 pr-3 text-sm text-[#EEF3FA] outline-none focus:border-[#E11D2E]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {relevantAudiences.map(audience => (
                <button
                  key={audience}
                  onClick={() => {
                    setActiveAudience(audience);
                    const lower = query.trim().toLowerCase();
                    const firstMatch = solution.modules.find(module => {
                      const matchesAudience = audience === 'All' || module.audiences.includes(audience);
                      const matchesQuery = !lower || `${module.name} ${module.tagline} ${module.category} ${module.summary}`.toLowerCase().includes(lower);
                      return matchesAudience && matchesQuery;
                    });
                    if (firstMatch) setSelectedId(firstMatch.id);
                  }}
                  className={`h-10 rounded-xl px-3 text-[12px] font-black transition ${activeAudience === audience ? 'bg-[#E11D2E] text-white' : 'border border-[rgba(46,127,255,0.18)] bg-[#07111F] text-[#B8C7DB] hover:text-white'}`}
                >
                  {audience}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="solution-modules" className="grid gap-5 xl:grid-cols-[380px_1fr]">
          <div className="space-y-3">
            <SectionLabel icon={Network}>Module Library</SectionLabel>
            <div className="text-[12px] font-semibold text-[#7A94B4]">
              Showing {filteredModules.length} module{filteredModules.length === 1 ? '' : 's'} for {activeAudience === 'All' ? 'all audiences' : activeAudience}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {filteredModules.map(module => {
                const Icon = module.icon;
                const isSelected = module.id === selected.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => openModuleBrief(module.id)}
                    className={`group rounded-2xl border p-4 text-left transition ${isSelected ? 'border-[#E11D2E]/70 bg-[rgba(225,29,46,0.10)]' : 'border-[rgba(46,127,255,0.16)] bg-[#0A1628] hover:border-[rgba(46,127,255,0.34)]'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10" style={{ background: `${module.accent}22`, color: module.accent }}>
                          <Icon size={20} />
                        </span>
                        <div>
                          <h3 className="text-base font-black text-white">{module.name}</h3>
                          <p className="mt-1 text-[11px] font-semibold text-[#7A94B4]">{module.category}</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-[rgba(46,127,255,0.18)] px-2 py-1 text-[10px] font-bold text-[#7A94B4]">{module.audiences[0]}</span>
                    </div>
                    <p className="mt-3 text-[12px] leading-5 text-[#B8C7DB]">{module.tagline}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#7EB8F7]">Open module brief <ArrowRight size={12} /></span>
                      {isSelected && <span className="rounded-full bg-emerald-400/12 px-2 py-1 text-[10px] font-black text-emerald-200">Selected</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <article ref={detailRef} className="scroll-mt-6 rounded-3xl border border-[rgba(46,127,255,0.18)] bg-[#0A1628] p-5 lg:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em]" style={{ background: `${selected.accent}22`, color: selected.accent }}>
                    {selected.category}
                  </span>
                  {selected.audiences.map(audience => <MetricPill key={audience}>{audience}</MetricPill>)}
                </div>
                <h2 className="mt-4 text-3xl font-black text-white lg:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{selected.name}</h2>
                <p className="mt-2 text-lg font-bold" style={{ color: selected.accent }}>{selected.tagline}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-[#B8C7DB]">{selected.summary}</p>
              </div>
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10" style={{ background: `${selected.accent}22`, color: selected.accent }}>
                <selected.icon size={36} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(46,127,255,0.14)] bg-[#07111F] p-4">
                <SectionLabel icon={CheckCircle2}>Business Benefits</SectionLabel>
                <ul className="mt-4 space-y-3">
                  {selected.outcomes.map(item => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[#DDE6F8]">
                      <CheckCircle2 size={16} className="mt-1 shrink-0 text-emerald-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[rgba(46,127,255,0.14)] bg-[#07111F] p-4">
                <SectionLabel icon={Sparkles}>AI Capabilities</SectionLabel>
                <ul className="mt-4 space-y-3">
                  {selected.aiCapabilities.map(item => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[#DDE6F8]">
                      <Bot size={16} className="mt-1 shrink-0 text-[#E11D2E]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-2xl border border-[rgba(46,127,255,0.14)] bg-[#07111F] p-4">
                <SectionLabel icon={ArrowRight}>Example Workflow</SectionLabel>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selected.workflows.map((step, index) => (
                    <div key={step} className="rounded-xl border border-[rgba(46,127,255,0.14)] bg-[#0A1628] p-3">
                      <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: selected.accent }}>Step {index + 1}</div>
                      <div className="mt-2 text-sm font-semibold leading-6 text-[#DDE6F8]">{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-[rgba(46,127,255,0.14)] bg-[#07111F] p-4">
                  <SectionLabel icon={BarChart3}>KPIs</SectionLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.kpis.map(item => <MetricPill key={item}>{item}</MetricPill>)}
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgba(46,127,255,0.14)] bg-[#07111F] p-4">
                  <SectionLabel icon={Building2}>Connected Data</SectionLabel>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selected.integrations.map(item => <MetricPill key={item}>{item}</MetricPill>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#E11D2E]/25 bg-[linear-gradient(135deg,rgba(225,29,46,0.14),rgba(46,127,255,0.06))] p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FFB4BC]">Client value</div>
              <p className="mt-2 text-lg font-black leading-7 text-white">{selected.clientValue}</p>
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-[rgba(46,127,255,0.18)] bg-[#0A1628] p-5 lg:p-6">
          <SectionLabel icon={Users}>How {solution.name} Creates Value</SectionLabel>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {solution.organizationValue.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-[rgba(46,127,255,0.14)] bg-[#07111F] p-4">
                <h3 className="text-base font-black text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#B8C7DB]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mb-6 rounded-3xl border border-[#E11D2E]/25 bg-[linear-gradient(135deg,rgba(225,29,46,0.16),rgba(46,127,255,0.08))] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#FFB4BC]">Who this is for</div>
              <h2 className="mt-2 text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{solution.audience}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#B8C7DB]">{solution.name} helps prospects understand the operating model, business outcomes, connected workflows, and AI layer before a live demo.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {solution.ctas.map(cta => <MetricPill key={cta}>{cta}</MetricPill>)}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export function ModuleBrochure() {
  const [slug, setSlug] = useState<SolutionSlug | null>(getCurrentSolutionSlug);

  useEffect(() => {
    const updateSlug = () => setSlug(getCurrentSolutionSlug());
    window.addEventListener('popstate', updateSlug);
    return () => window.removeEventListener('popstate', updateSlug);
  }, []);

  const solution = slug ? solutions.find(item => item.slug === slug) : undefined;

  if (!solution) {
    return (
      <>
        <SolutionsLanding />
        <SolutionAgentWidget />
      </>
    );
  }

  return (
    <>
      <SolutionBrochure solution={solution} />
      <SolutionAgentWidget solution={solution} />
    </>
  );
}
