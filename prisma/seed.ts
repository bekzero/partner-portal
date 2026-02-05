import "dotenv/config";

import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Copy .env.example -> .env and fill it in.`
    );
  }
  return value;
}

async function upsertUser(params: {
  email: string;
  name: string;
  password: string;
  role: Role;
}) {
  const passwordHash = await bcrypt.hash(params.password, 12);
  return prisma.user.upsert({
    where: { email: params.email },
    create: {
      email: params.email,
      name: params.name,
      role: params.role,
      passwordHash,
    },
    update: {
      name: params.name,
      role: params.role,
      passwordHash,
    },
  });
}

async function ensureTag(name: string) {
  return prisma.tag.upsert({
    where: { name },
    create: { name },
    update: {},
  });
}

async function main() {
  const adminEmail = requireEnv("SEED_ADMIN_EMAIL");
  const adminPassword = requireEnv("SEED_ADMIN_PASSWORD");
  const partnerEmail = requireEnv("SEED_PARTNER_EMAIL");
  const partnerPassword = requireEnv("SEED_PARTNER_PASSWORD");

  const admin = await upsertUser({
    email: adminEmail,
    name: "Portal Admin",
    password: adminPassword,
    role: Role.admin,
  });

  const partner = await upsertUser({
    email: partnerEmail,
    name: "Partner User",
    password: partnerPassword,
    role: Role.partner,
  });

  const tags = await Promise.all(
    [
      "positioning",
      "pricing",
      "objections",
      "security",
      "enterprise",
      "mid-market",
      "legal",
      "healthcare",
    ].map(ensureTag)
  );

  const tagByName = new Map(tags.map((t) => [t.name, t] as const));

  const sampleBattleCards = [
    {
      title: "Passwordless Access for Law Firms",
      summary: "Sales battle card for MSP partners to use when speaking with law firms about identity security, credential risk, and passwordless authentication.",
      competitor: "N/A",
      industry: "Legal",
      published: true,
      tags: ["security", "legal"],
      contentMarkdown: `# Passwordless Access for Law Firms

## Purpose
This battle card helps MSP partners have conversations with law firms about identity security, credential risk, and passwordless authentication.

## The Risk & Reality Law Firms Face
Law firms are high-value targets because of:
- Privileged client communications
- Litigation strategy and case files
- Financial and settlement data
- Personally identifiable information (PII)

**Today, most law firm breaches begin with stolen credentials.**

## Proof Points & Statistics
- 80%+ of breaches caused by stolen credentials
- 36% of law firms breached in the past year
- 56% lost sensitive client data
- 700% projected increase in AI-driven phishing

## Meet KZero Passwordless

### Login Made Simple
- Biometric sign-in (Face ID, fingerprint, device)
- No passwords to remember or type

### Phishing-Resistant Access
- Device-bound authentication
- Credentials cannot be replayed or stolen

### Protect Legacy Legal Apps
- Encrypted biometric vault for apps that still require passwords
- Critical for older legal and practice-management software

### One Secure Identity
- Single biometric sign-in across firm applications

## Why Law Firms Are Moving Beyond Passwords
- Secure client confidentiality
- Meet compliance and cyber insurance requirements
- Ensure operational continuity
- Improve attorney productivity

## How Passwordless Access Works
1. Attorney authenticates with biometrics
2. Access is bound to trusted devices
3. KZero securely grants access to applications

## MSP-Delivered & Managed
- Implemented and managed by the MSP
- Aligned with the firm's existing IT environment
- Supported and monitored on the firm's behalf
- No change in who the firm calls for support

## Download
[View the complete battle card PDF](/battle-card-law-firms.pdf)
`,
    },
    {
      title: "Passwordless Access for Healthcare",
      summary: "Sales battle card for MSP partners to use when speaking with healthcare organizations about identity security, credential risk, and regulatory exposure.",
      competitor: "N/A",
      industry: "Healthcare",
      published: true,
      tags: ["security", "healthcare"],
      contentMarkdown: `# Passwordless Access for Healthcare

## Purpose
This battle card helps MSP partners have conversations with healthcare organizations about identity security, credential risk, regulatory exposure, and clinical workflow disruption.

## The Risks & Reality Healthcare Faces
Healthcare is uniquely vulnerable because of:
- Protected Health Information (PHI)
- Medical records and clinical data
- Billing, payment, and insurance data
- Highly distributed users, devices, and locations
- Increased regulatory exposure and breach liability

