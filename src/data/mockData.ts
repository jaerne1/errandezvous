import type { Task, MatchCandidate, ChecklistItem, ChatMessage } from "../types";

export const tasks: Task[] = [
  {
    id: "t1",
    type: "grocery",
    title: "Weekly grocery run at Trader Joe's",
    timeWindow: "Today, 5:00 - 6:00 PM",
    distance: "0.4 mi away",
    note: "Splitting a cart, could use company and someone to talk cheese with.",
    poster: { name: "Maya R.", photoColor: "#2a9d8f", initials: "MR" },
  },
  {
    id: "t2",
    type: "dryClean",
    title: "Drop off + pick up dry cleaning",
    timeWindow: "Tomorrow, 9:00 - 9:30 AM",
    distance: "0.7 mi away",
    note: "Quick errand before work, happy to grab coffee after.",
    poster: { name: "Devon K.", photoColor: "#e76f51", initials: "DK" },
  },
  {
    id: "t3",
    type: "doctor",
    title: "Company for a dentist appointment",
    timeWindow: "Fri, 2:00 - 3:30 PM",
    distance: "1.2 mi away",
    note: "Nothing scary, just don't love waiting rooms alone.",
    poster: { name: "Sam T.", photoColor: "#264653", initials: "ST" },
  },
  {
    id: "t4",
    type: "pharmacy",
    title: "Pharmacy pickup + short walk",
    timeWindow: "Today, 7:30 - 8:00 PM",
    distance: "0.3 mi away",
    note: "Picking up a prescription, could use a walking buddy after.",
    poster: { name: "Priya N.", photoColor: "#e9c46a", initials: "PN" },
  },
  {
    id: "t5",
    type: "petStore",
    title: "Pet store run for new fish tank supplies",
    timeWindow: "Sat, 11:00 AM - 12:00 PM",
    distance: "0.9 mi away",
    note: "First time setting up a tank, would love a second opinion.",
    poster: { name: "Alex F.", photoColor: "#2a9d8f", initials: "AF" },
  },
  {
    id: "t6",
    type: "errand",
    title: "Post office + hardware store combo run",
    timeWindow: "Sun, 1:00 - 2:00 PM",
    distance: "1.5 mi away",
    note: "Two boring errands, way more fun with company.",
    poster: { name: "Jordan L.", photoColor: "#e76f51", initials: "JL" },
  },
];

export const matchCandidates: MatchCandidate[] = [
  {
    id: "m1",
    name: "Riley Chen",
    age: 29,
    photoColor: "#2a9d8f",
    initials: "RC",
    bio: "Coffee enthusiast, bad at grocery lists, good at small talk.",
    task: { type: "grocery", title: "Grocery run at Sprout's", timeWindow: "Today, 6:00 PM" },
  },
  {
    id: "m2",
    name: "Jamie Ortiz",
    age: 31,
    photoColor: "#e76f51",
    initials: "JO",
    bio: "Dog dad, spreadsheet nerd, always down for an errand adventure.",
    task: { type: "dryClean", title: "Dry cleaner drop-off", timeWindow: "Tomorrow, 10:00 AM" },
  },
  {
    id: "m3",
    name: "Taylor Wu",
    age: 27,
    photoColor: "#264653",
    initials: "TW",
    bio: "Plant parent looking for someone to split a Costco haul with.",
    task: { type: "errand", title: "Costco run", timeWindow: "Sat, 1:00 PM" },
  },
];

export const checklist: ChecklistItem[] = [
  { id: "c1", label: "Milk", done: true },
  { id: "c2", label: "Eggs", done: false },
  { id: "c3", label: "Bread", done: false },
  { id: "c4", label: "Coffee beans", done: false },
];

export const chatMessages: ChatMessage[] = [
  { id: "msg1", sender: "them", text: "Hey! Excited for the grocery run later 🥦", time: "4:12 PM" },
  { id: "msg2", sender: "me", text: "Same! I'll bring reusable bags.", time: "4:14 PM" },
  { id: "msg3", sender: "them", text: "Perfect. Meet at the entrance around 5?", time: "4:15 PM" },
  { id: "msg4", sender: "me", text: "Works for me. I added a couple things to our list.", time: "4:20 PM" },
  { id: "msg5", sender: "them", text: "Nice, checking it now 👀", time: "4:21 PM" },
];

export const matchedPerson = {
  name: "Riley Chen",
  photoColor: "#2a9d8f",
  initials: "RC",
  taskTitle: "Grocery run at Sprout's",
};
