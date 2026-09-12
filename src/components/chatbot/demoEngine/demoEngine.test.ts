import { describe, expect, it } from "vitest";
import { generateReply } from "./responses";
import { CHATBOT_STARTER_PROMPTS } from "@/content/chatbot";

describe("generateReply", () => {
  it.each(CHATBOT_STARTER_PROMPTS)("answers the starter prompt %j with a grounded, linked reply", (prompt) => {
    const reply = generateReply(prompt);

    expect(reply.isRefusal).toBe(false);
    expect(reply.isFallback).toBe(false);
    expect(reply.text.length).toBeGreaterThan(0);
    expect(reply.link).toBeDefined();
    expect(reply.link?.to).toMatch(/^\//);
  });

  it("falls back to the explicit out-of-scope message for an unrelated question", () => {
    const reply = generateReply("What's the weather in Tokyo tomorrow?");

    expect(reply.isRefusal).toBe(false);
    expect(reply.isFallback).toBe(true);
    expect(reply.text).toMatch(/don't have that information/i);
    // The fallback still points somewhere useful rather than a dead end.
    expect(reply.link?.to).toBe("/request-demo");
  });

  it("refuses input shaped like patient information (diagnosis wording)", () => {
    const reply = generateReply("Can you look up this patient's diagnosis for me?");

    expect(reply.isRefusal).toBe(true);
    expect(reply.isFallback).toBe(false);
    expect(reply.text).toMatch(/can't take in patient information/i);
  });

  it("refuses input containing an SSN-shaped string", () => {
    const reply = generateReply("Here's my info: 123-45-6789, can you pull up my record?");

    expect(reply.isRefusal).toBe(true);
    expect(reply.text).toMatch(/can't take in patient information/i);
  });

  it("surfaces the Request a Demo intent for pricing/demo questions", () => {
    const reply = generateReply("How much does this cost?");

    expect(reply.showDemoCta).toBe(true);
  });
});
