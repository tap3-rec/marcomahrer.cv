---
layout: post
title: The Evolution of Recruitment
description: How tech hiring transformed over two decades, from job boards to autonomous agents, and the gap no one has solved yet.
redirect_from:
  - /evolution/
  - /writing/the-evolution-of-recruitment/
---

I have spent fifteen years inside hiring systems, and most of what I believe about where talent acquisition is going comes from watching how it got here. This is the short version of that history, era by era, and the problem I think is still wide open at the end of it.

## Era 1, 2003 to 2009: Post and pray

Recruitment in the early 2000s was a paper-to-digital transition that had not quite finished. Monster.com and CareerBuilder dominated the top of the funnel. LinkedIn had launched in 2003, but by 2007 only about a fifth of recruiters used social networks for sourcing.

<div class="figures">
<div><b>70%</b><span>of a recruiter's time spent on admin</span></div>
<div><b>36 to 43</b><span>days to hire</span></div>
<div><b>$3,500</b><span>cost per hire</span></div>
</div>

A recruiter's day was cold calls, job board postings, and spreadsheets. Interviews meant flying candidates on site. The ATS existed but barely: Taleo and Kenexa ran on-premises, talked to nothing, and digitised paper processes.

Google was already different. While the industry posted and prayed, Google built gHire and treated hiring as an optimisation problem. It would take a decade for the market to catch up.

## Era 2, 2008 to 2015: Hunt and convince

The realisation that the best candidates were not clicking "Apply" changed everything. LinkedIn became a searchable talent database. GitHub, Twitter, and personal blogs became sourcing channels. A recruiter in 2015 could find a candidate, review their code, read their writing, and send a pitch, all in thirty minutes.

<div class="figures">
<div><b>30</b><span>minutes to source a qualified lead</span></div>
<div><b>28 to 32</b><span>days to hire</span></div>
</div>

The best firms separated sourcing from closing. Dedicated sourcers hunted on LinkedIn all day, feeding leads to recruiters who managed relationships. This was a genuine structural innovation, not just a new tool.

Greenhouse launched in 2012 and made Google's structured hiring methodology purchasable for the first time: interview scorecards, consistent rubrics, data visibility. Lever took a different angle with the CRM-first ATS.

## Era 3, 2015 to 2019: From gut feel to dashboards

The question shifted from "how do we find candidates" to "how do we know if we are hiring well?" Companies started instrumenting their pipelines, tracking source quality, interviewer prediction accuracy, offer conversion, and retention.

<div class="figures">
<div><b>40%</b><span>admin, down from 70%</span></div>
<div><b>30%</b><span>sourcing and qualifying</span></div>
<div><b>30%</b><span>relationships and closing</span></div>
</div>

Beamery built the "Salesforce of talent acquisition." GEM managed the "not now" pipeline. HackerRank and CodeSignal moved technical screening from whiteboards to automated assessments. Stripe invested in recruiting operations as a distinct function, which was not typical in 2014.

The most important shift: leading companies stopped hiring on credentials and started hiring on demonstrated ability. Longer process, vastly more predictive.

## Era 4, 2020 to 2022: The pandemic rupture

Years of change compressed into months. Conference room interviews became video calls across time zones. If hiring works remotely, why not source globally? Companies flush with funding needed to hire at unprecedented scale, and talent acquisition became a genuine competitive advantage.

<div class="figures">
<div><b>20 to 24</b><span>days to hire</span></div>
<div><b>20%</b><span>admin, down from 40%</span></div>
<div><b>40%</b><span>of time spent on closing</span></div>
</div>

Speed became a closing tool. The slower your process, the less likely a top candidate waited around. Ashby gained traction, built by engineers for engineers with analytics from day one. The ATS migration wave had begun.

The key insight of this era: interview consistency mattered more than interviewer brilliance. A mediocre interviewer with a consistent rubric produced better signal than a brilliant one having an unstructured conversation.

## Era 5, 2022 to 2025: AI everywhere, trust nowhere

ChatGPT launched in November 2022 and within months every recruiting platform bolted on AI: job descriptions, candidate matching, automated outreach, code review. AI-powered sourcing could generate a hundred qualified leads from a job description in thirty minutes.

But AI also broke something fundamental. Candidates used ChatGPT for cover letters, Copilot for coding challenges, hidden prompts for interviews. Every asynchronous surface became gameable. Volume exploded. Signal degraded. Paradoxically, the recruiter's job became more complex, not simpler.

<div class="figures">
<div><b>93%</b><span>plagiarism detection rate reported by HackerRank</span></div>
</div>

## The crossroads, 2024 to 2025: The integrity crisis

By 2024, every asynchronous candidate submission could be compromised. The problem was structural, not just technological. Companies with large interview teams, the Googles, Metas, and Stripes, could maintain rigour. Everyone else saw signal degradation.

Karat's human interview model, live, unstaged, and conducted by trained engineers, became more valuable during the AI era, not less. By 2025 it was running five hundred interviews a day at a billion-dollar valuation.

The options were not great: human-conducted interviews that cannot be gamed (expensive), reference checks that verify actual capability (slow), or trial periods that prove competence in real time (resource-intensive). All required process changes that most companies were not ready to make.

## Era 6, 2025 onward: The race to automate everything

Mercor, valued at two billion dollars by February 2025, promised full automation: input a job description, get ranked candidates back. Moonhub was acquired by Salesforce. LinkedIn launched its Hiring Assistant. The recruiter role is shifting from coordinator to AI operator: evaluating recommendations, verifying integrity, making final calls.

The market fractured into three tribes. Consolidators (Ashby, GEM, Rippling) solving tool fragmentation. Automators (Mercor, Moonhub) solving speed. Integrity specialists (Karat, HackerRank) solving trust. Each tribe solves one piece. None solves all three.

## What comes next: The open gap

After two decades of evolution, we have arrived at an impasse. The companies consolidating workflows cannot guarantee signal integrity. The ones automating pipelines cannot verify what they are recommending. The ones providing trustworthy signal cannot do it without fragmenting the stack.

<div class="figures">
<div><b>0</b><span>vendors solving consolidation and integrity in one system</span></div>
</div>

Consolidation and integrity in a single system is the largest unresolved problem in recruiting technology.

The people who will solve it are not AI engineers who discovered recruiting last year. They are practitioners who spent fifteen to twenty years inside these systems, who understand every layer of the stack they would need to replace, and who now have the technical fluency to see what is architecturally possible.

That is the gap I am building toward.

The first proof is running at caffeine.ai: a talent acquisition function with AI as the operating layer, where self-built MCPs put the ATS, CRM, note-takers, and sourcing tools behind one LLM interface, screening runs on Claude, Scout, an AI interviewer prototype, takes first-round screens, and the interview process was redesigned with the CTO to hold signal in an AI-saturated market. Consolidation and integrity, one system, one recruiter. AI drafts, coordinates, and ranks. Humans decide.
