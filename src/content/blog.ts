import type { Post } from "./types";

/*
 * Launch blog posts. The first three come from the homepage design; bodies
 * are drafts in the owner's voice, marked for owner review.
 */
export const posts: Post[] = [
  {
    slug: "why-now",
    title: 'Your ad answered "why us." Your customer asked "why now."',
    tag: "Essay",
    hook: "Most ads explain why a brand is good. Very few explain why today is the day to act.",
    date: "2026-11-04",
    cover: { shape: "linecircle", tone: "lilac" },
    featured: true,
    takeaways: [
      "Good isn't a reason to act today. Every ad needs a why now.",
      "Borrow deadlines that already exist: long weekends, salary day, results day.",
      "Test: add '…so what, I'll do it next week' to your headline. If it has no answer, rewrite.",
    ],
    body: [
      { type: "p", text: "I used to think a good ad was one that explained why the brand was better. Better product, better price, better service. Tick, tick, tick." },
      { type: "p", text: "Then I watched a perfectly good bike rental ad do almost nothing. Great bikes. Fair prices. Lovely photo. People scrolled right past it. Nobody was against it. They just weren't in a hurry." },
      { type: "h2", text: "Two questions, one ad" },
      { type: "p", text: "Every customer quietly asks two things: **why you?** and **why now?** Most ads spend all their energy on the first one. The trouble is, good isn't a reason to act today. Good will still be good next month." },
      { type: "table", head: ["Answers why us", "Answers why now"], rows: [["Rent premium bikes at great prices.", "Long weekend in 3 days. The good bikes go first."]], caption: "Same bike. Better reason." },
      { type: "h2", text: "Where to find your why now" },
      {
        type: "list",
        items: [
          "**The calendar.** Long weekends, salary day, exam results, the first rain.",
          "**The customer's own timeline.** Moving city, a new job, a wedding in the family.",
          "**Real scarcity.** Limited stock or slots. Only if it's true.",
          "**A cost of waiting.** Prices going up, a seat filling, a habit getting harder to change.",
        ],
      },
      { type: "quote", text: "People don't buy the moment they're convinced. They buy the moment waiting starts to cost them something." },
      { type: "h2", text: "Try it on your next ad" },
      { type: "steps", items: [
        { title: "Write your headline down", text: "The one you'd ship today." },
        { title: "List three things in your customer's week", text: "Dates, deadlines, moods. Be specific." },
        { title: "Rewrite with one of them as the reason", text: "If it feels like a friend pointing at the calendar, you've got it." },
      ] },
    ],
  },
  {
    slug: "the-notification-that-said-well-wait",
    title: 'The notification that said "we\'ll wait."',
    tag: "Teardown",
    hook: "A ride app turned a delay into the nicest message on my lock screen.",
    date: "2026-11-08",
    cover: { shape: "dots", tone: "lilac" },
    takeaways: [
      "Put the information the user wants in the title. Always.",
      "Use the second line to show you noticed their situation.",
      "Give something small instead of asking for something.",
    ],
    body: [
      { type: "p", text: "I used to swipe away every delivery and ride update. They all said the same thing in the same voice. Then one stopped me: **Driver arriving in 2 min. It's raining. We'll wait a little longer.**" },
      { type: "h2", text: "Decision 1: lead with the fact" },
      { type: "p", text: "The title is pure information. Two minutes. That's what I opened the app to know, so it goes first. No brand voice, no cleverness." },
      { type: "h2", text: "Decision 2: notice the moment" },
      { type: "p", text: "\"It's raining\" tells me the app knows what my evening looks like. A tiny detail that turns a system message into something that feels observed." },
      { type: "h2", text: "Decision 3: give, don't ask" },
      { type: "p", text: "\"We'll wait a little longer\" is a small gift. No upsell, no rating request. It removes the one worry I had before I had it." },
      { type: "callout", title: "What to steal", text: "Fact first, feeling second. Two lines is the whole structure." },
    ],
  },
  {
    slug: "bike-rental-only-long-weekends",
    title: "What if a bike rental brand only advertised on long weekends?",
    tag: "Case study",
    hook: "A 3-month plan built around 6 dates, and what it might cost vs always-on ads.",
    date: "2026-11-12",
    cover: { shape: "waves", tone: "lilac" },
    takeaways: [
      "Demand for rentals bunches around a few dates; spend can follow it.",
      "Pulse budgets 5 days before each date, then go quiet.",
      "Compare cost per booking, not cost per click, against always-on.",
    ],
    body: [
      { type: "p", text: "This is a thought experiment, not a client result. The idea: instead of spreading ad money evenly, put it only where demand already spikes." },
      { type: "h2", text: "The six dates" },
      { type: "table", head: ["Window", "Why it works", "Spend share"], rows: [["Independence Day weekend", "Short trips, good weather", "20%"], ["Ganesh Chaturthi", "Long weekend in many cities", "15%"], ["Gandhi Jayanti", "Friday off for many", "15%"], ["Dussehra", "4-day break", "20%"], ["Diwali", "Home trips, local travel", "20%"], ["Christmas–New Year", "Year-end trips", "10%"]], caption: "Sample split. Dates vary by state." },
      { type: "h2", text: "How the pulse works" },
      { type: "steps", items: [
        { title: "Day −5 to −3", text: "Awareness: the date is coming, the good bikes go first." },
        { title: "Day −2 to 0", text: "Retarget visitors with a direct why-now line." },
        { title: "After the date", text: "Pause. Use organic and CRM to keep warm." },
      ] },
      { type: "p", text: "Owner note: replace with real numbers when available." },
    ],
  },
  {
    slug: "write-push-notifications-like-a-text",
    title: "Write push notifications like a text from a friend.",
    tag: "Quick tip",
    hook: "If it wouldn't make sense from a friend, it won't land from a brand.",
    date: "2026-10-30",
    cover: { shape: "lines", tone: "lilac" },
    takeaways: ["Say one specific thing.", "Use words a person would use.", "Cut every exclamation mark."],
    body: [
      { type: "p", text: "Before you send a push, read it out loud as if your friend texted it to you." },
      { type: "table", head: ["Brand shouting", "Friend texting"], rows: [["Don't miss our amazing sale!", "Your size is back. For now."]] },
      { type: "p", text: "The first one talks at a crowd. The second is someone who remembered you." },
    ],
  },
  {
    slug: "the-three-second-hook-test",
    title: "The three-second test for any hook.",
    tag: "Quick tip",
    hook: "Cover everything but the first line. Would you keep reading?",
    date: "2026-10-26",
    cover: { shape: "circles", tone: "lilac" },
    takeaways: ["Judge a hook alone, not with the post.", "Labels aren't hooks.", "A small honest reversal works."],
    body: [
      { type: "p", text: "Most hooks are judged with the whole post in view. That's not how anyone sees them." },
      { type: "steps", items: [
        { title: "Cover the rest", text: "Only the first line stays visible." },
        { title: "Count to three", text: "That's roughly how long a thumb waits." },
        { title: "Ask one question", text: "Do I need to know what happens next?" },
      ] },
      { type: "p", text: "\"5 tips for better emails\" is a label. \"I was writing emails backwards for three years\" is a hook." },
    ],
  },
  {
    slug: "the-case-for-the-ugly-ad",
    title: "The case for the ugly ad.",
    tag: "Essay",
    hook: "Polish blends in. A little friction is what stops the thumb.",
    date: "2026-10-20",
    cover: { shape: "dots", tone: "lilac" },
    takeaways: ["Feeds teach the eye to skip ad-shaped things.", "Break the format, not the quality.", "Ugly gets the stop; the idea earns the click."],
    body: [
      { type: "p", text: "The ad we almost didn't run, the one that looked a bit off, often beats the polished one. Not always. Often enough that I stopped calling it luck." },
      { type: "h2", text: "Pattern disruption, in plain English" },
      { type: "p", text: "It just means breaking what the eye expects so it stops for half a second. Half a second is all you get to earn the next three." },
      { type: "callout", title: "When to stay polished", text: "If trust is the product (money, health, luxury), messy can read as careless. Break the pattern in the format, not in the quality." },
    ],
  },
];

export const sortedPosts = () => [...posts].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
