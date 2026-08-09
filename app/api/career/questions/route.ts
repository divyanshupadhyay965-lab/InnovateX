
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const selectedFields: string[] =
      Array.isArray(body.selectedFields)
        ? body.selectedFields
        : [];

    const customField: string =
      typeof body.customField === "string"
        ? body.customField.trim()
        : "";

    if (
      selectedFields.length === 0 &&
      !customField
    ) {
      return NextResponse.json(
        {
          error: "No career fields were selected.",
        },
        { status: 400 }
      );
    }

    const allFields = [
      ...selectedFields,
      ...(customField
        ? [`Custom field: ${customField}`]
        : []),
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    /*
     * A random seed makes repeated requests less likely
     * to produce the exact same question set.
     */
    const variationSeed =
      Math.floor(Math.random() * 1000000);

    const prompt = `
You are the adaptive question-generation engine
for InnovateX, an AI career discovery platform
for students.

The student selected these fields:

${allFields.join(", ")}

VARIATION SEED:
${variationSeed}

Your task is to generate EXACTLY 4 questions
that help determine which careers within the
student's selected fields fit them best.

========================================
VERY IMPORTANT
========================================

The questions MUST be specifically influenced
by the selected fields.

Do NOT generate generic career questions that
could be asked to every student.

For example, if the field is:

MEDICINE

Questions could explore:
- diagnosing unusual problems
- understanding the human body
- patient interaction
- medical research
- emergency situations
- improving healthcare
- biological investigation

Do NOT ask generic questions such as:
"What do you enjoy doing?"
"What is your working style?"

unless the question is strongly connected to
the selected field.

If the field is:

TECHNOLOGY

Questions could explore:
- building software
- solving technical problems
- designing systems
- creating new technology
- debugging
- automation
- AI/data
- cybersecurity
- hardware

If the field is:

SPACE

Questions could explore:
- spacecraft
- planetary exploration
- astronomy
- space missions
- extreme environments
- satellite systems
- discovering unknown phenomena

If the fields are:

MEDICINE + TECHNOLOGY

Focus on their INTERSECTION:

- medical technology
- medical devices
- health software
- diagnostics
- biomedical systems
- healthcare AI
- patient monitoring
- scientific data

========================================
QUESTION VARIETY
========================================

The 4 questions MUST test four different dimensions.

QUESTION 1:
Explore what type of problem the student would
most enjoy solving.

QUESTION 2:
Explore what kind of activity or environment
the student would prefer.

QUESTION 3:
Explore what kind of impact or outcome matters
most to the student.

QUESTION 4:
Use a realistic scenario or challenge related
to the selected field(s).

Do NOT repeat the same underlying idea.

Each question should feel noticeably different.

========================================
AVOID REPETITION
========================================

Do NOT repeatedly use phrases such as:

"What would you rather..."
"What interests you most..."
"Which would you prefer..."
"What sounds most exciting..."

Use varied natural wording.

For example:

"Imagine you are given one month to improve
something in healthcare. What would you tackle?"

"Your team discovers a problem during a space
mission. What role would you naturally take?"

"Which kind of breakthrough would feel most
meaningful to you?"

"Suppose a device is failing during an important
medical procedure. What would you want to figure
out first?"

========================================
IMPORTANT CAREER RULE
========================================

Do NOT directly ask:

"Which career do you want?"

Do NOT put obvious career names in every option.

The student should reveal their preferences
through their choices.

The questions should help distinguish between
different careers within the selected field(s).

========================================
OPTIONS
========================================

Every question must have EXACTLY 5 options.

The first four options must represent genuinely
different preferences.

The fifth option MUST be:

"Something else"

Do not make all four main options variations
of the same preference.

========================================
STUDENT LEVEL
========================================

The student is a school student.

Use simple, engaging language.

Avoid university-level terminology unless it
is necessary for the selected field.

Questions should feel interesting rather than
like an exam.

========================================
OUTPUT
========================================

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not write anything outside the JSON.

Return EXACTLY this structure:

{
  "questions": [
    {
      "id": "q1",
      "question": "",
      "subtitle": "",
      "options": [
        "",
        "",
        "",
        "",
        "Something else"
      ]
    },
    {
      "id": "q2",
      "question": "",
      "subtitle": "",
      "options": [
        "",
        "",
        "",
        "",
        "Something else"
      ]
    },
    {
      "id": "q3",
      "question": "",
      "subtitle": "",
      "options": [
        "",
        "",
        "",
        "",
        "Something else"
      ]
    },
    {
      "id": "q4",
      "question": "",
      "subtitle": "",
      "options": [
        "",
        "",
        "",
        "",
        "Something else"
      ]
    }
  ]
}

FINAL CHECK BEFORE RESPONDING:

- Exactly 4 questions.
- Exactly 5 options per question.
- Last option is "Something else".
- Every question is relevant to:
  ${allFields.join(", ")}
- Questions are substantially different.
- No generic copy-paste career questions.
- No repeated question structures.
- No direct career-choice question.
- Options are meaningful and distinct.
- Valid JSON only.
`;

    const result =
      await model.generateContent(prompt);

    const text =
      result.response.text().trim();

    console.log(
      "RAW CAREER QUESTIONS RESPONSE:"
    );
    console.log(text);

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error(
        "Invalid Gemini JSON:",
        cleaned
      );

      return NextResponse.json(
        {
          error:
            "Gemini returned invalid JSON.",
        },
        { status: 500 }
      );
    }

    if (
      !parsed ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length !== 4
    ) {
      console.error(
        "Invalid question structure:",
        parsed
      );

      return NextResponse.json(
        {
          error:
            "AI returned an invalid question structure.",
        },
        { status: 500 }
      );
    }

    for (const question of parsed.questions) {
      if (
        !question ||
        typeof question.id !== "string" ||
        typeof question.question !== "string" ||
        typeof question.subtitle !== "string" ||
        !Array.isArray(question.options) ||
        question.options.length !== 5
      ) {
        return NextResponse.json(
          {
            error:
              "AI returned an incomplete question.",
          },
          { status: 500 }
        );
      }

      if (
        question.options[4] !==
        "Something else"
      ) {
        return NextResponse.json(
          {
            error:
              'Every question must contain "Something else" as the fifth option.',
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      questions: parsed.questions,
    });
  } catch (error: any) {
    console.error(
      "CAREER QUESTIONS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to generate career questions.",
      },
      { status: 500 }
    );
  }
}

