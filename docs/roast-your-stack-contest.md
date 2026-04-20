# "Roast Your Stack" Weekly Contest - Phase C Task C5

## Goal
Launch a weekly contest where users share their infrastructure stacks for security reviews, driving engagement, community growth, and viral loops.

## Contest Concept

### How It Works
1. **Every Wednesday**: Contest opens at 18:00 UTC
2. **Users submit**: Share their tech stack (Docker, Kubernetes, Nginx, etc.) via form or social media
3. **Security review**: ClawGuru AI analyzes the stack and provides:
   - Security score (0-100)
   - Top 3 vulnerabilities
   - Fix recommendations with runbook links
   - "Roast" commentary (witty but helpful)
4. **Leaderboard**: Top submissions ranked by security score
5. **Prizes**: Weekly winners get Day Pass, Pro subscription, or swag
6. **Viral loop**: Share results on social media with embed badges

### Value Proposition
- **For users**: Free security audit, learn from others' mistakes, win prizes
- **For ClawGuru**: User-generated content, viral sharing, lead generation
- **For community**: Learning resource, friendly competition

## Contest Mechanics

### Submission Form
Fields:
- Name (optional, can be anonymous)
- Tech stack (checkboxes): Docker, Kubernetes, Nginx, PostgreSQL, Redis, etc.
- Cloud provider: AWS, GCP, Azure, Hetzner, DO, Self-hosted
- Description: Brief description of the stack (optional)
- Contact email (for prize notification)

### Scoring System
- **Base score**: 50/100
- **+10** for each security best practice (HTTPS, firewall, backups)
- **-10** for each common misconfiguration (default ports, weak auth)
- **+5** for using modern tools (container orchestration, managed services)
- **-5** for deprecated tools (legacy versions, unsupported software)
- **Bonus**: Up to +20 for complexity handled correctly

### Review Format
```
🔥 ROAST: [Stack Name]
━━━━━━━━━━━━━━━━━━━━━━━━
Security Score: 78/100

✅ What's Working:
- HTTPS enabled everywhere
- Proper firewall rules
- Automated backups

⚠️ Critical Issues:
- PostgreSQL exposed on default port 5432
- Nginx version outdated (1.18 vs 1.24+)
- No rate limiting on API endpoints

💡 Quick Fixes:
- [Runbook: PostgreSQL Hardening] → /runbook/postgres-hardening
- [Runbook: Nginx Upgrade] → /runbook/nginx-upgrade
- [Runbook: API Rate Limiting] → /runbook/api-rate-limiting

😈 The Roast:
"You've got the basics right, but leaving PostgreSQL on the default port is like leaving your front door unlocked with a sign that says 'come in'. Fix that and you're solid."

🏆 Rank: #3 this week
```

## Implementation Plan

### Phase 1: MVP (Week 1)
- Simple submission form (Google Forms or Typeform)
- Manual review by ClawGuru team
- Share results on Twitter/X
- Leaderboard on simple page

### Phase 2: Automated (Week 2-3)
- Build submission form in Next.js
- Integrate with ClawGuru AI for automated scoring
- Auto-generate review format
- Dynamic leaderboard

### Phase 3: Viral Features (Week 4+)
- Embed badges for sharing results
- Social media auto-post
- Email notifications for submissions
- Contest archive page

## Prize Structure

### Weekly Prizes
- **1st Place**: Pro subscription (€49/mo) + ClawGuru swag pack
- **2nd Place**: Day Pass (€9) + ClawGuru sticker pack
- **3rd Place**: ClawGuru t-shirt

### Monthly Prizes
- **Stack of the Month**: Team subscription (€129/mo) + featured on blog
- **Most Improved**: Pro subscription + shoutout on social media

### Special Prizes
- **Funniest Roast**: Custom ClawGuru mug
- **Most Complex Stack**: Day Pass + consulting session

## Promotion Strategy

