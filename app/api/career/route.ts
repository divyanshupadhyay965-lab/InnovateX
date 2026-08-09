
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

    const answers =
      body.answers && typeof body.answers === "object"
        ? body.answers
        : {};

    const customAnswers =
      body.customAnswers &&
      typeof body.customAnswers === "object"
        ? body.customAnswers
        : {};

    /* =========================================
       VALIDATE INPUT
    ========================================= */

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

    /* =========================================
       BUILD FIELD LIST
    ========================================= */

    const allFields = [
      ...selectedFields,
      ...(customField
        ? [`Custom field: ${customField}`]
        : []),
    ];

    /* =========================================
       FORMAT ANSWERS
    ========================================= */

    const formattedAnswers = Object.entries(
      answers
    )
      .map(([questionId, answer]) => {
        const answerList = Array.isArray(answer)
          ? answer.join(", ")
          : String(answer || "");

        const customAnswer =
          typeof customAnswers[questionId] ===
          "string"
            ? customAnswers[questionId]
            : "";

        return `
Question ${questionId}:
Selected: ${answerList || "None"}
Custom response: ${
          customAnswer.trim() || "None"
        }
`;
      })
      .join("\n");

    /* =========================================
       GEMINI MODEL
    ========================================= */

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    /* =========================================
       CAREER ANALYSIS PROMPT
    ========================================= */

    const prompt = `
You are the InnovateX AI Career Engine.

Your job is to analyse a student's interests,
selected fields, and answers and recommend careers
that genuinely match the student's chosen fields.

CRITICAL RULE:

The student's selected fields are the strongest
constraint.

You MUST recommend careers that belong to or
meaningfully connect to the selected fields.

NEVER ignore the selected fields.

For example:

If the student selected:
"Medicine"

Do NOT recommend:
- AI Engineer
- Software Engineer
- Web Developer

unless the student's selected field also includes
Technology/Computer Science or another field that
clearly supports that career.

Instead recommend careers such as:
- Doctor
- Surgeon
- Medical Researcher
- Biomedical Engineer
- Pharmacologist
- Radiologist
- Medical Laboratory Scientist

If the student selected:

"Technology + Medicine"

You may recommend intersection careers such as:
- Biomedical Engineer
- Health-Tech Engineer
- Medical AI Researcher
- Bioinformatics Scientist

If the student selected multiple fields,
prefer careers that sit at the INTERSECTION of
those fields when appropriate.

Do not force an intersection if it would produce
unrealistic careers.

=========================================
STUDENT SELECTED FIELDS
=========================================

${allFields.join(", ")}

=========================================
STUDENT ANSWERS
=========================================

${formattedAnswers || "No detailed answers provided."}

=========================================
ANALYSIS RULES
=========================================

1. Selected fields are the primary constraint.

2. Student answers determine which careers inside
   those fields are the strongest matches.

3. Do not recommend a career simply because it is
   popular.

4. Do not recommend unrelated careers.

5. If the student selected one field, keep ALL
   recommended careers within that field or in a
   very closely related discipline.

6. If the student selected multiple fields,
   prioritize careers combining those fields.

7. Use the student's answers to determine:
   - interests
   - motivation
   - preferred activities
   - subjects they enjoy
   - working style
   - desired impact

8. Match scores must reflect the actual answers.

9. Do not give every career a score above 90.

10. Return exactly 4 different careers.

11. Sort careers from highest match to lowest match.

12. Skills must be realistic for the career.

13. Keep the explanation student-friendly.

=========================================
OUTPUT FORMAT
=========================================

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not write anything before or after the JSON.

Return EXACTLY:

{
  "careers": [
    {
      "name": "Career name",
      "match": 85,
      "description": "Short student-friendly description.",
      "reason": "Explain specifically why this career matches the student's selected fields and answers.",
      "skills": [
        "Skill 1",
        "Skill 2",
        "Skill 3",
        "Skill 4"
      ],
      "future": "Short explanation of future opportunities in this career."
    }
  ]
}

=========================================
FINAL VALIDATION BEFORE RESPONDING
=========================================

Before returning the JSON, check:

- Exactly 4 careers.
- Every career is relevant to the selected fields.
- No unrelated career slipped into the list.
- Match scores are realistic.
- Careers are sorted highest to lowest.
- Every career has 3-6 skills.
- Every career has a specific reason.
- Every career has a future paragraph.
- JSON is valid.
`;

    /* =========================================
       GENERATE RESPONSE
    ========================================= */

    const result =
      await model.generateContent(prompt);

    const text =
      result.response.text().trim();

    console.log(
      "RAW GEMINI CAREER RESPONSE:"
    );

    console.log(text);

    /* =========================================
       CLEAN GEMINI RESPONSE
    ========================================= */

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    /* =========================================
       PARSE JSON
    ========================================= */

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini JSON:",
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

    /* =========================================
       VALIDATE CAREERS
    ========================================= */

    if (
      !parsed ||
      !Array.isArray(parsed.careers) ||
      parsed.careers.length !== 4
    ) {
      console.error(
        "Invalid Gemini career structure:",
        parsed
      );

      return NextResponse.json(
        {
          error:
            "Gemini returned an invalid career structure.",
        },
        { status: 500 }
      );
    }

    for (const career of parsed.careers) {
      if (
        !career ||
        typeof career.name !== "string" ||
        typeof career.match !== "number" ||
        typeof career.description !== "string" ||
        typeof career.reason !== "string" ||
        !Array.isArray(career.skills) ||
        career.skills.length < 3 ||
        career.skills.length > 6 ||
        typeof career.future !== "string"
      ) {
        console.error(
          "Invalid career object:",
          career
        );

        return NextResponse.json(
          {
            error:
              "Gemini returned an incomplete career.",
          },
          { status: 500 }
        );
      }

      if (
        career.match < 0 ||
        career.match > 100 ||
        !Number.isInteger(career.match)
      ) {
        return NextResponse.json(
          {
            error:
              "Gemini returned an invalid career match score.",
          },
          { status: 500 }
        );
      }
    }

    /* =========================================
       RETURN RESULTS
    ========================================= */

    return NextResponse.json({
      careers: parsed.careers,
    });
  } catch (error: any) {
    console.error(
      "CAREER API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Career generation failed.",
      },
      { status: 500 }
    );
  }
}

