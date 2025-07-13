// Bubble sheet template generator
export const generateBubbleSheetSVG = (questions: number): string => {
  const questionsPerColumn = Math.ceil(questions / 2);
  const bubbleSize = 12;
  const bubbleSpacing = 20;
  const columnSpacing = 200;
  const startX = 50;
  const startY = 100;

  let svg = `
<svg width="612" height="792" xmlns="http://www.w3.org/2000/svg">
  <!-- Header -->
  <text x="306" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold">
    SnapGrade Bubble Sheet - ${questions} Questions
  </text>
  
  <!-- Instructions -->
  <text x="306" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">
    Fill bubbles completely with a #2 pencil. Make no stray marks.
  </text>
  
  <!-- Student Info Section -->
  <rect x="50" y="65" width="512" height="25" fill="none" stroke="#000" stroke-width="1"/>
  <text x="55" y="80" font-family="Arial, sans-serif" font-size="12">
    Name: ________________________  ID: ________________  Date: ___________
  </text>
  
  <!-- Alignment markers -->
  <circle cx="25" cy="25" r="8" fill="#000"/>
  <circle cx="587" cy="25" r="8" fill="#000"/>
  <circle cx="25" cy="767" r="8" fill="#000"/>
  <circle cx="587" cy="767" r="8" fill="#000"/>
`;

  // Generate questions
  for (let q = 1; q <= questions; q++) {
    const column = q <= questionsPerColumn ? 0 : 1;
    const rowInColumn =
      q <= questionsPerColumn ? q - 1 : q - questionsPerColumn - 1;

    const x = startX + column * columnSpacing;
    const y = startY + rowInColumn * (bubbleSpacing + 5);

    // Question number
    svg += `<text x="${x - 20}" y="${
      y + 5
    }" font-family="Arial, sans-serif" font-size="10" text-anchor="end">${q}.</text>`;

    // Answer bubbles A, B, C, D
    ["A", "B", "C", "D"].forEach((letter, index) => {
      const bubbleX = x + index * bubbleSpacing;
      svg += `
        <circle cx="${bubbleX}" cy="${y}" r="${
        bubbleSize / 2
      }" fill="none" stroke="#000" stroke-width="1"/>
        <text x="${bubbleX}" y="${
        y - 15
      }" text-anchor="middle" font-family="Arial, sans-serif" font-size="8">${letter}</text>
      `;
    });
  }

  svg += "</svg>";
  return svg;
};

export const downloadBubbleSheet = (questions: number) => {
  const svg = generateBubbleSheetSVG(questions);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bubble-sheet-${questions}-questions.svg`;
  a.click();
  URL.revokeObjectURL(url);
};