### Launch Week
- **Twitter/X thread**: "Introducing Roast Your Stack - weekly security roast contest"
- **Reddit post**: r/selfhosted, r/devops, r/netsec
- **Discord announcement**: In security communities
- **Email blast**: To existing ClawGuru users

### Weekly Promotion
- **Wednesday**: Contest opens, announcement post
- **Thursday**: Reminder post, showcase early submissions
- **Friday**: Results announced, winners revealed
- **Saturday**: Share top roasts on social media

### Cross-Promotion
- **Affiliates**: Offer bonus commission for contest referrals
- **Partners**: Co-promote with Hetzner/DO if partnership secured
- **Influencers**: Ask security creators to participate

## Viral Mechanics

### Shareable Results
- **Embed badge**: "My stack scored 78/100 on ClawGuru"
- **Twitter card**: Auto-generated image with score + roast
- **LinkedIn post**: Professional version of results
- **Reddit comment**: Share in relevant communities

### Leaderboard
- **Public leaderboard**: Top 10 stacks of the week
- **Archive**: All past submissions with scores
- **Comparison**: "My stack vs average stack"

### Social Proof
- **Testimonials**: Winners share their experience
- **Before/After**: Show improvement over time
- **Community voting**: Let users vote on best roasts

## Technical Requirements

### New Pages
- `/contest` - Main contest page with submission form
- `/contest/leaderboard` - Weekly leaderboard
- `/contest/archive` - Past submissions archive
- `/contest/[id]` - Individual submission results

### New Components
- `ContestForm` - Submission form component
- `ContestLeaderboard` - Leaderboard display
- `ContestCard` - Individual submission card
- `ShareBadge` - Embed badge for sharing results

### Database Schema
```sql
CREATE TABLE contest_submissions (
  id SERIAL PRIMARY KEY,
  week INTEGER NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  stack JSONB NOT NULL,
  score INTEGER NOT NULL,
  review TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_anonymous BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_contest_week ON contest_submissions(week);
CREATE INDEX idx_contest_score ON contest_submissions(score DESC);
```

### API Endpoints
- `POST /api/contest/submit` - Submit stack for review
- `GET /api/contest/leaderboard` - Get current leaderboard
- `GET /api/contest/archive` - Get past submissions
- `GET /api/contest/[id]` - Get individual submission

## Success Metrics

### Engagement
- 50+ submissions per week
- 1,000+ page views to contest page
- 200+ social shares of results
- 50+ new newsletter signups

### Growth
- 20% week-over-week growth in submissions
- 15% conversion to paid subscriptions
- 500+ unique visitors from contest

### Viral
- 100+ social media mentions per week
- 10+ Reddit posts about contest
- 5+ blog posts from participants

## Timeline

### Week 1: Launch MVP
- Create Google Form for submissions
- Set up manual review process
- Launch announcement on social media
- First contest: Wednesday 18:00 UTC

### Week 2: Build Automated System
- Build submission form in Next.js
- Integrate with ClawGuru AI
- Set up database schema
- Migrate to automated scoring

### Week 3: Add Viral Features
- Build share badges
- Add social media auto-post
- Create leaderboard page
- Add archive functionality

### Week 4: Optimize & Scale
- Analyze first month data
- Optimize submission flow
- Add email notifications
- Scale promotion efforts

## Risks & Mitigation

### Risk: Low participation
- **Mitigation**: Offer attractive prizes, promote heavily, make it fun
- **Backup**: Extend contest duration, increase prize value

### Risk: Poor quality submissions
- **Mitigation**: Provide clear guidelines, show examples
- **Backup**: Manual review filter, quality threshold

### Risk: Negative feedback on roasts
- **Mitigation**: Keep roasts constructive, focus on learning
- **Backup**: Allow users to opt-out of roasts, provide edit option

### Risk: Abuse/spam
- **Mitigation**: Rate limiting, email verification
- **Backup**: Manual review, CAPTCHA if needed

## Notes
- Keep it fun and educational, not mean
- Focus on learning from mistakes
- Celebrate improvements over time
- Build community, not just traffic
- Iterate based on feedback