**Many healthcare breaches begin with compromised credentials, not sophisticated hacking.**

## Impact Statistics
- 80%+ of breaches caused by stolen credentials
- $9.77M average cost of a healthcare data breach
- 192M people impacted by the largest healthcare breach
- 700% projected increase in AI-driven phishing

## Meet KZero Passwordless

### Login Made Simple
- Biometric authentication (face or fingerprint)
- No passwords to remember or type
- Faster access in time-sensitive clinical environments

### Phishing-Resistant Access
- Device-bound authentication
- Credentials cannot be replayed or intercepted

### Protect Legacy Healthcare Apps
- Encrypted biometric vault for applications that still require passwords
- Critical for older EHRs and specialty clinical systems

### One Secure Identity
- Single biometric sign-in across EHR, email, and clinical systems
- Works across locations and devices

## Why Healthcare Is Moving Beyond Passwords
- Support regulatory compliance (HIPAA, PIPEDA, PHIPA)
- Meet cyber insurance requirements
- Ensure operational continuity
- Improve clinician productivity

## How Passwordless Access Works
1. Clinician authenticates with biometrics
2. Access is bound to trusted devices
3. KZero securely grants access to applications

## MSP-Delivered & Managed
- Implemented and managed by the MSP
- Aligned with existing IT environments
- Supported and monitored on the client's behalf
- No change in who the organization contacts for support

## Download
[View the complete battle card PDF](/battle-card-healthcare.pdf)
`,
    },
  ] as const;

  for (const bc of sampleBattleCards) {
    const created = await prisma.battleCard.upsert({
      where: { id: `${bc.competitor}:${bc.industry}:${bc.title}` },
      create: {
        id: `${bc.competitor}:${bc.industry}:${bc.title}`,
        title: bc.title,
        summary: bc.summary,
        competitor: bc.competitor,
        industry: bc.industry,
        contentMarkdown: bc.contentMarkdown,
        published: bc.published,
        createdById: admin.id,
      },
      update: {
        title: bc.title,
        summary: bc.summary,
        competitor: bc.competitor,
        industry: bc.industry,
        contentMarkdown: bc.contentMarkdown,
        published: bc.published,
        createdById: admin.id,
      },
    });

    const wantedTags = bc.tags
      .map((name) => tagByName.get(name))
      .filter(Boolean);

    await prisma.battleCardTag.deleteMany({
      where: { battleCardId: created.id },
    });
    if (wantedTags.length) {
      await prisma.battleCardTag.createMany({
        data: wantedTags.map((t) => ({ battleCardId: created.id, tagId: t!.id })),
      });
    }
  }

  const sampleAnnouncements = [
    {
      title: "Welcome to the Partner Portal",
      contentMarkdown:
        "We are live. Start with **Battle Cards** for competitor intel and positioning guidance.",
      published: true,
    },
    {
      title: "Enablement Update: New Industry Filters",
      contentMarkdown:
        "Battle Cards now support industry-first browsing. Check the **Industries** section.",
      published: true,
    },
  ] as const;

  for (const a of sampleAnnouncements) {
    await prisma.announcement.upsert({
      where: { id: a.title },
      create: {
        id: a.title,
        title: a.title,
        contentMarkdown: a.contentMarkdown,
        published: a.published,
        createdById: admin.id,
      },
      update: {
        title: a.title,
        contentMarkdown: a.contentMarkdown,
        published: a.published,
        createdById: admin.id,
      },
    });
  }

  const sampleResources = [
    {
      title: "Partner Pitch Deck",
      url: "https://example.com/partner-pitch-deck",
      category: "Sales",
      description: "Latest deck for partner-led opportunities.",
      published: true,
    },
    {
      title: "Security Overview",
      url: "https://example.com/security-overview",
      category: "Security",
      description: "High-level security posture and compliance notes.",
      published: true,
    },
  ] as const;

  for (const r of sampleResources) {
    await prisma.resource.upsert({
      where: { id: r.title },
      create: {
        id: r.title,
        title: r.title,
        url: r.url,
        category: r.category,
        description: r.description,
        published: r.published,
        createdById: admin.id,
      },
      update: {
        title: r.title,
        url: r.url,
        category: r.category,
        description: r.description,
        published: r.published,
        createdById: admin.id,
      },
    });
  }

  console.log("\nSeed complete.\n");
  console.log("Admin:", adminEmail);
  console.log("Partner:", partnerEmail);
  console.log("\nPasswords were read from .env.");

  // Avoid unused warning for partner
  void partner;
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
