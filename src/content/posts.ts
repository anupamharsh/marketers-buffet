import type { Post } from "./types";

/*
 * Launch posts. Draft copy written in the brand voice for client review.
 * Brand names in examples are illustrative ("RideApp", "CartApp") so nothing is
 * misattributed. Swap in real, sourced examples before launch.
 */
export const posts: Post[] = [
  {
    slug: "why-now",
    title: "Your ad answered why us. Your customer asked _why now._",
    format: "essay",
    topics: ["Copy", "Strategy"],
    hook: "Most ads explain why a brand is good. Very few explain why today is the day to act.",
    publishedAt: "2026-10-14",
    featured: true,
    art: {
      kind: "compare",
      bad: "Rent premium bikes at great prices.",
      good: "Long weekend in 3 days. The good bikes go first.",
      glow: "mint",
    },
    seoDescription: "Why most ads answer the wrong question, and how a 'why now' line fixes it.",
    body: [
      { type: "p", text: "I used to think a good ad was one that explained why the brand was better. Better product, better price, better service. Tick, tick, tick." },
      { type: "p", text: "Then I watched a perfectly good bike rental ad do almost nothing. Great bikes. Fair prices. Lovely photo. People scrolled right past it." },
      { type: "p", text: "Nobody was against it. They just weren't in a hurry." },
      { type: "h2", text: "Two questions, one ad" },
      { type: "p", text: "Every customer is quietly asking two things. **Why you?** and **why now?** Most ads spend all their energy on the first one." },
      { type: "p", text: "The trouble is, \"good\" isn't a reason to act today. Good can wait. Good will still be good next month." },
      { type: "compare", bad: "Rent premium bikes at great prices.", good: "Long weekend in 3 days. The good bikes go first.", caption: "Same bike. Better reason." },
      { type: "p", text: "The second line doesn't invent a fake countdown. It borrows a deadline that already exists in the customer's life: a long weekend, and the very real chance that the nice bikes get booked." },
      { type: "h2", text: "Where to find your why now" },
      { type: "p", text: "You don't need a sale to create urgency. Look for moments that are already happening." },
      {
        type: "list",
        items: [
          "**The calendar.** Long weekends, salary day, exam results, the first rain.",
          "**The customer's own timeline.** Moving house, a new job, a wedding in the family.",
          "**Real scarcity.** Limited stock, limited slots. Only if it's true.",
          "**A cost of waiting.** Prices going up, a seat filling, a habit getting harder to change.",
        ],
      },
      { type: "callout", title: "A quick test", text: "Read your headline and add \"…so what, I'll do it next week\" to the end. If the ad has no answer, it's missing a why now." },
      { type: "h2", text: "Why this works" },
      { type: "p", text: "People don't buy the moment they're convinced. They buy the moment it feels like waiting costs them something. Psychologists call it loss aversion. In plain English: we hate missing out more than we like getting a deal." },
      { type: "quote", text: "Real moments don't need to shout." },
      { type: "p", text: "The best why-now lines feel less like pressure and more like a friend pointing at the calendar. That's the bar." },
      { type: "h2", text: "Try it on your next ad" },
      {
        type: "list",
        ordered: true,
        items: [
          "Write your current headline down.",
          "List three things happening in your customer's week.",
          "Rewrite the headline so one of those things is the reason to act.",
        ],
      },
      { type: "p", text: "What's your best why-now line? I'm collecting them for the [library](/library)." },
    ],
  },
  {
    slug: "the-ugly-ad",
    title: "The case for the _ugly_ ad.",
    format: "essay",
    topics: ["Creative", "Psychology"],
    hook: "Polish blends in. A little friction is what stops the thumb.",
    publishedAt: "2026-10-02",
    art: { kind: "quote", text: "Nobody reads ads. They read _moments._", glow: "lavender" },
    seoDescription: "Pattern disruption, and why the ad that looks a bit wrong often wins.",
    body: [
      { type: "p", text: "Here's a thing I keep seeing in tests. The ad we almost didn't run, the one that looked a bit off, beats the polished one." },
      { type: "p", text: "Not always. But often enough that I stopped calling it luck." },
      { type: "h2", text: "Feeds are a sea of polish" },
      { type: "p", text: "Open any feed and count the ads that look like ads. Perfect lighting, brand colours, a headline in the top third, a logo bottom-right. Your brain has seen ten thousand of them. It has learned to skip the shape before it reads a word." },
      { type: "p", text: "That's the real competition. Not other brands. The thumb." },
      { type: "h2", text: "Pattern disruption, in plain English" },
      { type: "p", text: "Pattern disruption just means breaking what the eye expects, so it stops for half a second. Half a second is all you get to earn the next three." },
      {
        type: "table",
        head: ["What the feed expects", "What breaks the pattern"],
        rows: [
          ["Studio photo", "A phone photo of a real desk"],
          ["Big brand logo", "No logo until the last frame"],
          ["Headline in brand font", "A screenshot of a text message"],
          ["Smiling model", "A hand, mid-task"],
        ],
        caption: "Sample patterns. Test, don't copy.",
      },
      { type: "callout", title: "Ugly isn't lazy", text: "The ad still needs one clear idea. Ugly gets the stop. The idea earns the click. Without the idea you've just made a bad ad that people noticed." },
      { type: "h2", text: "When to stay polished" },
      { type: "p", text: "If you're selling something where trust is the whole product (money, health, luxury), messy can read as careless. Break the pattern in the format, not in the quality." },
      { type: "p", text: "Same product. Different day. That's usually all it takes." },
    ],
  },
  {
    slug: "teardown-the-rain-notification",
    title: "Teardown: the notification that said _we'll wait._",
    format: "teardown",
    topics: ["Copy", "CRM"],
    hook: "A ride app turned a delay into the nicest message on my lock screen.",
    publishedAt: "2026-10-09",
    featured: true,
    art: {
      kind: "notification",
      app: "RideApp",
      appLetter: "R",
      title: "Driver arriving in 2 min",
      body: "It's raining. We'll wait a little longer.",
      time: "now",
      glow: "both",
    },
    seoDescription: "A slide-by-slide teardown of a push notification that turned a delay into goodwill.",
    body: [
      { type: "p", text: "I used to swipe away every delivery and ride update. They all said the same thing in the same voice. Then one stopped me." },
      { type: "notification", app: "RideApp", appLetter: "R", title: "Driver arriving in 2 min", body: "It's raining. We'll wait a little longer.", caption: "Illustrative recreation" },
      { type: "h2", text: "Decision 1: Lead with the fact" },
      { type: "p", text: "The title is pure information. Two minutes. That's what I opened the app to know, so it goes first. No brand voice, no cleverness. Just the answer." },
      { type: "h2", text: "Decision 2: Notice the moment" },
      { type: "p", text: "\"It's raining\" tells me the app knows what my evening looks like. It's a tiny detail, but it turns a system message into something that feels observed." },
      { type: "h2", text: "Decision 3: Give, don't ask" },
      { type: "p", text: "\"We'll wait a little longer\" is a small gift. No upsell, no rating request. It removes the one worry I had (running out in the rain) before I had it." },
      { type: "stat", value: "2 lines", text: "Fact first. Feeling second. That's the whole structure." },
      { type: "h2", text: "What to steal" },
      {
        type: "list",
        items: [
          "Put the information the user wants in the title. Always.",
          "Use the second line to show you noticed their situation.",
          "Offer something small and useful instead of asking for something.",
        ],
      },
      { type: "p", text: "Real moments don't need to shout. They just need to be noticed." },
    ],
  },
  {
    slug: "teardown-cart-email",
    title: "Teardown: a cart email that _didn't beg._",
    format: "teardown",
    topics: ["Email", "Copy"],
    hook: "No countdown, no 10% off. Just one line that sounded like a person.",
    publishedAt: "2026-09-26",
    art: {
      kind: "notification",
      app: "CartApp",
      appLetter: "C",
      title: "You left something behind",
      body: "Your cart misses you a little.",
      time: "2m ago",
      glow: "mint",
    },
    seoDescription: "Why an abandoned cart message with no discount can outperform the usual nagging.",
    body: [
      { type: "p", text: "Abandoned cart emails are usually the most desperate thing a brand sends. Countdown timers, red banners, \"Last chance!!\" for the fourth time this week." },
      { type: "p", text: "This one just said: your cart misses you a little." },
      { type: "h2", text: "Why the soft line works" },
      { type: "p", text: "Most people leave a cart for boring reasons. The tea got cold. The boss walked in. The phone died. They didn't decide against you; they got distracted." },
      { type: "p", text: "So the job of the message is a gentle nudge, not a negotiation. A discount answers a question nobody asked, and teaches people to wait for the next one." },
      { type: "compare", bad: "Hurry! Your items are selling out. Complete your order NOW.", good: "You left something behind. Your cart misses you a little.", caption: "Tone, not tactics" },
      { type: "h2", text: "The three choices" },
      {
        type: "list",
        ordered: true,
        items: [
          "**A human subject line.** It reads like a note, so it gets opened like one.",
          "**One product image, no grid.** The thing they wanted, not everything you sell.",
          "**One button.** \"Back to cart\". Not \"Shop now\", not \"Explore\".",
        ],
      },
      { type: "callout", title: "When to add an offer", text: "Save discounts for the second or third reminder, and only for carts above your average order value. Test it against no offer at all. You might be surprised." },
    ],
  },
  {
    slug: "push-like-a-text",
    title: "Write push notifications like a _text from a friend._",
    format: "quick-tip",
    topics: ["Copy"],
    hook: "If it wouldn't make sense coming from a friend, it won't land from a brand.",
    publishedAt: "2026-10-16",
    art: { kind: "compare", bad: "Don't miss our amazing sale!", good: "Your size is back. For now.", glow: "lavender" },
    body: [
      { type: "p", text: "Before you send a push, read it out loud as if your friend texted it to you." },
      { type: "compare", bad: "Don't miss our amazing sale!", good: "Your size is back. For now.", caption: "Copy rewrite" },
      { type: "p", text: "The first one is a brand talking at a crowd. The second is someone who remembered you." },
      { type: "list", items: ["Say one specific thing.", "Use the words a person would use.", "Cut every exclamation mark. Then cut one more."] },
      { type: "p", text: "Save this for your next campaign." },
    ],
  },
  {
    slug: "three-second-hook-test",
    title: "The ==three-second== test for any hook.",
    format: "quick-tip",
    topics: ["Hooks"],
    hook: "Cover everything but the first line. Would you keep reading?",
    publishedAt: "2026-09-30",
    art: { kind: "stat", value: "3s", text: "to earn the next line", glow: "mint" },
    body: [
      { type: "p", text: "Most hooks are judged with the whole post in view. That's not how anyone sees them." },
      { type: "h2", text: "The test" },
      { type: "list", ordered: true, items: ["Cover everything except the first line.", "Count to three.", "Ask: do I need to know what happens next?"] },
      { type: "p", text: "If the answer is \"meh\", the hook is a label, not a hook. \"5 tips for better emails\" is a label. \"I was writing emails backwards for three years\" is a hook." },
      { type: "callout", title: "Formula worth keeping", text: "\"I was doing X. Turns out it was Y.\" It works because it promises a small, honest reversal." },
    ],
  },
  {
    slug: "ai-twenty-hooks-keep-two",
    title: "Use AI for twenty hooks, then _keep two._",
    format: "ai-workflow",
    topics: ["AI", "Hooks"],
    hook: "AI is great at volume and bad at taste. Here's the split that works for me.",
    publishedAt: "2026-10-06",
    art: { kind: "search", query: "20 hooks for a long-weekend bike rental ad", glow: "both" },
    body: [
      { type: "p", text: "I use AI the way I'd use an eager intern: lots of options, fast, and none of them final." },
      { type: "h2", text: "The workflow" },
      {
        type: "list",
        ordered: true,
        items: [
          "Give it the product, the customer and the moment (the why now).",
          "Ask for 20 hooks in 4 styles: question, reversal, number, confession.",
          "Delete anything you'd be embarrassed to say out loud.",
          "Keep two. Rewrite both in your own words.",
        ],
      },
      { type: "h3", text: "The prompt I start with" },
      {
        type: "code",
        lang: "text",
        code: "Product: weekend bike rentals in Bengaluru\nCustomer: 24-32, plans trips last minute\nMoment: long weekend in 3 days, good bikes book out\n\nWrite 20 hooks under 10 words.\n5 questions, 5 reversals, 5 with a number, 5 confessions.\nNo exclamation marks. No \"unlock\", \"hack\" or \"game-changer\".",
      },
      { type: "callout", title: "The part AI can't do", text: "It can't tell which line sounds like you. That's the job. Volume from the machine, taste from you." },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const sortedPosts = () => [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function readingTime(post: Post) {
  const words = post.body
    .map((b) => {
      switch (b.type) {
        case "list":
          return b.items.join(" ");
        case "table":
          return [...b.head, ...b.rows.flat()].join(" ");
        case "code":
          return b.code;
        case "compare":
          return `${b.bad} ${b.good}`;
        case "notification":
          return `${b.title} ${b.body}`;
        case "stat":
          return `${b.value} ${b.text}`;
        default:
          return b.text;
      }
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function relatedPosts(post: Post, n = 3) {
  return sortedPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score: (p.format === post.format ? 1 : 0) + p.topics.filter((t) => post.topics.includes(t)).length * 2,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.p);
}
