/*
 * Social Styles Self-Assessment — content.
 * All item wording and interpretation text is taken from
 * the Self-Assessment of Social Styles questionnaire (spelling corrected only).
 */
window.SS_CONTENT = {
  /* Page 1 — Assertiveness Ratings. Left word scores 1, right word scores 4. */
  assertiveness: [
    ["Quiet", "Talkative"],
    ["Slow to Decide", "Fast to Decide"],
    ["Going along", "Taking charge"],
    ["Supportive", "Challenging"],
    ["Compliant", "Dominant"],
    ["Deliberate", "Fast to Decide"],
    ["Asking questions", "Making statements"],
    ["Cooperative", "Competitive"],
    ["Avoiding risks", "Taking risks"],
    ["Slow, studied", "Fast-paced"],
    ["Cautious", "Carefree"],
    ["Indulgent", "Firm"],
    ["Nonassertive", "Assertive"],
    ["Mellow", "Matter-of-fact"],
    ["Reserved", "Outgoing"]
  ],

  /* Page 1 — Responsiveness Ratings. Left word scores 4, right word scores 1. */
  responsiveness: [
    ["Open", "Closed"],
    ["Impulsive", "Deliberate"],
    ["Using opinions", "Using facts"],
    ["Informal", "Formal"],
    ["Emotional", "Unemotional"],
    ["Easy to know", "Hard to know"],
    ["Warm", "Cool"],
    ["Excitable", "Calm"],
    ["Animated", "Poker-faced"],
    ["People-oriented", "Task-oriented"],
    ["Spontaneous", "Cautious"],
    ["Responsive", "Nonresponsive"],
    ["Humorous", "Serious"],
    ["Impulsive", "Methodical"],
    ["Lighthearted", "Intense"]
  ],

  /* Page 2 — scale definitions. */
  dimensions: {
    assertiveness: {
      name: "Assertiveness",
      alias: "Dominance",
      text: "The degree to which a person attempts to control situations or the thoughts and actions of others.",
      low: "Low Assertive “Asking”",
      high: "High Assertive “Telling”"
    },
    responsiveness: {
      name: "Responsiveness",
      alias: "Sociability",
      text: "The readiness with which a person outwardly displays emotions or feelings and develops relationships.",
      low: "Low Responsive “Controlled”",
      high: "High Responsive “Emotional”"
    }
  },

  styles: {
    Driver: {
      key: "Driver",
      adjective: "Driving",
      axes: "Low Responsiveness, High Assertiveness",
      temperament: "Sensor",
      temperamentText: "Quick reactions to here and now sensory input",
      /* Page 4 */
      description: [
        "Drivers are task orientated and expect efficiency from everyone they come into contact with. Little emphasis is placed on building relationships with other people. They can be perceived as aggressive and uncaring, especially by amiables, though are often needed to take risks and push things through. In conflict, they will try to “steam roller” over anyone who comes in their way."
      ],
      characteristics: "Task orientated, clearly defined goals, committed, determined, risk takers, efficient.",
      inConflict: "Aggressive, rude, abrupt.",
      solutions: "Be assertive and firm, have a solution to the problem, listen.",
      basicNeed: "To be in control",
      /* Page 5 */
      specialist: "Control specialists.",
      traits: [
        "Decisive in action and decision making",
        "Likes control; dislikes inaction",
        "Prefers maximum freedom to manage self and others",
        "Cool, independent, and competitive with others",
        "Low tolerance for feelings, attitudes, and advice of others",
        "Works quickly and impressively alone",
        "Seeks esteem and self-actualization",
        "Has good administrative skills"
      ],
      /* Page 6 — Style Summary column */
      summary: {
        backupStyle: "Autocratic",
        measuresValuesBy: "Results",
        growthNeedsTo: "Listen",
        needsClimateThat: "Allows to build own structure",
        takesTimeToBe: "Efficient",
        supportTheir: "Conclusions and actions",
        presentBenefitsThatTell: "What",
        forDecisionsGiveThem: "Options and probabilities",
        specialty: "Controlling"
      },
      backupExplained: "Under pressure the Driver takes over and pushes. In the words of the questionnaire, they “steam roller” over anyone who comes in their way and can come across as aggressive, rude and abrupt."
    },

    Expressive: {
      key: "Expressive",
      adjective: "Expressive",
      axes: "High Responsiveness, High Assertiveness",
      temperament: "Intuitive",
      temperamentText: "Imagination and thought",
      description: [
        "The expressive likes the company of other people, though unlike, the amiable this is because they need to “express” themselves. Amiables complement them very well, unless the expressive becomes too aggressive and puts them off.",
        "They can be good people to have at a party, because they’re enthusiastic, dramatic and “interesting” people to have around. However, if they don’t receive the attention they crave, they can get upset and even “difficult” to deal with.",
        "In conflict, they become emotional, prone to exaggeration and unpredictable. The best way to deal with this is to let them calm down. Try not to fuel the fire by saying anything controversial."
      ],
      characteristics: "People orientated, centre of attention, positive, emotional, talkative, enthusiastic, dramatic.",
      inConflict: "Unpredictable, emotional.",
      solutions: "Allow them time to gain composure, Ask questions, problem solve.",
      basicNeed: "Recognition",
      specialist: "Social specialists.",
      traits: [
        "Spontaneous actions and decisions",
        "Likes involvement",
        "Exaggerates and generalizes",
        "Tends to dream and get others caught up in those dreams",
        "Jumps from one activity to another",
        "Works quickly and excitedly with others",
        "Seeks esteem and group identification",
        "Has good persuasive skills"
      ],
      summary: {
        backupStyle: "Attacker",
        measuresValuesBy: "Applause",
        growthNeedsTo: "Check",
        needsClimateThat: "Inspires to reach goals",
        takesTimeToBe: "Stimulating",
        supportTheir: "Dreams and Intuition",
        presentBenefitsThatTell: "Who",
        forDecisionsGiveThem: "Testimonials and incentives",
        specialty: "Socializing"
      },
      backupExplained: "Under pressure the Expressive goes on the offensive with feeling. The questionnaire describes them in conflict as emotional, prone to exaggeration and unpredictable."
    },

    Amiable: {
      key: "Amiable",
      adjective: "Amiable",
      axes: "High Responsiveness, Low Assertiveness",
      temperament: "Feeling",
      temperamentText: "Emotional and personal reactions to experiences",
      description: [
        "The amiable person likes other people’s company, though is more of a listener than a talker. Expressive people find them useful, because they are prepared to listen to what they are saying. They are loyal, personable and show patience when dealing with other people.",
        "They may however not be perceived as people “who get things done” because they spend more time developing relationships with others. They are also unlikely to take risks as they need to have the feeling of security.",
        "In difficult situations, they are likely to avoid the situation and lack conviction of their feelings and if pushed likely to make promises that they cannot keep. Drivers often find them frustrating because they want a straight answer and the amiable can find this difficult to deliver."
      ],
      characteristics: "Loyal, personable, patient, Uncomfortable with risk, Non-Confrontational, Dislike pressure, Enjoy the company of others.",
      inConflict: "Likely to be “passive”, lack conviction, avoidance.",
      solutions: "Reassure, Support, Confirm commitment.",
      basicNeed: "Security",
      specialist: "Support specialists.",
      traits: [
        "Slow in making decisions or taking actions",
        "Likes close, personal relationships",
        "Dislikes interpersonal conflict",
        "Supports and actively listens to others",
        "Weak in goal setting and self-direction",
        "Seeks security and identification with a group",
        "Has good counseling and listening skills"
      ],
      summary: {
        backupStyle: "Acquiescer",
        measuresValuesBy: "Security",
        growthNeedsTo: "Initiate",
        needsClimateThat: "Provides Details",
        takesTimeToBe: "Agreeable",
        supportTheir: "Relationships and feelings",
        presentBenefitsThatTell: "Why",
        forDecisionsGiveThem: "Guarantees and assurances",
        specialty: "Supporting"
      },
      backupExplained: "Under pressure the Amiable gives in to keep the peace. The questionnaire describes them in conflict as passive, lacking conviction and avoiding the situation, and if pushed, likely to make promises they cannot keep."
    },

    Analytical: {
      key: "Analytical",
      adjective: "Analytical",
      axes: "Low Responsiveness, Low Assertiveness",
      temperament: "Thinking",
      temperamentText: "Logically organizing and analyzing data",
      description: [
        "Analytical people can appear unsociable, especially to Amiables and Expressives. They may seem serious and indecisive. This is because they need to look at every conceivable angle before they feel satisfied. A consequence of this is that they are persistent in their questioning and focus on detail and facts. However, once they have made a decision, they stick with it as they invariably feel that it is infallible.",
        "In conflict, they can “whine”, become sarcastic and are often negative."
      ],
      characteristics: "Serious, mull matters over, Indecisive, persistent, ask lots of questions, attention to detail.",
      inConflict: "Whining, sarcastic, negative.",
      solutions: "Keep to the facts, Don’t agree with them, listen attentively.",
      basicNeed: "To be correct",
      specialist: "Technical specialists.",
      traits: [
        "Likes organization and structure",
        "Dislikes involvement",
        "Asks specific questions",
        "Prefers objective, task-oriented, intellectual work",
        "Wants to be right, so collects much data",
        "Works slowly, precisely, and alone",
        "Seeks security and self-actualization",
        "Has good problem-solving skills"
      ],
      summary: {
        backupStyle: "Avoider",
        measuresValuesBy: "Accuracy “Being Right”",
        growthNeedsTo: "Decide",
        needsClimateThat: "Suggests",
        takesTimeToBe: "Accurate",
        supportTheir: "Principles and thinking",
        presentBenefitsThatTell: "How",
        forDecisionsGiveThem: "Evidence and service",
        specialty: "Technical"
      },
      backupExplained: "Under pressure the Analytical pulls back from the situation rather than confront it. The questionnaire describes them in conflict as whining, sarcastic and negative."
    }
  },

  summaryRows: [
    ["backupStyle", "Backup Style"],
    ["measuresValuesBy", "Measures Personal Values By"],
    ["growthNeedsTo", "For Growth Needs to"],
    ["needsClimateThat", "Needs climate that"],
    ["takesTimeToBe", "Takes time to be"],
    ["supportTheir", "Support their"],
    ["presentBenefitsThatTell", "Present benefits that tell"],
    ["forDecisionsGiveThem", "For decisions give them"],
    ["specialty", "Their specialty is"]
  ],

  /* Page 6 — The Interaction of Styles */
  interactions: [
    { a: "Analytical", b: "Amiable", shared: "Low Assertiveness", conflict: "Priorities", agreement: "Pace" },
    { a: "Driver", b: "Expressive", shared: "High Assertiveness", conflict: "Priorities", agreement: "Pace" },
    { a: "Analytical", b: "Driver", shared: "Low Responsiveness", conflict: "Pace", agreement: "Priorities" },
    { a: "Amiable", b: "Expressive", shared: "High Responsiveness", conflict: "Pace", agreement: "Priorities" },
    { a: "Analytical", b: "Expressive", shared: "", conflict: "Both", agreement: "" },
    { a: "Amiable", b: "Driver", shared: "", conflict: "Both", agreement: "" }
  ],
  styleFlexing: "Style flexing is the ability to adjust your style to meet that of your prospect.",

  /* Explanations of terms the questionnaire uses without defining. Derived from the questionnaire itself. */
  glossary: {
    pace: "Pace is how quickly a person decides and acts. It follows the Assertiveness scale (for example “Slow to Decide … Fast to Decide” and “Slow, studied … Fast-paced”). Styles on the same side of that scale share a pace.",
    priorities: "Priorities are what a person puts first: people and feelings, or tasks and facts. They follow the Responsiveness scale (for example “People-oriented … Task-oriented”). Styles on the same side of that scale share priorities.",
    backup: "A backup style is how a style tends to behave under stress or in conflict, when its basic need is not being met."
  }
};
